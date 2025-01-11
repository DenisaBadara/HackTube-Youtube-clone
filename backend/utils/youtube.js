const axios = require('axios');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; 
console.log('YOUTUBE_API_KEY:', YOUTUBE_API_KEY);

const fetchYouTubeVideosByTags = async (tags, maxResults = 16) => {
  try {
    const query = tags.length > 0 ? tags.join(' ') : 'popular'; 
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        maxResults: maxResults,
        type: 'video',
        key: YOUTUBE_API_KEY,
      },
    });

    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      thumbnail: item.snippet.thumbnails.high.url,
      title: item.snippet.title,
      channelIcon: item.snippet.thumbnails.default.url,
      channelName: item.snippet.channelTitle,
      likes: 0, 
      tags: tags, 
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      authorId: null,
    }));

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { fetchYouTubeVideosByTags };
