import React from "react";
import Video from './Video';
import { VideoData } from '../types/VideoData';
import styles from '../styles/MainContent.module.css';
import ErrorNotification from './ErrorNotification';

interface MainContentProps {
  videos: VideoData[];
  onVideoPlay: (video: VideoData) => void;
  loggedInUser: { id: number; name: string; profilePicture: string } | null;
  error?: string | null;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

const availableTags = ["Music", "Tutorial", "Gaming", "News", "Entertainment", "Education", "Sports", "Technology"];

const MainContent: React.FC<MainContentProps> = ({ videos, onVideoPlay, loggedInUser, error, selectedTags, setSelectedTags }) => {
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  if (error) {
    return <ErrorNotification message={error} />;
  }

  if (!videos.length) {
    return <div className={styles.noResults}>Nu au fost găsite videoclipuri relevante.</div>;
  }

  return (
    <div className={styles.mainContentContainer}>
      <div className={styles.tagContainer}>
        {availableTags.map(tag => (
          <button
            key={tag}
            className={`${styles.tagButton} ${selectedTags.includes(tag) ? styles.selectedTag : ''}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      
      <div className={styles.videoGrid}>
        {videos.map(video => (
          <Video
            key={video.id}
            id={video.id}
            thumbnail={video.thumbnail}
            title={video.title}
            channelIcon={video.channelIcon}
            channelName={video.channelName}
            likes={video.likes}
            date={video.date}
            tags={video.tags}
            videoUrl={video.videoUrl}
            authorId={video.authorId}
            likedBy={video.likedBy}
            loggedInUser={loggedInUser}
            onPlay={onVideoPlay}
          />
        ))}
      </div>
    </div>
  );
};

export default MainContent;
