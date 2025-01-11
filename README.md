HackTube is a comprehensive YouTube clone project built using Node.js with Express for the backend and React TypeScript for the frontend. Through the YouTube Data API v3, the application fetches and manages video content, displaying up to 16 videos on the main page in a responsive 4x4 grid on the main page. The platform implements a video management system where videos are presented with thumbnails, titles, view counts, and like counters. Each video can be accessed in an expanded view for playback, complete with standard video controls and interaction options. The interface displays metadata including upload dates, like counts, and user information. A robust filtering system allows users to sort content through tags like Music, Gaming, and Entertainment, with the ability to apply multiple filters simultaneously. The search functionality is implemented with error handling and real-time updates, while the hamburger menu provides easy navigation between different sections of the application. The platform includes several key features:

    A post page with a form for uploading videos, allowing users to input video titles, thumbnail URLs, video URLs, and comma-separated tags
    A history page displaying watched videos in a 4-video layout, accessible only to authenticated users
    A profile management system for updating personal information and profile pictures
    A secure authentication system controlling access to protected features

The interface includes essential navigation elements through a hamburger menu with options for Home, Post, History, and Profile pages. The application maintains a consistent dark theme throughout, with clear visual feedback for user interactions and error states. All features require user authentication except for the main page and video viewing, ensuring secure access to personal features like history, profile management, and video uploading.
