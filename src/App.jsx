import { useEffect, useRef, useState } from "react";
import { URL } from "./constants";
import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || [],
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollToAns = useRef(null);
  const [loader, setLoader] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // ✅ SCROLL FIX (IMPORTANT)
  useEffect(() => {
    scrollToAns.current?.scrollTo({
      top: scrollToAns.current.scrollHeight,
      behavior: "smooth",
    });
  }, [result]);

  const askQuestion = async () => {
    if (!question && !selectedHistory) return;

    if (question) {
      let history = JSON.parse(localStorage.getItem("history")) || [];
      history = [question, ...history.slice(0, 19)];
      history = [...new Set(history)];
      localStorage.setItem("history", JSON.stringify(history));
      setRecentHistory(history);
    }

  const payloadData = question || selectedHistory;

    const payload = {
      contents: [{ parts: [{ text: payloadData }] }],
    };

    setLoader(true);

    try {
      let res = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ FIX
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // ✅ ERROR CHECK (IMPORTANT)
      if (!res.ok) {
        console.error("API Error:", data);
        setLoader(false);
        return;
      }

      // ✅ SAFE ACCESS
      let dataString =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      dataString = dataString?.split("* ")?.map((item) => item.trim());

      // ✅ STATE UPDATE
      setResult((prev) => [
        ...prev,
        { type: "q", text: payloadData },
        { type: "a", text: dataString },
      ]);

      setQuestion("");
    } catch (error) {
      console.error("Fetch Error:", error);
    }

    setLoader(false);
  };

  const isEnter = (e) => {
    if (e.key === "Enter") askQuestion();
  };

  useEffect(() => {
    if (selectedHistory) askQuestion();
  }, [selectedHistory]);

  return (
    <div className="h-screen grid grid-cols-5 bg-white dark:bg-black text-black dark:text-white">
      {/* Sidebar */}
      <RecentSearch
        recentHistory={recentHistory}
        setRecentHistory={setRecentHistory}
        setSelectedHistory={setSelectedHistory}
      />

      {/* Main */}
      <div className="col-span-4 h-screen flex flex-col relative">
        {/* Dark Mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-5 right-5 px-4 py-1 rounded-full bg-zinc-800 text-white text-sm"
        >
          {darkMode ? "Light" : "Dark"}
        </button>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-semibold text-center mt-10 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          Hello User, Ask me Anything
        </h1>

        {/* Loader CENTER */}
        {loader && (
          <div className="flex-1 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Chat Area */}
        {!loader && (
          <div className="flex-1 flex justify-center overflow-hidden mt-6">
            <div
              ref={scrollToAns}
              className="w-full max-w-3xl h-full overflow-y-auto space-y-4 px-4 pb-32"
            >
              {result.length === 0 && (
                <div className="text-center text-zinc-400 mt-20">
                  Start asking questions 👇
                </div>
              )}

              {result.map((item, index) => (
                <QuestionAnswer key={index} item={item} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Input Bottom FIX */}
        <div className="w-full flex justify-center p-4 border-t border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black">
          <div className="w-full max-w-2xl flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg focus-within:ring-2 focus-within:ring-purple-500">
            <input
              type="text"
              value={question}
              onKeyDown={isEnter}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything"
              className="flex-1 bg-transparent outline-none px-2 py-2 text-sm"
            />

            <button
              onClick={askQuestion}
              className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
