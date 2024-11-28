import axios from "axios";

// Base API URL pointing to the backend
const API_BASE_URL = "http://127.0.0.1:8000/api";

// Function to upload a document
export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // Use the correct endpoint for file upload
  const response = await axios.post(`http://127.0.0.1:8000/api/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Function to query the documents
export const queryDocuments = async (queryText) => {
  // Use the correct endpoint for queries
  const response = await axios.post(`${API_BASE_URL}/query`, { query: queryText });
  return response.data;
};
