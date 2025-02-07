export interface DownloadResult {
  success: boolean;
  filename: string;
  outputPath?: string;
  timestamp?: string;
}

export interface DownloadError {
  error: string;
  code?: string;
}

export interface WatchPageResponse {
  meeting: Meeting;
  video: Video;
}

interface Meeting {
  _id: string;
  name: string;
  status: string;
  video: Video;
}

interface Video {
  _id: string;
  source: string;
  thumbnail_src: string;
  privacy: string;
  userPermission: string;
}

export interface StreamURLInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}
