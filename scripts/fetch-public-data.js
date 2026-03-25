import fs from 'fs/promises';
import path from 'path';

// 폴더 및 파일 경로 설정
const DATA_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'local-info.json');

async function main() {
  try {
    // 1단계: 공공데이터포털 API에서 데이터 가져오기
    const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
    if (!PUBLIC_DATA_API_KEY) {
      throw new Error('PUBLIC_DATA_API_KEY 환경변수가 설정되지 않았습니다.');
    }

    const url = new URL('https://api.odcloud.kr/api/gov24/v3/serviceList');
    url.searchParams.append('page', '1');
    url.searchParams.append('perPage', '20');
    url.searchParams.append('returnType', 'JSON');
    
    // API 키는 url 파라미터나 헤더로 전달
    url.searchParams.append('serviceKey', PUBLIC_DATA_API_KEY);

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Infuser ${PUBLIC_DATA_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`공공데이터 API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    const items = data.data || [];

    if (items.length === 0) {
      console.log('API에서 가져온 데이터가 없습니다.');
      return;
    }

    // 2단계: 기존 데이터와 비교
    let existingData = { events: [], benefits: [] };
    let flatExistingData = [];
    try {
      const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
      existingData = JSON.parse(fileContent);
      // 기존 JSON 구조가 배열인지, { events: [], benefits: [] } 객체인지 확인
      if (Array.isArray(existingData)) {
          flatExistingData = existingData;
          existingData = { events: existingData.filter(e => e.category === '행사'), benefits: existingData.filter(e => e.category !== '행사') };
      } else {
          flatExistingData = [...(existingData.events || []), ...(existingData.benefits || [])];
      }
    } catch (e) {
      console.log('기존 데이터를 읽을 수 없거나 파일이 없습니다. 새로 배열을 생성합니다.');
    }

    const existingNames = new Set(flatExistingData.map(item => item.name));

    // 새로운 항목 필터링 ("서비스명" 속성이 원본 데이터 이름임)
    const newItems = items.filter(item => {
      const itemName = item.서비스명 || item.name || '';
      return !existingNames.has(itemName);
    });

    if (newItems.length === 0) {
      console.log('새로운 데이터가 없습니다');
      return;
    }

    // 우선순위 필터링 (미추홀 -> 인천 -> 전체)
    const isMatched = (item, keyword) => {
      const text = [
        item.서비스명,
        item.서비스목적요약,
        item.지원대상,
        item.소관기관명
      ].join(' ');
      return text.includes(keyword);
    };

    let selectedItems = newItems.filter(item => isMatched(item, '미추홀'));
    if (selectedItems.length === 0) {
      selectedItems = newItems.filter(item => isMatched(item, '인천'));
    }
    if (selectedItems.length === 0) {
      selectedItems = newItems;
    }

    // 1건만 선택
    const targetItem = selectedItems[0];

    // 3단계: Gemini AI로 새 항목 1개만 가공
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

공공데이터 원본:
${JSON.stringify(targetItem, null, 2)}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API 호출 실패: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    let resultText = geminiData.candidates[0].content.parts[0].text;

    // 마크다운 코드블록 제거
    resultText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const parsedItem = JSON.parse(resultText);

    // 4단계: 기존 데이터에 추가
    const currentMaxId = flatExistingData.reduce((max, item) => Math.max(max, item.id || 0), 0);
    parsedItem.id = currentMaxId + 1;

    if (parsedItem.category === '행사') {
        if (!existingData.events) existingData.events = [];
        existingData.events.push(parsedItem);
    } else {
        if (!existingData.benefits) existingData.benefits = [];
        existingData.benefits.push(parsedItem);
    }

    // 파일 저장
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(existingData, null, 2), 'utf-8');

    console.log(`성공적으로 데이터를 가공하여 추가했습니다: ${parsedItem.name}`);

  } catch (error) {
    console.error('실행 중 에러 발생 (기존 데이터 유지):', error.message);
  }
}

main();
