interface TabsProps {
  activeTab: "stream" | "download";
  onTabChange: (tab: "stream" | "download") => void;
}

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  return (
    <div className="flex space-x-1 rounded-xl bg-gray-800/50 p-1 mb-6">
      <button
        onClick={() => onTabChange("stream")}
        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 
          ${
            activeTab === "stream"
              ? "bg-violet-900/70 text-white shadow"
              : "text-gray-400 hover:bg-gray-700/50"
          }`}
      >
        Stream
      </button>
      <button
        onClick={() => onTabChange("download")}
        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5
          ${
            activeTab === "download"
              ? "bg-violet-900/70 text-white shadow"
              : "text-gray-400 hover:bg-gray-700/50"
          }`}
      >
        Download
      </button>
    </div>
  );
};
