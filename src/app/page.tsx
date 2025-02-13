"use client";

import { BackgroundAnimation } from "@/components/ui/BackgroundAnimation";
import { Button } from "@/components/ui/Button";
import { HowToGuide } from "@/components/ui/HowToGuide";
import { IframePlayer } from "@/components/ui/IframePlayer";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { Tabs } from "@/components/ui/Tabs";
import { useDownloader } from "@/hooks/useDownloader";
import axios from "axios";
import { useState } from "react";

interface StreamURLInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const URLInput = ({ value, onChange, disabled }: StreamURLInputProps) => (
  <div className="space-y-2">
    <label htmlFor="Url" className="block text-gray-200 font-medium">
      Recording URL
    </label>
    <input
      id="Url"
      type="url"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all disabled:opacity-50"
      placeholder="https://tldv.io/app/meetings/765..."
    />
  </div>
);

export default function Home() {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"stream" | "download">("stream");
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const { downloading, downloadResult, error, handleDownload } =
    useDownloader();
  const [isLoadingStream, setIsLoadingStream] = useState(false);

  const getMeetingId = (url: string) => {
    try {
      const urlParts = new URL(url);
      const pathSegments = urlParts.pathname.split("/");
      const meetingId = pathSegments[3];

      return meetingId;
    } catch (error) {
      console.error("Error parsing URL:", error);
      return "";
    }
  };

  const handleUrlSubmit = async () => {
    try {
      setIsLoadingStream(true);
      setStreamUrl(null); // Reset previous stream
      const meetingId = getMeetingId(meetingUrl);
      const response = await axios.get(
        `/api/getStreamUrl?meetingId=${meetingId}`
      );
      setStreamUrl(response.data.streamUrl);
    } catch (err) {
      console.error("Failed to get stream URL:", err);
    } finally {
      setIsLoadingStream(false);
    }
  };

  const isActionDisabled =
    !meetingUrl || (activeTab === "download" && downloading);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-950 p-6 relative">
      <BackgroundAnimation />

      <section className="max-w-3xl w-full backdrop-blur-md bg-gray-900/40 rounded-2xl p-8 shadow-2xl border border-gray-700">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            TLDV Downloader
          </h1>
          <p className="text-gray-200 text-lg mb-2">
            Enter a tldv recording link to stream or download.
          </p>
        </header>

        <URLInput
          value={meetingUrl}
          onChange={setMeetingUrl}
          disabled={downloading}
        />

        <HowToGuide />

        <div className="mt-8">
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "stream" ? (
            <div className="space-y-4">
              <button
                onClick={handleUrlSubmit}
                disabled={!meetingUrl || isLoadingStream}
                className="w-full px-4 py-2 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingStream ? "Loading..." : "Load Stream"}
              </button>
              <IframePlayer streamUrl={streamUrl} isLoading={isLoadingStream} />
            </div>
          ) : (
            <footer className="space-y-4">
              <Button
                onClick={() => {
                  const meetingId = getMeetingId(meetingUrl);
                  handleDownload(meetingId);
                }}
                disabled={isActionDisabled}
                loading={downloading}
              />
              <StatusMessage
                error={error}
                success={downloadResult?.success}
                filename={downloadResult?.filename}
              />
            </footer>
          )}
        </div>
      </section>
    </main>
  );
}
