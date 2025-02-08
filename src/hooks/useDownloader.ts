import type { DownloadResult } from "@/types";
import axios from "axios";
import { useCallback, useState } from "react";

export function useDownloader() {
  const [downloading, setDownloading] = useState(false);
  const [downloadResult, setDownloadResult] = useState<DownloadResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleDownload = useCallback(async (meetingId: string) => {
    setDownloading(true);
    setError(null);
    setDownloadResult(null);

    try {
      const url = await retrieveStreamUrl(meetingId);
      console.log(`Downloading stream from URL: ${url}`);

      if (!isValidUrl(url)) {
        throw new Error("Invalid stream URL");
      }

      const response = await initiateDownload(url);

      const downloadUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");

      const FILE_NAME = `video_${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.mp4`;

      link.href = downloadUrl;
      link.download = FILE_NAME;

      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setDownloadResult({
        success: true,
        filename: FILE_NAME,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "An error occurred"
      );
    } finally {
      setDownloading(false);
    }
  }, []);

  return {
    downloading,
    downloadResult,
    error,
    handleDownload,
  };
}

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return url.toLowerCase().endsWith(".m3u8");
  } catch {
    return false;
  }
};

const retrieveStreamUrl = async (meetingId: string) => {
  const response = await axios.get(`/api/getStreamUrl?meetingId=${meetingId}`);
  if (!response.data.streamUrl) {
    throw new Error("Stream URL not found in response");
  }
  return response.data.streamUrl;
};

const initiateDownload = async (url: string) => {
  const encodedUrl = encodeURIComponent(url);
  const response = await axios.get(`/api/download?url=${encodedUrl}`, {
    responseType: "blob",
  });
  return response;
};
