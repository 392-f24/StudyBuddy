import { useState } from 'react';

import { Snackbar } from '@mui/material';

export const useCopyToClipboard = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbarMessage(`Copied to clipboard: ${text}`);
    setSnackbarOpen(true);
  };

  const SnackbarComponent = () => (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={() => setSnackbarOpen(false)}
      message={snackbarMessage}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  );

  return { handleCopyToClipboard, SnackbarComponent };
};
