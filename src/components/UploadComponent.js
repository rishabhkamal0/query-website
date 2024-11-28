import React, { useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { uploadDocument } from "../services/api.JS";

const UploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file first.");
      return;
    }

    setUploading(true);
    try {
      const response = await uploadDocument(selectedFile);
      setMessage(`Upload successful: ${response.message}`);
    } catch (error) {
      setMessage("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Upload Document</Typography>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ margin: "10px 0" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? <CircularProgress size={24} /> : "Upload"}
      </Button>
      {message && <Typography style={{ marginTop: "10px" }}>{message}</Typography>}
    </Box>
  );
};

export default UploadComponent;
