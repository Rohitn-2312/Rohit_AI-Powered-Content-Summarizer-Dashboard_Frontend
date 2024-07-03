import { useState } from "react";
import axios from "axios";
import { useLazyGetSummaryQuery } from "../services/article";

const InputSection = () => {
  const [inputText, setInputText] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [scrapedContent, setScrapedContent] = useState("");
  const [summary, setSummary] = useState("");
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleText: inputText });
    if (data?.summary) {
      setSummary(data.summary);
    }
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(inputUrl);
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, "text/html");
      const paragraphs = doc.querySelectorAll("p");
      let content = "";
      paragraphs.forEach((p) => (content += `${p.textContent}\n`));
      setScrapedContent(content);
      const { data } = await getSummary({ articleUrl: inputUrl });
      if (data?.summary) {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error("Failed to scrape the content:", error);
    }
  };

  return (
    <section className="input-section mt-16 w-full max-w-7xl mx-auto flex">
      <div className="flex-1 flex flex-col gap-6">
        {/* Text Input Box (Box 1) */}
        <form className="flex flex-col gap-2" onSubmit={handleTextSubmit}>
          <textarea
            placeholder="Type or paste your content here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            required
            className="text_input"
          />
          <button type="submit" className="submit_btn">
            Summarize It
          </button>
        </form>

        {/* URL Input */}
        <form className="flex flex-col gap-2 mt-4" onSubmit={handleUrlSubmit}>
          <input
            type="url"
            placeholder="Enter a URL"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            required
            className="url_input"
          />
          <button type="submit" className="submit_btn">
            Scrape & Summarize
          </button>
        </form>
      </div>

      {/* Summary Display Box (Box 2) */}
      <div className="flex-1 flex flex-col gap-6 ml-6">
        <div className="summary-box">
          {isFetching ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error.data.error}</p>
          ) : (
            summary && (
              <div className="summary-content">
                <h2>Summary</h2>
                <p>{summary}</p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default InputSection;
