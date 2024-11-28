import React, { useState } from "react";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import { queryDocuments } from "../services/api.JS";

const QueryComponent = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    setLoading(true);
    try {
      const result = await queryDocuments(query);
      setResponse(result.data);
    } catch (error) {
      setResponse("Error fetching query results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Query Documents</Typography>
      <TextField
        label="Enter your query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        style={{ margin: "10px 0" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleQuery}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Query"}
      </Button>
      {response && (
        <Box style={{ marginTop: "10px" }}>
          <Typography>Response:</Typography>
          <Typography style={{ whiteSpace: "pre-wrap" }}>{response}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default QueryComponent;
