const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Serve the demo-project src files as static assets (used by CodeRescue.html for analysis display)
app.use('/src', express.static(path.join(__dirname, 'src')));

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'CodeRescue.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CodeRescue AI running at http://localhost:${PORT}`);
});
