"use client";

import { BackgroundAnimation } from "@/components/ui/BackgroundAnimation";
import { Button } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { useDownloader } from "@/hooks/useDownloader";
import { StreamURLInputProps } from "@/types";
import { useState } from "react";

const StreamURLInput = ({ value, onChange, disabled }: StreamURLInputProps) => (
  <div className="space-y-2">
    <label htmlFor="streamUrl" className="block text-gray-200 font-medium">
      Stream URL
    </label>
    <input
      id="streamUrl"
      type="url"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 
        placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 
        focus:border-transparent transition-all disabled:opacity-50"
      placeholder="https://example.com/playlist.m3u8"
    />
  </div>
);

export default function Home() {
  const [meetingId, setMeetingId] = useState("");
  const { downloading, downloadResult, error, handleDownload } =
    useDownloader();

  const isDownloadDisabled = downloading || !meetingId;

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

        <StreamURLInput
          value={meetingId}
          onChange={setMeetingId}
          disabled={downloading}
        />

        <footer className="mt-8 space-y-4">
          <Button
            onClick={() => handleDownload(meetingId)}
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
