"use client";

import { BackgroundAnimation } from "@/components/ui/BackgroundAnimation";
import { Button } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { useDownloader } from "@/hooks/useDownloader";
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
  const { downloading, downloadResult, error, handleDownload } =
    useDownloader();

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

  const isDownloadDisabled = downloading || !meetingUrl; // Use meetingUrl

  const handleDownloadClick = () => {
    const meetingId = getMeetingId(meetingUrl);
    console.log(`Meeting ID: ${meetingId}`);

    handleDownload(meetingId);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-950 p-6 relative">
      <BackgroundAnimation />

      <section className="max-w-2xl w-full backdrop-blur-md bg-gray-900/40 rounded-2xl p-8 shadow-2xl border border-gray-700">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            TLDV Downloader
          </h1>
          <p className="text-gray-200 text-lg mb-2">
            Enter a tldv recording link to download.
          </p>
        </header>

        <URLInput
          value={meetingUrl} // Use meetingUrl
          onChange={(value) => setMeetingUrl(value)} // Store the full URL
          disabled={downloading}
        />

        <footer className="mt-8 space-y-4">
          <Button
            onClick={handleDownloadClick} // Call handleDownloadClick
            disabled={isDownloadDisabled}
            loading={downloading}
          />

          <StatusMessage
            error={error}
            success={downloadResult?.success}
            filename={downloadResult?.filename}
          />
        </footer>
      </section>
    </main>
  );
}
