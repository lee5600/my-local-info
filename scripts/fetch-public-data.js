const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!PUBLIC_DATA_API_KEY || !GEMINI_API_KEY) {
      console.log("필요한 API 키가 없습니다(PUBLIC_DATA_API_KEY 또는 GEMINI_API_KEY). 환경변수를 확인해주세요.");
      return;
    }

    // [1단계] 공공데이터포털 API에서 데이터 가져오기
    const url = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON&serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.log("공공데이터를 가져오는데 실패했습니다 상태코드:", response.status);
      return;
    }
    
    const dataObj = await response.json();
    const items = dataObj.data || [];

    const hasKeyword = (item, keyword) => {
      const fields = [item.서비스명, item.서비스목적요약, item.지원대상, item.소관기관명];
      return fields.some(field => field && typeof field === 'string' && field.includes(keyword));
    };

    let filteredItems = items.filter(item => hasKeyword(item, "성남"));
    
    if (filteredItems.length === 0) {
      filteredItems = items.filter(item => hasKeyword(item, "경기"));
    }
    
    if (filteredItems.length === 0) {
      filteredItems = items;
    }

    // [2단계] 기존 데이터와 비교하기
    const dataFilePath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
    let existingData = { events: [], benefits: [] };
    
    if (fs.existsSync(dataFilePath)) {
      try {
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        existingData = JSON.parse(fileContent);
        
        // 배열([])의 경우
        if (Array.isArray(existingData)) {
            existingData = { events: existingData, benefits: [] };
        }
      } catch (err) {
        console.log("기존 파일 정보를 읽는 중 에러가 발생했습니다:", err.message);
        return;
      }
    }

    // 기존 데이터의 events, benefits 합쳐서 이름 뽑아내기
    const existingNames = [
      ...(existingData.events || []).map(item => item.name),
      ...(existingData.benefits || []).map(item => item.name)
    ];
    
    const newItem = filteredItems.find(item => !existingNames.includes(item.서비스명));

    if (!newItem) {
      console.log("새로운 데이터가 없습니다");
      return;
    }

    // [3단계] Gemini AI로 가공
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const promptText = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

공공데이터:
${JSON.stringify(newItem, null, 2)}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    if (!geminiResponse.ok) {
      console.log("AI에게 변환을 요청하는데 실패했습니다 상태코드:", geminiResponse.status);
      return;
    }

    const geminiData = await geminiResponse.json();
    let resultText = geminiData.candidates[0].content.parts[0].text;
    resultText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();

    let finalItem;
    try {
      finalItem = JSON.parse(resultText);
    } catch (err) {
      console.log("AI가 가공한 결과를 올바른 형태(JSON)로 바꾸는데 실패했습니다:", err.message);
      return;
    }

    // [4단계] 추가 및 저장
    // 가장 큰 id 찾아서 1 더해주기
    if (!finalItem.id || isNaN(finalItem.id)) {
        const allItems = [...(existingData.events || []), ...(existingData.benefits || [])];
        const maxId = allItems.length > 0 ? Math.max(...allItems.map(item => item.id || 0)) : 0;
        finalItem.id = maxId + 1;
    }

    if (finalItem.category === '행사' || finalItem.category === '축제') {
        if (!existingData.events) existingData.events = [];
        existingData.events.push(finalItem);
    } else {
        if (!existingData.benefits) existingData.benefits = [];
        existingData.benefits.push(finalItem);
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2), 'utf8');
    
    console.log(`성공적으로 처리되었습니다. 새로 추가된 항목: ${finalItem.name}`);

  } catch (error) {
    console.log("예상치 못한 에러가 발생했습니다:", error.message);
  }
}

main();
