const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

// Set the port directly in the code
const PORT = 3000;

// Root endpoint to check if the server is running
app.get('/', (req, res) => {
    res.send('YouTube Video Downloader API');
});

// Endpoint to handle YouTube video download
app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;

    // Check if the URL parameter is provided
    if (!videoUrl) {
        return res.status(400).send('No URL provided');
    }

    try {
        // Get video information
        const info = await ytdl.getInfo(videoUrl);
        
        // Select the best format available
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

        // Set the headers to prompt the user to download the file
        res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);

        // Stream the video to the response
        ytdl(videoUrl, { format: format }).pipe(res);
    } catch (err) {
        // Handle any errors that occur
        res.status(500).send('Error downloading video');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
