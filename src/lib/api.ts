// 이 파일은 "공공데이터포털(data.go.kr)"에서 정보를 가져오는 역할을 합니다.
export async function getLocalEvents() {
  const API_KEY = process.env.PUBLIC_DATA_API_KEY;

  // TODO: 나중에 실제 공공데이터포털 API 주소를 연결합니다!
  // 지금은 화면에 예쁘게 그리기 위해 가짜(Mock) 데이터를 만들어 둡니다.
  return [
    {
      id: 1,
      title: "2026 로맨틱 벚꽃 축제",
      date: "2026.04.01 ~ 2026.04.10",
      location: "우리동네 호수공원 일대",
      description: "매년 봄 열리는 아름다운 벚꽃 축제입니다. 다양한 푸드트럭과 공연이 준비되어 있습니다.",
      tag: "축제",
      isHot: true,
    },
    {
      id: 2,
      title: "소상공인 활력 지원금",
      date: "2026.03.15 ~ 2026.05.31",
      location: "온라인 및 주민센터",
      description: "관내 소상공인을 위한 특별 지원금입니다. 최대 100만원 지원 혜택을 놓치지 마세요.",
      tag: "지원금",
      isHot: false,
    },
    {
        id: 3,
        title: "동네 청년 취업 특강",
        date: "2026.05.01 ~ 2026.05.02",
        location: "시립 도서관 3층 강당",
        description: "최신 트렌드를 반영한 AI/IT 분야 취업 특강이 이틀간 무료로 진행됩니다.",
        tag: "교육",
        isHot: true,
    }
  ];
}
