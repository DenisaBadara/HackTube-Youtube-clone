const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authenticate = require('../middleware/authenticate');
const optionalAuthenticate = require('../middleware/optionalAuthenticate'); 
const { fetchYouTubeVideosByTags } = require('../utils/youtube');
const levenshtein = require('fast-levenshtein'); 

const VIDEOS_FILE = path.join(__dirname, '..', 'data', 'videos.json');

const getLocalVideos = () => {
  try {
    if (fs.existsSync(VIDEOS_FILE)) {
      const data = fs.readFileSync(VIDEOS_FILE, 'utf-8');
      const videos = JSON.parse(data);
      return videos.map(video => ({
        ...video,
        likedBy: Array.isArray(video.likedBy) ? video.likedBy : [],
      }));
    }
    return [];
  } catch (error) {
    console.error('Error reading videos file:', error);
    return [];
  }
};


const saveVideos = (videos) => {
  try {
    fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2));
  } catch (error) {
    console.error('Error saving videos file:', error);
  }
};

router.get('/', (req, res) => {
  const localVideos = getLocalVideos();
  res.status(200).json(localVideos);
});

router.get('/search', optionalAuthenticate, async (req, res) => {
  try {
    const { query } = req.query;
    console.log('Search query received:', query); 

    if (!query) {
      return res.status(400).json({ error: 'No search query provided.' });
    }

   
    const localVideos = getLocalVideos();
    console.log('Number of local videos:', localVideos.length);

   
    const youtubeVideos = await fetchYouTubeVideosByTags([], 50);
    console.log('Number of YouTube videos fetched:', youtubeVideos.length);

    let combinedVideos = [...localVideos, ...youtubeVideos];
    console.log('Total combined videos before filtering:', combinedVideos.length);

  
    combinedVideos = combinedVideos.map(video => ({
      ...video,
      distance: levenshtein.get(query.toLowerCase(), video.title.toLowerCase())
    }));
    console.log('Calculated Levenshtein distances.');

    combinedVideos.sort((a, b) => a.distance - b.distance);
    console.log('Sorted videos by distance.');

    const topVideos = combinedVideos.slice(0, 16).map(video => {
      const { distance, ...rest } = video;
      return rest;
    });
    console.log('Top 16 videos selected:', topVideos.length);

    res.status(200).json(topVideos);
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/main', optionalAuthenticate, async (req, res) => {
  try {
    if (req.user) {
      console.log('Fetching main videos for user ID:', req.user.id);
    } else {
      console.log('Fetching main videos for unauthenticated user');
    }

    const localVideos = getLocalVideos();
    console.log('Local videos fetched:', localVideos.length);

    const youtubeVideos = await fetchYouTubeVideosByTags([], 16);
    console.log('Fetched YouTube videos:', youtubeVideos.length);

    let combinedVideos = [...localVideos, ...youtubeVideos];
    if (req.user) {
      const userVideos = localVideos.filter(video => video.authorId === req.user.id);
      combinedVideos = [...userVideos, ...youtubeVideos];
    }

    console.log('Combined videos count:', combinedVideos.length);

    const shuffled = combinedVideos.sort(() => 0.5 - Math.random());
    const selectedVideos = shuffled.slice(0, 16);
    console.log('Selected videos count:', selectedVideos.length);

    res.status(200).json(selectedVideos);
  } catch (error) {
    console.error('Error fetching main videos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/filter', optionalAuthenticate, async (req, res) => {
  try {
    const { tags } = req.query;

    if (!tags) {
      return res.status(400).json({ error: 'No tags provided for filtering.' });
    }

    const tagList = tags.split(",").map(tag => tag.trim().toLowerCase());

    const localVideos = getLocalVideos();

    const filteredLocalVideos = localVideos.filter(video =>
      video.tags.some(tag => tagList.includes(tag.toLowerCase()))
    );

    const youtubeVideos = await fetchYouTubeVideosByTags(tagList, (16 - filteredLocalVideos.length) > 0 ? (16 - filteredLocalVideos.length) : 0);
    console.log('Fetched YouTube videos:', youtubeVideos.length);

    const combinedVideos = [...filteredLocalVideos, ...youtubeVideos];
    console.log('Combined videos count:', combinedVideos.length);

    const shuffled = combinedVideos.sort(() => 0.5 - Math.random());
    const selectedVideos = shuffled.slice(0, 16);
    console.log('Selected videos count:', selectedVideos.length);

    res.status(200).json(selectedVideos);
  } catch (error) {
    console.error('Error fetching filtered videos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id/like', authenticate, (req, res) => {
  const videoId = parseInt(req.params.id, 10);
  const userId = req.user.id;

  const localVideos = getLocalVideos();
  const videoIndex = localVideos.findIndex(v => v.id === videoId);

  if (videoIndex === -1) {
    return res.status(404).json({ error: 'Videoclipul nu a fost găsit' });
  }

  const video = localVideos[videoIndex];
  const likedBy = video.likedBy || [];

  if (likedBy.includes(userId)) {
    video.likedBy = likedBy.filter(id => id !== userId);
    video.likes = video.likedBy.length;
    try {
      saveVideos(localVideos);
      res.status(200).json({ message: 'Like removed', likes: video.likes });
    } catch (error) {
      console.error('Error updating videos file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    video.likedBy.push(userId);
    video.likes = video.likedBy.length;
    try {
      saveVideos(localVideos);
      res.status(200).json({ message: 'Like added', likes: video.likes });
    } catch (error) {
      console.error('Error updating videos file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

router.get('/:id', (req, res) => {
  const videoId = parseInt(req.params.id, 10);
  const localVideos = getLocalVideos();
  const video = localVideos.find(v => v.id === videoId);

  if (!video) {
    return res.status(404).json({ error: 'Videoclipul nu a fost găsit' });
  }

  res.status(200).json(video);
});

router.post('/', authenticate, (req, res) => {
  const { title, thumbnail, videoUrl, tags } = req.body;

  if (!title || !thumbnail || !videoUrl) {
    return res.status(400).json({ error: 'Title, thumbnail URL și video URL sunt obligatorii.' });
  }

  let processedTags = [];
  if (Array.isArray(tags)) {
    processedTags = tags;
  } else if (typeof tags === 'string' && tags.length > 0) {
    processedTags = tags.split(",").map(tag => tag.trim());
  }

  const newVideo = {
    id: Date.now(),
    title,
    thumbnail,
    videoUrl,
    tags: processedTags,
    authorId: req.user.id,
    channelIcon: req.user.profilePicture,
    channelName: req.user.name,
    likes: 0,
    likedBy: [], 
    date: new Date().toISOString(),
  };

  const localVideos = getLocalVideos();
  localVideos.push(newVideo);

  try {
    saveVideos(localVideos);
    res.status(201).json({ message: 'Videoclip adăugat cu succes.', video: newVideo });
  } catch (error) {
    console.error('Error saving new video:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;