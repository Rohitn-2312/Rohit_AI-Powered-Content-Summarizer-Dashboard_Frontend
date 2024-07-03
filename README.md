# React Dashboard with Summarization Feature

This project is a React-based dashboard that allows users to input a URL, fetch its summarized content using an AI service via RapidAPI, and manage their history of summarized articles.

## Features

- **Summarization**: Input a URL and get a summarized version of the article.
- **History Management**: View previously summarized articles and clear history.
- **Export Options**: Export summarized content as plain text or PDF.
- **Responsive Design**: Designed to work well across different screen sizes.

## Technologies Used

- React
- Tailwind CSS
- RapidAPI for AI summarization service

## Prerequisites

Before running the project locally, make sure you have the following installed:

- Node.js (v14.x or later)
- npm or yarn package manager

## Getting Started

1. **Clone the repository:**

   
   git clone <https://github.com/Rohitn-2312/Rohit_AI-Powered-Content-Summarizer-Dashboard_Frontend>
   cd react-dashboard


2. **Install dependencies:**
   
   Using npm:

   npm install
   
   Using yarn:

   yarn install

3. **Set up RapidAPI credentials:**
   
   -Obtain your RapidAPI key and set it up in your environment or directly in the `services/article.js` file.

5. **Run the Application**
   ```bash
   npm start

   
7. **Usage**

   - Enter a URL in the input field and select the length of the summary (Short, Medium, Long).
   - Click on "Summarize" to fetch and display the summarized content.
   - Use the "History" dropdown to view previously summarized articles.
   - Export summarized content using the "Export as Text" or "Export as PDF" buttons.

   
