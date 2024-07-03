import { useState, useEffect } from "react";
import { useLazyGetSummaryQuery } from "../services/article";
import { copy, linkIcon, loader, tick } from "../assets";
import jsPDF from "jspdf";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [selectedLength, setSelectedLength] = useState("Medium"); // Default length selection
  const [lengthDropdownOpen, setLengthDropdownOpen] = useState(false); // State for length dropdown
  const [historyDropdownOpen, setHistoryDropdownOpen] = useState(false); // State for history dropdown

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

    const { data } = await getSummary({ articleUrl: article.url, length: selectedLength });

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

  const handleHistoryClick = (url) => {
    setArticle({ ...article, url });
    setHistoryDropdownOpen(false); // Close history dropdown after selecting a URL
  };

  const handleLengthSelect = (length) => {
    setSelectedLength(length);
    setLengthDropdownOpen(false); // Close length dropdown after selecting a length
  };

  const handleExportText = () => {
    if (article.summary) {
      const textToExport = `Article Summary:\n\n${article.summary}`;
      const blob = new Blob([textToExport], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "summary.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleExportPDF = () => {
    if (article.summary) {
      const pdf = new jsPDF();
      pdf.text(`Article Summary:`, 15, 15);
      pdf.text(article.summary, 15, 30);
      pdf.save("summary.pdf");
    }
  };

  const handleClearHistory = () => {
    setAllArticles([]);
    localStorage.removeItem('articles');
  };

  return (
    <section className="mt-16 w-full max-w-xl px-4">
      <h1 className="text-3xl font-bold text-center mb-4">How It <span className="blue_gradient">Works?</span></h1>
      <div className="text-[#E1DDDD] text-center">
      <p className="text-l mb-8">1. Enter the URL of the article you want to summarize.</p>
      <p className="text-l mb-8">2. Choose the length of the summary (Short, Medium, Long).</p>
      <p className="text-l mb-8">3. Click the submit button to generate the summary.</p>
      <p className="text-l mb-8">4. View and export the summary in text or PDF format.</p>
      <p className="text-l mb-8">5. Use the history dropdown to view or clear past summaries.</p>
      </div>
      {/* Search */}
      <div className="flex flex-col w-full gap-4">
        <form
          className="relative flex justify-center items-center"
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
            className="url_input peer w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-300 peer-focus:text-gray-300 absolute right-0 mr-3"
          >
            ↵
          </button>
        </form>

        {/* Length Dropdown */}
        <div className="relative flex justify-between items-center gap-4">
          <div className="relative w-1/2">
            <button
              className="length_select py-2 px-3 w-full bg-gray-900 text-white border border-gray-700 rounded-md shadow-lg"
              onClick={() => setLengthDropdownOpen(!lengthDropdownOpen)}
              aria-expanded={lengthDropdownOpen}
              aria-haspopup="true"
            >
              {selectedLength}
            </button>
            {lengthDropdownOpen && (
              <div className="absolute mt-1 w-full rounded-md bg-gray-900 shadow-lg">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <div
                    onClick={() => handleLengthSelect("Short")}
                    className="cursor-pointer text-sm text-gray-300 hover:text-white px-3 py-2"
                    role="menuitem"
                  >
                    Short
                  </div>
                  <div
                    onClick={() => handleLengthSelect("Medium")}
                    className="cursor-pointer text-sm text-gray-300 hover:text-white px-3 py-2"
                    role="menuitem"
                  >
                    Medium
                  </div>
                  <div
                    onClick={() => handleLengthSelect("Long")}
                    className="cursor-pointer text-sm text-gray-300 hover:text-white px-3 py-2"
                    role="menuitem"
                  >
                    Long
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* History Dropdown */}
          <div className="relative w-1/2">
            <button
              className="length_select py-2 px-3 w-full bg-gray-900 text-white border border-gray-700 rounded-md shadow-lg"
              onClick={() => setHistoryDropdownOpen(!historyDropdownOpen)}
              aria-expanded={historyDropdownOpen}
              aria-haspopup="true"
            >
              History
            </button>
            {historyDropdownOpen && (
              <div className="absolute mt-1 w-full max-h-[200px] overflow-y-auto rounded-md bg-gray-900 shadow-lg">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  {allArticles.map((article, index) => (
                    <div
                      key={`history-${index}`}
                      onClick={() => handleHistoryClick(article.url)}
                      className="cursor-pointer text-sm text-gray-300 hover:text-white px-3 py-2 truncate"
                      title={article.url}
                      role="menuitem"
                    >
                      {article.url}
                    </div>
                  ))}
                  <div
                    onClick={handleClearHistory}
                    className="cursor-pointer text-sm text-gray-300 hover:text-white px-3 py-2 mt-2 bg-red-600 rounded-md shadow-lg"
                  >
                    Clear History
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Export Section */}
        {article.summary && (
          <div className="mt-4 flex gap-4 justify-center">
            <button
              onClick={handleExportText}
              className="export_btn py-2 px-4 bg-blue-600 text-white rounded-md shadow-lg transition-all hover:bg-blue-500"
            >
              Export as Text
            </button>
            <button
              onClick={handleExportPDF}
              className="export_btn py-2 px-4 bg-blue-600 text-white rounded-md shadow-lg transition-all hover:bg-blue-500"
            >
              Export as PDF
            </button>
          </div>
        )}

        {/* Display Results */}
        <div className="my-10 max-w-full flex justify-center items-center">
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
              <div className="flex flex-col gap-3">
                <h2 className="font-satoshi font-bold text-gray-300 text-xl">
                  Article <span className="blue_gradient">Summary</span>
                </h2>
                <div className="summary_box p-4 border border-gray-700 rounded-md bg-gray-900">
                  <p className="font-inter font-medium text-sm text-gray-400">
                    {article.summary}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Demo;
