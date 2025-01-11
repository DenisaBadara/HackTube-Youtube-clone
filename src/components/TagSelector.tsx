import React from "react";
import styles from "../styles/TagSelector.module.css";

interface TagSelectorProps {
  availableTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ availableTags, selectedTags, toggleTag }) => {
  return (
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
  );
};

export default TagSelector;
