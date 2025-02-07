import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const m3u8Url = searchParams.get("url");

    if (!m3u8Url || !m3u8Url.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid URL parameter" },
        { status: 400 }
      );
    }

    const headers = new Headers();
    headers.set("Content-Disposition", 'attachment; filename="video.mp4"');
    headers.set("Content-Type", "video/mp4");

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const ffmpegArgs = [
      "-i",
      m3u8Url,
      "-c",
      "copy",
      "-bsf:a",
      "aac_adtstoasc",
      "-f",
      "mp4",
      "pipe:1",
    ];

    const ffmpegProcess = spawn(ffmpegPath!, ffmpegArgs);

    ffmpegProcess.stdout.on("data", async (chunk) => {
      await writer.write(chunk);
    });

    ffmpegProcess.stderr.on("data", (data) => {
      console.error(`ffmpeg error: ${data}`);
    });

    ffmpegProcess.on("close", async (code) => {
      if (code !== 0) {
        console.error(`ffmpeg exited with code ${code}`);
      }
      await writer.close();
    });

    ffmpegProcess.on("error", async (err) => {
      console.error("Failed to start ffmpeg process:", err);
      await writer.close();
    });

    return new NextResponse(stream.readable, { headers });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
