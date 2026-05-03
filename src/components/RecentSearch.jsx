function RecentSearch({ recentHistory, setRecentHistory, setSelectedHistory }) {
  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  };

  const clearSelectedHistory = (selectedItem) => {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history = history.filter((item) => item !== selectedItem);
    setRecentHistory(history);
    localStorage.setItem("history", JSON.stringify(history));
  };

  return (
    <div className="col-span-1 h-screen bg-zinc-100 dark:bg-zinc-900 border-r border-zinc-300 dark:border-zinc-700 p-3 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-lg font-semibold">Recent</h2>
        <button onClick={clearHistory} className="text-red-500 text-sm">
          Clear
        </button>
      </div>

      {/* List */}
      <div className="space-y-1">
        {recentHistory.map((item, index) => (
          <div key={index} className="flex items-center justify-between group">
            <div
              onClick={() => setSelectedHistory(item)}
              className="flex-1 px-3 py-2 rounded-lg text-sm cursor-pointer truncate hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              {item}
            </div>

            <button
              onClick={() => clearSelectedHistory(item)}
              className="opacity-0 group-hover:opacity-100 text-red-500 px-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentSearch;
