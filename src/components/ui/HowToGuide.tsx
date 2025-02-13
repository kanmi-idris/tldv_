export const HowToGuide = () => (
  <div className="mt-4 p-4 rounded-lg bg-gray-800/30 border border-gray-700/50">
    <h3 className="text-lg font-medium text-gray-200 mb-3">
      How to get the meeting link:
    </h3>
    <ol className="list-decimal list-inside space-y-2 text-gray-300">
      <li>
        Open your TLDV website{" "}
        <code className="inline-block p-1 rounded bg-gray-900/50 text-violet-400 text-xs break-all">
          https://tldv.io/
        </code>
        in the browser
      </li>
      <li>Login to your account and select the meeting you want to watch</li>
      <li>Look at your browser&apos;s address bar</li>
      <li>
        Copy the full URL that looks like:
        <code className="block mt-1 p-2 rounded bg-gray-900/50 text-violet-400 text-sm break-all">
          https://tldv.io/app/meetings/123456789...
        </code>
      </li>
      <li>Paste it in the input field above</li>
    </ol>
  </div>
);
