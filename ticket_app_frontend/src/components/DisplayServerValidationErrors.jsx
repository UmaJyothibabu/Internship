import React, { useState } from "react";
import { Typography, Box } from "@mui/material";

const DisplayServerValidationErrors = ({ errors }) => {
  const [displayErrors, setDisplayErrors] = useState(errors);

  // Function to clear errors
  const clearErrors = () => {
    setDisplayErrors([]);
  };

  return (
    <div>
      {displayErrors.length > 0 && (
        <Box bgcolor="#ffcccc" p={2} borderRadius={4} marginBottom={2}>
          <Typography variant="body2" color="error" gutterBottom>
            Please fix the following errors:
          </Typography>
          <ul>
            {displayErrors.map((error, index) => (
              <li key={index}>{error.msg}</li>
            ))}
          </ul>
          <button onClick={clearErrors}>Clear Errors</button>
        </Box>
      )}
    </div>
  );
};

export default DisplayServerValidationErrors;
