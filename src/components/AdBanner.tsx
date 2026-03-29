'use client';

import { useEffect } from 'react';

const AdBanner = () => {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  
  if (!adsenseId || adsenseId === '나중에_입력') {
    return null;
  }

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense 발송 에러:", err);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-8 overflow-hidden">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '300px', minHeight: '100px' }}
        data-ad-client={adsenseId}
        data-ad-slot="auto" // 실제 사용시 슬롯 ID로 변경 필요
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
