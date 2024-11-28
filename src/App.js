import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Custom CSS styles

function App() {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message state

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(""); // Reset error on file change
  };

  // Validate file types and handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    // Log FormData to the console
    console.log([...formData]);
  
    try {
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFilename(response.data.filename);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("File upload failed. Please try again.");
    }
  };
  

  // Handle query search
  const handleQuery = async () => {
    if (!filename) {
      alert("Please upload a file first");
      return;
    }
    if (!keyword) {
      alert("Please enter a keyword to query");
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await axios.get("http://localhost:8000/query/", {
        params: {
          filename: filename,
          keyword: keyword,
        },
      });
      setResult(response.data.message);
    } catch (error) {
      console.error(error);
      setError("Query failed. Please try again."); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>📂 File Upload & Query</h1>
        <p>A sleek, modern app for file processing and keyword search</p>
      </header>

      <div className="content">
        <div className="card">
          <h2>Upload Your File</h2>
          <input type="file" onChange={handleFileChange} className="file-input" />
          <button onClick={handleFileUpload} className="button primary" disabled={loading}>
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </div>

        <div className="card">
          <h2>Search in File</h2>
          <input
            type="text"
            placeholder="Enter a keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="text-input"
          />
          <button onClick={handleQuery} className="button secondary" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {result && (
          <div className="result-card">
            <h2>Results</h2>
            <p>{result}</p>
          </div>
        )}

        {error && (
          <div className="error-card">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
