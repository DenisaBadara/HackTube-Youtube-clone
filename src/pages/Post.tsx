import React, { useState } from "react";
import styles from "../styles/Post.module.css";
import { VideoData } from "../types/VideoData";

interface PostProps {
  loggedInUser: { id: number; name: string; profilePicture: string };
  onAddVideo: (newVideo: VideoData) => void;
}

const Post: React.FC<PostProps> = ({ loggedInUser, onAddVideo }) => {
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !thumbnailUrl || !videoUrl) {
      setError("Toate câmpurile sunt obligatorii.");
      return;
    }

    const newVideo: VideoData = {
      id: Date.now(),
      title,
      thumbnail: thumbnailUrl,
      videoUrl,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      channelIcon: loggedInUser.profilePicture,
      channelName: loggedInUser.name,
      likes: 0,
      date: new Date().toISOString(),
      authorId: loggedInUser.id,
      likedBy: [],
    };

    fetch("http://localhost:5000/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${loggedInUser.id}` 
      },
      body: JSON.stringify(newVideo),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => { throw err; });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Videoclip adăugat:", data);
        onAddVideo(data.video);
        setTitle("");
        setThumbnailUrl("");
        setVideoUrl("");
        setTags("");
        setError("");
      })
      .catch((error) => {
        console.error("Eroare:", error);
        setError(error.error || "A apărut o problemă. Încercați din nou.");
      });
  };

  return (
    <div className={styles.postPage}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Încărcare Videoclip</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Titlu:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            URL Thumbnail:
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            URL Videoclip:
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Tag-uri (separate prin virgulă):
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={styles.input}
            />
          </label>
          <button type="submit" className={styles.submitButton}>
            Încărcare Videoclip
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
