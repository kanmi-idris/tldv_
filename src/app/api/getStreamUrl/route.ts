import { WatchPageResponse } from "@/types";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const meetingId = searchParams.get("meetingId");

    if (!meetingId) {
      return NextResponse.json(
        { error: "Meeting ID is required" },
        { status: 400 }
      );
    }

    const STREAM_ENDPOINT = `https://gw.tldv.io/v1/meetings/${meetingId}/watch-page?noTranscript=true`;

    const response = await axios.get<WatchPageResponse>(STREAM_ENDPOINT);
    const data = response.data;
    const streamUrl = data?.video?.source ?? data?.meeting?.video?.source;
    console.log("Watch page data:", data);

    if (!streamUrl) {
      return NextResponse.json(
        { error: "Stream URL not found in response" },
        { status: 404 }
      );
    }

    return NextResponse.json({ streamUrl: streamUrl });
  } catch (error) {
    console.error("Failed to retrieve stream URL:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      return NextResponse.json(
        { error: `Failed to retrieve stream URL: ${message}` },
        { status }
      );
    }

    return NextResponse.json(
      { error: "Failed to retrieve stream URL: Unknown error" },
      { status: 500 }
    );
  }
}
