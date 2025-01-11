// backend/testYouTubeAPI.js
const { fetchYouTubeVideosByTags } = require('./utils/youtube');
require('dotenv').config();


(async () => {
  try {
    const videos = await fetchYouTubeVideosByTags(['music', 'entertainment'], 5);
    console.log('Fetched YouTube videos:', videos);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error.response ? error.response.data : error.message);
  }
})();
