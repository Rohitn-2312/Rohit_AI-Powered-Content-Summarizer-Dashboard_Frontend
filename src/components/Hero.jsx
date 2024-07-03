import { logo } from "../assets";

const Hero = () => {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <h1 className="head_text">
      Effortless Summarization using <br className="max-md:hidden" />
        <span className="purple_gradient">QuickSummarizer</span>
      </h1>
      <h2 className="desc">
      Condense lengthy content into concise summaries effortlessly with QuickSummarizer, an intuitive tool leveraging OpenAI's powerful GPT-4 technology.      </h2>
    </header>
  );
};

export default Hero;