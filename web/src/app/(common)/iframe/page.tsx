"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

// 创建一个组件来使用 useSearchParams
function IframeContent() {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从URL参数中获取要嵌入的页面URL
    const srcParam = searchParams.get("src");
    if (srcParam) {
      try {
        const decodedUrl = decodeURIComponent(srcParam);
        // 验证URL格式
        new URL(decodedUrl);
        setUrl(decodedUrl);
      } catch (e) {
        console.error("URL格式不正确:", e);
      }
    }
  }, [searchParams]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <div className="h-full w-full">
      {loading && url && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {url && (
        <iframe
          src={url}
          className="w-full h-full border-none"
          onLoad={handleIframeLoad}
          allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; payment"
          referrerPolicy="no-referrer"
        ></iframe>
      )}
    </div>
  );
}

// 主页面组件使用 Suspense 包装内容组件
export default function IframePage() {
  return (
    <Suspense fallback={
      <div className="absolute inset-0 flex justify-center items-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <IframeContent />
    </Suspense>
  );
}