import React from "react";
import ReactPlayer from "react-player";
import { VideoData } from "../types/VideoData";
import styles from "../styles/VideoPage.module.css";
import { FaTimes } from "react-icons/fa";

interface VideoPageProps {
  video: VideoData;
  setPage: (page: string) => void;
}

const VideoPage: React.FC<VideoPageProps> = ({ video, setPage }) => {
  const handleClose = () => {
    setPage('home'); 
  };

  return (
    <div className={styles.videoPageContainer}>
      <div className={styles.videoPlayerWrapper}>
        <button className={styles.closeButton} onClick={handleClose}>
          <FaTimes />
        </button>
        <ReactPlayer
          url={video.videoUrl}
          controls
          playing
          width="100%"
          height="100%"
        />
      </div>
      <div className={styles.videoDetails}>
        <h2 className={styles.videoTitle}>{video.title}</h2>
        <div className={styles.channelInfo}>
          <img src={video.channelIcon} alt={video.channelName} className={styles.channelIcon} />
          <span className={styles.channelName}>{video.channelName}</span>
        </div>
        <div className={styles.videoStats}>
          <span>👍 {video.likes} likes</span>
          <span>• {new Date(video.date).toLocaleDateString()}</span>
        </div>
        <div className={styles.videoTags}>
          {video.tags.map((tag, index) => (
            <span key={`${tag}-${index}`} className={styles.videoTag}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
