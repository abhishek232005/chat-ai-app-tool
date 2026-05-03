import Answer from "./Answers";
const QuestionAnswer = ({ item, index }) => {
  return (
    <>
      <div
        key={index + Math.random()}
        className={item.type == "q" ? "flex justify-end" : ""}
      >
        {item.type == "q" ? (
          <li
            key={index + Math.random()}
            className="text-left px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-2xl max-w-xl"
          >
            <Answer
              ans={item.text}
              totalResult={1}
              index={index}
              type={item.type}
            />
          </li>
        ) : (
          item.text.map((ansItem, ansIndex) => (
            <li key={ansIndex + Math.random()} className="text-left p-1">
              <Answer
                ans={ansItem}
                totalResult={item.length}
                type={item.type}
                index={ansIndex}
              />
            </li>
          ))
        )}
      </div>
    </>
  );
};

export default QuestionAnswer;
