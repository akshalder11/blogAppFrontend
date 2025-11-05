# BlogApp Frontend

**Production URL:** [https://akshalder11-blogapp.netlify.app/](https://akshalder11-blogapp.netlify.app/)

A modern, full-featured blogging platform built with React, Redux, Vite, and Tailwind CSS. Hosted on Netlify.

## Features

- 📝 **Create, Edit, Delete Posts**
- 🖼️ **Image Uploads & Carousel** (with instant caching and smooth transitions)
- 🔒 **Authentication** (Sign Up, Login, Logout)
- 👍👎 **Like/Dislike & Reactions**
- 🛠️ **Centralized Error Handling** (minimal white toast notifications)
- 🚦 **Splash Screen** (with countdown, status, and retry logic)
- 📦 **Media Uploads** (currently supports images)
- 🧑‍💻 **Responsive UI** (mobile & desktop)
- ⚡ **Fast SPA Routing** (React Router, Netlify redirects)
- 🛡️ **API Health Check** (with backend spin-up countdown)
- 🟢 **Optimistic UI Updates** (for likes/dislikes)
- 🎨 **Minimal, Modern Design** (Tailwind CSS, Framer Motion)

## Tech Stack

- **React 19**
- **Redux Toolkit**
- **Vite**
- **Tailwind CSS**
- **Framer Motion**
- **Sonner (Toast notifications)**
- **Lucide Icons**
- **Moment.js**

## Hosting & Deployment

- **Netlify** (with SPA support via `_redirects`)
- **Backend**: Connects to a REST API (see `.env` for API base URL)

## How It Works

- **Home Page**: View all posts, create new posts (Text/Image)
- **Post Detail**: View full post, like/dislike, edit/delete (if author)
- **Media Carousel**: All images are preloaded and cached for instant navigation
- **Authentication**: Required for creating, editing, liking, or viewing restricted posts
- **Splash Screen**: Shows backend status, countdown, and retry logic on app load
- **Error Handling**: All API errors are shown as minimal white toasts (never inline)
- **SPA Routing**: All routes handled client-side; Netlify `_redirects` ensures reloads work

## Getting Started

1. **Clone the repo**
2. `npm install`
3. `npm run dev`
4. Set your API base URL in `.env`
5. Deploy to Netlify (make sure `public/_redirects` is present)

## Folder Structure

```
blogapp-frontend/
├── public/
│   └── _redirects
├── src/
│   ├── api/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── router/
│   └── utils/
├── package.json
├── vite.config.js
└── README.md
```

## AI-Powered Development

This project leverages cutting-edge AI tools to accelerate development and improve code quality:

### 🤖 AI Tools Used

- **ChatGPT** - For architectural decisions, problem-solving, and generating complex logic
- **GitHub Copilot** - For intelligent code completion, reducing boilerplate code, and speeding up development

### 🚀 Benefits

- **10x Faster Development** - AI-assisted coding reduced development time significantly
- **Reduced Boilerplate** - Auto-generated Redux slices, API handlers, and component scaffolding
- **Better Code Quality** - AI suggestions helped implement best practices and optimize performance
- **Instant Problem Solving** - Quick debugging and troubleshooting with AI assistance
- **Enhanced Productivity** - Focus on business logic while AI handles repetitive tasks

### 💡 Key AI Contributions

- Component architecture and state management patterns
- Error handling strategies and toast notification system
- Image caching and carousel optimization logic
- API client setup with centralized error handling
- Responsive UI design with Tailwind CSS utilities

> **Note**: AI tools were used as coding assistants to enhance productivity. All code was reviewed, tested, and customized to meet project requirements.

