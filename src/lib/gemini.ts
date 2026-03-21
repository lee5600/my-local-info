import { GoogleGenAI } from "@google/genai";

// Gemini AI 기능 초기화 
// (.env 파일이나 Vercel/Cloudflare 환경변수에서 GEMINI_API_KEY를 읽어옵니다)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateBlogPost(eventData: any) {
  try {
    const prompt = `당신은 친절한 우리 동네 정보 알리미입니다. 
다음 행사 및 지원금 정보를 바탕으로 우리 동네 주민들이 읽기 쉽고 흥미로운 블로그 포스팅 글을 작성해주세요.
이목을 끄는 제목과 이모지도 적절하게 사용해주세요. 핵심 정보(날짜, 장소 등)는 빠짐없이 기재해야 합니다.

정보:
${JSON.stringify(eventData)}

형식: Markdown 문서로 예쁘게 작성해주세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini AI 호출 중 오류 발생:", error);
    return "글 생성에 실패했습니다. API 키나 네트워크 상태를 확인해주세요.";
  }
}
