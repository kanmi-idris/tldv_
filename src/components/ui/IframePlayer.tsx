import { useState } from "react";
import { Loader } from "./Loader";

interface IframePlayerProps {
  streamUrl: string | null;
  isLoading?: boolean;
}

export const IframePlayer = ({ streamUrl, isLoading }: IframePlayerProps) => {
  const [iframeLoading, setIframeLoading] = useState(true);

  if (!streamUrl) return null;
  if (isLoading) return <Loader />;

  const encodedUrl = encodeURIComponent(streamUrl);
  const playerUrl = `https://www.hlsplayer.net/embed?type=m3u8&src=${encodedUrl}`;

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-800/50 relative">
      {iframeLoading && <Loader />}
      <iframe
        title="HLS Video Player"
        src={playerUrl}
        className={`w-full h-full ${
          iframeLoading ? "opacity-0" : "opacity-100"
        }`}
        allowFullScreen
        allow="autoplay; encrypted-media"
        onLoad={() => setIframeLoading(false)}
      />
    </div>
  );
};
