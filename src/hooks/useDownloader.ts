import type { DownloadResult, WatchPageResponse } from "@/types";
import { useCallback, useState } from "react";

export function useDownloader() {
  const [downloading, setDownloading] = useState(false);
  const [downloadResult, setDownloadResult] = useState<DownloadResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const retrieveStreamUrl = async (meetingId: string): Promise<string> => {
    console.log(`Retrieving stream URL for meeting ${meetingId}`);
    if (!meetingId) {
      throw new Error("Meeting ID is required");
    }
    const STREAM_ENDPOINT = `https://gw.tldv.io/v1/meetings/${meetingId}/watch-page?noTranscript=true`;
    try {
      const response = await fetch(STREAM_ENDPOINT);
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: WatchPageResponse = await response.json();
      if (!data.video?.source) {
        throw new Error("Stream URL not found in response");
      }
      return data.video.source;
    } catch (err) {
      console.error("Failed to retrieve stream URL", err);
      const errorMessage =
        err instanceof Error
          ? `Failed to retrieve stream URL: ${err.message}`
          : "Failed to retrieve stream URL: Unknown error";
      throw new Error(errorMessage);
    }
  };

  const initiateDownload = async (url: string) => {
    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(`/api/download?url=${encodedUrl}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Download failed");
    }
    return response;
  };

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

      // Create a blob from the response
      const blob = await response.blob();
      // Create a temporary URL for the blob
      const downloadUrl = window.URL.createObjectURL(blob);
      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `video_${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.mp4`; // Set the download filename with timestamp
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setDownloadResult({
        success: true,
        filename: "video.mp4",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setDownloading(false);
    }
  }, []);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return url.toLowerCase().endsWith(".m3u8");
    } catch {
      return false;
    }
  };

  return {
    downloading,
    downloadResult,
    error,
    handleDownload,
  };
}
