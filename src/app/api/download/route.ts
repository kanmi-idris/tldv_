import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import { NextResponse } from "next/server";
import { PassThrough } from "stream";

// Resolve ffmpeg executable path correctly.
const resolvedFfmpegPath =
  typeof ffmpegPath === "string"
    ? ffmpegPath
    : (ffmpegPath as any)?.default || ffmpegPath;
ffmpeg.setFfmpegPath(resolvedFfmpegPath);

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

    // Create a PassThrough stream for fluent-ffmpeg output
    const passthrough = new PassThrough();

    ffmpeg(m3u8Url)
      .outputOptions("-c", "copy", "-bsf:a", "aac_adtstoasc")
      .format("mp4")
      .on("error", (err) => {
        console.error("fluent-ffmpeg error:", err);
        passthrough.end();
      })
      // Pipe output to the PassThrough stream
      .pipe(passthrough, { end: true });

    return new NextResponse(
      new ReadableStream({
        start(controller) {
          passthrough.on("data", (chunk) => controller.enqueue(chunk));
          passthrough.on("end", () => controller.close());
          passthrough.on("error", (err) => controller.error(err));
        },
      }),
      { headers }
    );
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
