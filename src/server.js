const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Serve static files from the "src" directory
app.use('/src', express.static(path.join(__dirname, '..', 'client-side', 'src')));

// Also serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, '..', 'client-side', 'public')));

// Root route serves the viz.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client-side', 'public', 'viz.html'));
});

// Route to serve the africa.json file
app.get('/africa.json', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client-side', 'src', 'africa.json'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
