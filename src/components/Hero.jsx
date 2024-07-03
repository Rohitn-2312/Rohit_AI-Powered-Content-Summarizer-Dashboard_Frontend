import { logo } from "../assets";

const Hero = () => {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <h1 className="head_text">
      QuickSummarize with <br className="max-md:hidden" />
        <span className="orange_gradient">GPT-4</span>
      </h1>
      <h2 className="desc">
      Make reading effortless with QuickSummarize, a user-friendly tool that condenses long articles into brief and understandable summaries using the power of OpenAI's GPT-4 technology.
      </h2>
    </header>
  );
};

export default Hero;