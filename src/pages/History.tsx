import React from "react";
import Video from "../components/Video";
import { VideoData } from "../types/VideoData";
import styles from '../styles/History.module.css';

interface HistoryProps {
  history: VideoData[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  console.log("History videos:", history); 
  return (
    <div className={styles.historyGrid}>
      {history.map((video, index) => (
        <Video
          key={video.id || `video-${index}`} 
          id={video.id}
          thumbnail={video.thumbnail}
          title={video.title}
          channelIcon={video.channelIcon}
          channelName={video.channelName}
          likes={video.likes}
          date={video.date}
          tags={video.tags || []}
          videoUrl={video.videoUrl}
          authorId={video.authorId}
          onPlay={video => console.log(`Playing video: ${video.title}`)} likedBy={[]} loggedInUser={null}        />
      ))}
    </div>
  );
};

export default History;
