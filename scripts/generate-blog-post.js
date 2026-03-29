const fs = require('fs');
const path = require('path');

async function main() {
  try {
    // 환경변수에서 Gemini 인증키를 불러옵니다.
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.log("에러: GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
      return;
    }

    // [1단계] 최신 데이터 확인
    // 파일 경로를 설정하고 데이터를 읽어옵니다.
    const dataFilePath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
    if (!fs.existsSync(dataFilePath)) {
      console.log("에러: 읽어올 데이터 파일(local-info.json)이 존재하지 않습니다.");
      return;
    }

    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    let existingData;
    try {
      existingData = JSON.parse(fileContent);
    } catch (err) {
      console.log("에러: 데이터 파일을 해석할 수 없습니다.", err.message);
      return;
    }

    // 데이터가 배열인지 객체 형태인지 확인해서 최신 항목을 찾아냅니다.
    let allItems = [];
    if (Array.isArray(existingData)) {
      allItems = existingData;
    } else {
      allItems = [...(existingData.events || []), ...(existingData.benefits || [])];
    }

    if (allItems.length === 0) {
      console.log("에러: 데이터 파일에 서비스 정보가 없습니다.");
      return;
    }

    // 전체 항목들 중 마지막 항목(최신으로 여겨지는)을 선택합니다.
    const latestItem = allItems[allItems.length - 1];

    // 생성할 글이 들어갈 폴더 경로를 확인하고, 없으면 만듭니다.
    const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    // 폴더 내의 파일들을 비교하여, 서비스명(name)이 포함된 글이 이미 있는지 확인합니다.
    const files = fs.readdirSync(postsDir);
    let isAlreadyWritten = false;
    for (const fileName of files) {
      if (fileName.endsWith('.md')) {
        const postContent = fs.readFileSync(path.join(postsDir, fileName), 'utf8');
        // 작성된 글의 내용에 해당 아이템의 이름이 들어있으면 중복으로 간주합니다.
        if (postContent.includes(latestItem.name)) {
          isAlreadyWritten = true;
          break;
        }
      }
    }

    if (isAlreadyWritten) {
      console.log("이미 작성된 글입니다");
      return;
    }

    // [2단계] Gemini AI로 블로그 글 생성
    const promptText = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(latestItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: (오늘 날짜 YYYY-MM-DD)
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: YYYY-MM-DD-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    // 외부 패키지 없이 내장 fetch를 이용해 AI 서비스로 요청을 보냅니다.
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    if (!response.ok) {
      console.log("에러: Gemini AI를 호출하는 중에 문제가 생겼습니다. 상태코드:", response.status);
      return;
    }

    const resData = await response.json();
    const resultText = resData.candidates[0].content.parts[0].text;

    // AI의 답변에서 FILENAME 부분과 실제 블로그 글 내용을 깔끔하게 분리합니다.
    const lines = resultText.split('\n');
    let finalContentLines = [];
    let filename = '';

    for (const line of lines) {
      if (line.trim().startsWith('FILENAME:')) {
        // 'FILENAME: ' 글자를 지우고 파일 이름만 쏙 뽑아냅니다.
        filename = line.replace('FILENAME:', '').trim();
      } else {
        finalContentLines.push(line);
      }
    }

    if (!filename) {
      console.log("에러: AI가 규칙을 잊고 파일명을 만들어주지 않았습니다.");
      return;
    }

    // 확장자가 .md로 끝나지 않으면 붙여줍니다.
    if (!filename.endsWith('.md')) {
      filename += '.md';
    }

    // [3단계] 파일 저장
    const resultBlogText = finalContentLines.join('\n').trim();
    const savePath = path.join(postsDir, filename);
    
    fs.writeFileSync(savePath, resultBlogText, 'utf8');

    console.log("새로운 블로그 글 생성 및 저장이 완료되었습니다:", filename);

  } catch (err) {
    console.log("예상치 못한 에러가 발생했습니다:", err.message);
  }
}

// 스크립트를 실행시킵니다.
main();
