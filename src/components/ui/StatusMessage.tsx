interface StatusMessageProps {
  error: string | null;
  success?: boolean;
  filename?: string;
}

export const StatusMessage = ({
  error,
  success,
  filename,
}: StatusMessageProps) => {
  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-900/20 border border-red-800/30 text-red-200">
        {error}
      </div>
    );
  }

  if (success && filename) {
    return (
      <div className="p-4 rounded-lg bg-green-900/20 border border-green-800/30 text-green-200">
        Successfully downloaded: {filename}
      </div>
    );
  }

  return null;
};
