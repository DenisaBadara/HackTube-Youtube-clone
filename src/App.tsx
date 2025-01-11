import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HamburgerMenu from './components/HamburgerMenu';
import MainContent from './components/MainContent';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './pages/Profile';
import Post from './pages/Post';
import History from './pages/History';
import ErrorNotification from './components/ErrorNotification';
import VideoPage from './pages/VideoPage';
import { VideoData } from './types/VideoData';
import styles from './styles/App.module.css';

const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [page, setPage] = useState<string>('home');
  const [loggedInUser, setLoggedInUser] = useState<{ id: number; name: string; profilePicture: string } | null>(null);
  const [userVideos, setUserVideos] = useState<VideoData[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mainVideos, setMainVideos] = useState<VideoData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  // Preluarea istoricului videoclipurilor
  useEffect(() => {
    if (loggedInUser) {
      const storedHistory: VideoData[] = JSON.parse(localStorage.getItem('videoHistory') || '[]');
      const sanitizedHistory = storedHistory.map(video => ({
        ...video,
        tags: Array.isArray(video.tags) ? video.tags : [],
      }));
      setUserVideos(sanitizedHistory);
    } else {
      setUserVideos([]);
    }
  }, [loggedInUser]);

  // Gestionarea redarii videoclipurilor
  const handleVideoPlay = (video: VideoData) => {
    if (loggedInUser) {
      const history: VideoData[] = JSON.parse(localStorage.getItem('videoHistory') || '[]');
      const updatedHistory = [video, ...history.filter((v: VideoData) => v.id !== video.id)];
      localStorage.setItem('videoHistory', JSON.stringify(updatedHistory));
      setUserVideos(updatedHistory);
    }
    setSelectedVideo(video);
    setPage('video');
  };

  // Adaugarea unui videoclip nou
  const handleAddVideo = async (newVideo: Omit<VideoData, 'id'>) => {
    try {
      const response = await fetch('http://localhost:5000/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(loggedInUser ? { 'Authorization': `Bearer ${loggedInUser.id}` } : {})
        },
        body: JSON.stringify(newVideo),
      });

      if (response.ok) {
        const addedVideo: VideoData = await response.json();
        setPage('home');

        if (loggedInUser) {
          const history: VideoData[] = JSON.parse(localStorage.getItem('videoHistory') || '[]');
          const updatedHistory = [addedVideo, ...history.filter((v: VideoData) => v.id !== addedVideo.id)];
          localStorage.setItem('videoHistory', JSON.stringify(updatedHistory));
          setUserVideos(updatedHistory);
        }

        setMainVideos(prevVideos => {
          const updatedVideos = [addedVideo, ...prevVideos];
          return updatedVideos.slice(0, 16);
        });
      } else {
        const errorData = await response.json();
        console.error('Error adding video:', errorData.error);
      }
    } catch (error) {
      console.error('Error adding video:', error);
    }
  };

  // Fetch videoclipuri principale in functie de tag-urile selectate
  useEffect(() => {
    const fetchMainVideos = async () => {
      try {
        setError(null);
        let url = 'http://localhost:5000/videos/main';

        if (selectedTags.length > 0) {
          const tagsQuery = selectedTags.join(',');
          url = `http://localhost:5000/videos/filter?tags=${encodeURIComponent(tagsQuery)}`;
        }

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          ...(loggedInUser ? { 'Authorization': `Bearer ${loggedInUser.id}` } : {})
        };

        console.log('Fetching URL:', url);
        console.log('Headers:', headers);

        const response = await fetch(url, { headers });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error fetching main videos');
        }

        const data: VideoData[] = await response.json();
        setMainVideos(data);
      } catch (error: unknown) {
        console.error('Error fetching main videos:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchMainVideos();
  }, [selectedTags, loggedInUser]);

  // Handler pentru cautare
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      // Reincarcare videoclipuri principale daca cautarea este goala
      try {
        setError(null);
        let url = 'http://localhost:5000/videos/main';

        if (selectedTags.length > 0) {
          const tagsQuery = selectedTags.join(',');
          url = `http://localhost:5000/videos/filter?tags=${encodeURIComponent(tagsQuery)}`;
        }

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          ...(loggedInUser ? { 'Authorization': `Bearer ${loggedInUser.id}` } : {})
        };

        console.log('Fetching URL:', url);
        console.log('Headers:', headers);

        const response = await fetch(url, { headers });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error fetching main videos');
        }

        const data: VideoData[] = await response.json();
        setMainVideos(data);
      } catch (error: unknown) {
        console.error('Error fetching main videos:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      }
      return;
    }

    try {
      setError(null);
      const response = await fetch(`http://localhost:5000/videos/search?query=${encodeURIComponent(query)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const data: VideoData[] = await response.json();
      setMainVideos(data);
    } catch (error: unknown) {
      console.error('Error during search:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className={styles.appContainer}>
      <Navbar
        setMenuOpen={setMenuOpen}
        setPage={setPage}
        loggedInUser={loggedInUser}
        onSearch={handleSearch} 
      />
      <HamburgerMenu isOpen={menuOpen} setPage={setPage} currentPage={page} />
      <div className={`${styles.mainContent} ${menuOpen ? styles.menuOpen : styles.menuClosed}`}>
        {error && <ErrorNotification message={error} />}

        {page === 'home' && (
          <MainContent
            videos={mainVideos}
            onVideoPlay={handleVideoPlay}
            loggedInUser={loggedInUser}
            error={error}
            selectedTags={selectedTags}       
            setSelectedTags={setSelectedTags} 
          />
        )}

        {page === 'video' && selectedVideo && (
          <VideoPage video={selectedVideo} setPage={setPage} loggedInUser={loggedInUser} />
        )}

        {page === 'profile' && !loggedInUser && <h1>Trebuie să fii conectat pentru a vedea profilul.</h1>}
        {page === 'profile' && loggedInUser && (
          <Profile userId={loggedInUser.id} setPage={setPage} setLoggedInUser={setLoggedInUser} />
          
        )}
        {page === 'history' && loggedInUser && <History history={userVideos} />}
        {page === 'history' && !loggedInUser && <h1>Trebuie să fii conectat pentru a vedea istoricul.</h1>}
        {page === 'post' && loggedInUser && <Post loggedInUser={loggedInUser} onAddVideo={handleAddVideo} />}
        {page === 'post' && !loggedInUser && <h1>Trebuie să fii autentificat pentru a încărca un videoclip.</h1>}
        {page === 'login' && <Login setPage={setPage} setLoggedInUser={setLoggedInUser} />}
        {page === 'register' && <Register setPage={setPage} />}
      </div>
    </div>
  );
};

export default App;