import React, { useState } from "react";
import ReactPlayer from "react-player";
import { VideoData } from "../types/VideoData";
import styles from "../styles/VideoPage.module.css";
import { FaTimes, FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";

interface VideoPageProps {
  video: VideoData;
  setPage: (page: string) => void;
  loggedInUser: { id: number; name: string; profilePicture: string } | null;
}

const VideoPage: React.FC<VideoPageProps> = ({ video, setPage, loggedInUser }) => {
  const handleClose = () => {
    setPage('home'); 
  };

  const [likeCount, setLikeCount] = useState<number>(video.likes);
  const [hasLiked, setHasLiked] = useState<boolean>(
    loggedInUser ? video.likedBy.includes(loggedInUser.id) : false
  );

  const handleLike = async () => {
    if (!loggedInUser) {
      alert("Trebuie să fii autentificat pentru a da like.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/videos/${video.id}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loggedInUser.id}` 
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likes);
        setHasLiked(data.likes > likeCount); 
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Eroare la actualizarea like-ului.');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('A apărut o eroare la actualizarea like-ului.');
    }
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
          <button className={styles.likeButton} onClick={handleLike}>
            {hasLiked ? <FaThumbsUp color="#065fd4" /> : <FaRegThumbsUp />}
          </button>
          <span>{likeCount} likes</span>
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
