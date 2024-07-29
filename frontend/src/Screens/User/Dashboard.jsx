import React, { useState, useEffect, useRef } from "react";
import { webURL } from "../../constantx";

const Dashboard = () => {
  const [messages, setMessages] = useState([
    {
      from: "agent",
      text: "Hi Agent, I want to get the Sales Data analyzed, can you help me?",
    },
  ]);
  const [botTyping, setBotTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollChat = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleUserInput = async (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const userInput = e.target.value.trim();
      e.target.value = "";

      addMessage({ from: "user", text: userInput });

      setBotTyping(true);

      try {
        const send_by = localStorage.getItem("user_id");
        const response = await fetch(webURL+"api/chatbot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            human_input: userInput,
            send_by: send_by,
          }),
        });
        const data = await response.json();
        const botResponse = data.response;
        addMessage({ from: "bot", text: botResponse });
      } catch (error) {
        console.error("Error fetching chatbot response:", error);
        addMessage({
          from: "bot",
          text: "Sorry, I couldn't process your request. Please try again later.",
        });
      }

      setBotTyping(false);
    }
  };

  useEffect(() => {
    scrollChat();
  }, [messages]);

  return (
    <div className="flex-1 p-2 sm:p-6 justify-between flex flex-col rounded-2xl h-[85vh] bg-white">
      <div
        id="messages"
        className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        {messages.map((message, key) => (
          <div key={key}>
            <div
              className={`flex items-end ${
                message.from === "bot" ? "" : "justify-end"
              }`}
            >
              <div
                className={`flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 ${
                  message.from === "bot"
                    ? "order-2 items-start"
                    : "order-1 items-end"
                }`}
              >
                <div>
                  <span
                    className={`px-4 py-3 rounded-xl inline-block ${
                      message.from === "bot"
                        ? "rounded-bl-none bg-gray-100 text-gray-600"
                        : "rounded-br-none bg-[#009688] text-white"
                    }`}
                    dangerouslySetInnerHTML={{ __html: message.text }}
                  ></span>
                </div>
              </div>
              <img
                src={
                  message.from === "bot"
                    ? "https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png"
                    : "https://i.pravatar.cc/100?img=7"
                }
                alt=""
                className={`w-6 h-6 rounded-full ${
                  message.from === "bot" ? "order-1" : "order-2"
                }`}
              />
            </div>
          </div>
        ))}
        {botTyping && (
          <div className="flex items-end">
            <div className="flex flex-col space-y-2 text-md leading-tight mx-2 order-2 items-start">
              <div>
                <img
                  src="https://support.signal.org/hc/article_attachments/360016877511/typing-animation-3x.gif"
                  alt="Typing..."
                  className="w-16 ml-6"
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex">
          <input
            type="text"
            placeholder="Type a message..."
            autoComplete="off"
            autoFocus
            onKeyDown={handleUserInput}
            className="text-md w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 pr-16 bg-gray-100 border-2 border-gray-200 focus:border-[#009688] rounded-full py-2"
            ref={inputRef}
          />
          <button
            type="submit"
            className="text-white bg-green-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
