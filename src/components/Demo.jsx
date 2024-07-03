import { useState, useEffect } from "react";
import { useLazyGetSummaryQuery } from "../services/article";
import { jsPDF } from "jspdf";  // Import jsPDF
import { copy, linkIcon, loader, tick } from "../assets";  // Add a download icon to assets

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
    length: "short",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem('articles')
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await getSummary({ articleUrl: article.url, length: article.length });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);

      localStorage.setItem('articles', JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleExport = (format) => {
    if (format === "txt") {
      const element = document.createElement("a");
      const file = new Blob([article.summary], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "summary.txt";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    } else if (format === "pdf") {
      const doc = new jsPDF();
      doc.text(article.summary, 10, 10);
      doc.save("summary.pdf");
    }
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* Search */}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center gap-2"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-300 peer-focus:text-gray-300"
          >
            ↵
          </button>
        </form>
        <select
          value={article.length}
          onChange={(e) => setArticle({ ...article, length: e.target.value })}
          className="length_select"
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>

        {/* Browse URL History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((article, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(article)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopy(article.url)}>
                <img
                  src={copied === article.url ? tick : copy}
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {article.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Display Results */}
      <div className="my-10 max-w-full flex flex-col items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-white text-center">
            Well, that wasn&apos;t supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-400">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3 w-full">
              <h2 className="font-satoshi font-bold text-gray-300 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-400">
                  {article.summary}
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleExport("txt")} className="export_btn">
                  Export as Text
                </button>
                <button onClick={() => handleExport("pdf")} className="export_btn">
                  Export as PDF
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
