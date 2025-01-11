import React, { useState } from "react";
import ReactPlayer from "react-player";
import styles from "../styles/Video.module.css";
import { VideoData } from "../types/VideoData";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa"; 

interface VideoProps {
  id: number;
  thumbnail: string;
  title: string;
  channelIcon: string;
  channelName: string;
  likes: number;
  date: string;
  tags: string[];
  videoUrl: string;
  onPlay?: (video: VideoData) => void;
  authorId: number;
  likedBy: number[];
  loggedInUser: { id: number; name: string; profilePicture: string } | null;
}

const getYouTubeVideoId = (url: string | undefined): string | null => {
  if (!url) return null;

  const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
};

const Video: React.FC<VideoProps> = ({
  id,
  thumbnail,
  title,
  channelIcon,
  channelName,
  likes,
  date,
  tags = [], 
  videoUrl,
  onPlay,
  authorId,
  likedBy = [], 
  loggedInUser,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(likes);
  const [hasLiked, setHasLiked] = useState<boolean>(
    loggedInUser ? likedBy.includes(loggedInUser.id) : false
  );

  const handleLike = async () => {
    if (!loggedInUser) {
      alert("Trebuie să fii autentificat pentru a da like.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Token de autentificare lipsă. Te rog să te loghezi din nou.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/videos/${id}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likes);
        setHasLiked(data.message === 'Like added'); 
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Eroare la actualizarea like-ului.');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('A apărut o eroare la actualizarea like-ului.');
    }
  };

  const handleClick = () => {
    if (!videoUrl) {
      console.warn(`Videoul "${title}" nu are un URL valid.`);
      return;
    }
    setIsPlaying(true);
    if (onPlay) {
      onPlay({
        id,
        thumbnail,
        title,
        channelIcon,
        channelName,
        likes: likeCount,
        date,
        tags,
        videoUrl,
        authorId,
        likedBy,
      });
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  const videoId = getYouTubeVideoId(videoUrl);
  const highResThumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : thumbnail;

  return (
    <div className={styles.videoCard}>
      {isPlaying ? (
        <div className={styles.playerWrapper}>
          <ReactPlayer
            url={videoUrl}
            controls
            playing
            width="100%"
            height="100%"
            onEnded={handleStop}
            onError={handleStop}
          />
          <button className={styles.closeButton} onClick={handleStop}>
            ×
          </button>
        </div>
      ) : (
        <>
          <img
            src={highResThumbnail}
            alt={title}
            className={styles.videoThumbnail}
            onClick={handleClick}
          />
          <div className={styles.videoDetails}>
            <img
              src={channelIcon}
              alt={channelName}
              className={styles.channelIcon}
            />
            <div className={styles.videoInfo}>
              <h3 className={styles.videoTitle}>{title}</h3>
              <p className={styles.channelName}>{channelName}</p>
              <div className={styles.videoStats}>
                <button className={styles.likeButton} onClick={handleLike}>
                  {hasLiked ? <FaThumbsUp color="#065fd4" /> : <FaRegThumbsUp />}
                </button>
                <span>{likeCount} likes</span>
                <span className={styles.videoDate}>
                  • {new Date(date).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.videoTags}>
                {tags.map((tag, index) => (
                  <span key={`${tag}-${index}`} className={styles.videoTag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Video;
