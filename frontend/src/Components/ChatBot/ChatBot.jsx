import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      from: "agent",
      text: "Hi Agent , I want to get the Sales Data analyzed , can u help me ?",
    },
  ]);
  const [botTyping, setBotTyping] = useState(false);
  const [url, setUrl] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [reviewType, setReviewType] = useState(""); // Single or Multiple
  const [numberOfReviews, setNumberOfReviews] = useState(""); // Only for multiple reviews
  const [avgRating, setAvgRating] = useState(""); // Could be for single or average for multiple
  const [ratingContent, setRatingContent] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollChat = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleScrapeHtml = async () => {
    setBotTyping(true);
    // addMessage({ from: "user", text: url });

    console.log("url for scrap", url);

    const response = await fetch("http://localhost:8000/scrape-html", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    const htmlContent = data.summary;
    console.log("response from the api", response);

    if (htmlContent) {
      const cleanHtml = DOMPurify.sanitize(htmlContent);
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanHtml, "text/html");

      const combineAndCleanContent = (selector) => {
        const element = doc.querySelector(selector);
        if (element) {
          element.querySelectorAll("svg").forEach((svg) => svg.remove());
          return element.innerHTML;
        }
        return "";
      };

      const ingredients = combineAndCleanContent(".recipe-ingredients");
      const directions = combineAndCleanContent(".recipe-directions");
      const combinedContent = `
        <div>
          ${ingredients ? ingredients : ""}
          ${directions ? directions : ""}
        </div>
      `;
      console.log("response from the api", htmlContent);
      setRecipe(combinedContent);
      addMessage({ from: "bot", text: combinedContent });
    }
    setBotTyping(false);
    addMessage({
      from: "bot",
      text: "Hi there! I'd be happy to help you analyze your sales data. Please provide the URL or file to analyze the sales data, and I'll get started right away",
    });
  };

  const generateFormatted = async () => {
    setBotTyping(true);
    const response = await fetch("http://localhost:8000/format-scrapped-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    setRecipe(data.summary);
    setBotTyping(false);
    // addMessage({
    //   from: "bot",
    //   text: "Would you like to provide a single or multiple review? (single/multiple)",
    // });
  };

  const handleReviewSubmit = async () => {
    setBotTyping(true);
    const endpoint =
      reviewType === "single" ? "/single-review" : "/multiple-review";
    const payload =
      reviewType === "single"
        ? { rating: avgRating, recipe }
        : { count: numberOfReviews, avgRating, recipe };
    const response = await fetch(`http://localhost:8000${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setRatingContent(data.review);
    setBotTyping(false);
    addMessage({ from: "bot", text: JSON.stringify(data.review) });
  };

  const handleUserInput = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const input = e.target.value.trim().toLowerCase();
      e.target.value = "";
      if (!url) {
        setUrl(input);
        console.log("input to the text box", input);
      } else if (input === "yes") {
        generateFormatted();
      } else if (input === "no") {
        setUrl("");
        setRecipe(null);
        setReviewType("");
        setMessages([
          {
            from: "bot",
            text: "Please provide the URL of the recipe you want to get scraped.",
          },
        ]);
      } else if (input === "single" || input === "multiple") {
        setReviewType(input);
        // addMessage({ from: "user", text: input });
        if (input === "single") {
          addMessage({ from: "bot", text: "Please provide the rating (0-5)." });
        } else {
          addMessage({
            from: "bot",
            text: "Please provide the number of reviews and the average rating (0-5).",
          });
        }
      } else if (reviewType === "single") {
        setAvgRating(input);
        handleReviewSubmit();
      } else if (reviewType === "multiple") {
        const [reviews, avg] = input.split(" ");
        setNumberOfReviews(reviews);
        setAvgRating(avg);
        handleReviewSubmit();
      }
    }
  };

  useEffect(() => {
    scrollChat();
  }, [messages]);

  useEffect(() => {
    handleScrapeHtml();
  }, [url]);

  return (
    <div className="flex-1 p-2 sm:p-6 justify-between  flex flex-col rounded-2xl h-[85vh]  bg-white">
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
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
