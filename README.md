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
- 🔍 **SEO Optimized** (meta tags, Open Graph, Twitter Cards, sitemap)
- ♿ **Accessibility Compliant** (WCAG AAA, ARIA labels, semantic HTML)
- 🔒 **Security Hardened** (CSP, COOP, HSTS, XSS protection)
- ⚡ **Performance Optimized** (lazy loading, preconnect, aggressive caching)

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

## 🎯 Performance & Optimization

This project is optimized for production with industry-standard best practices:

### Lighthouse Scores (Target)

- **Performance**: 85-95
- **Accessibility**: 98-100 ✅
- **Best Practices**: 90-100 ✅
- **SEO**: 95-100 ✅

### SEO Optimizations

- ✅ Comprehensive meta tags (description, keywords, author)
- ✅ Open Graph tags for social media sharing
- ✅ Twitter Card meta tags
- ✅ PWA manifest with theme colors
- ✅ Robots.txt for search engine crawling
- ✅ XML sitemap with all main pages
- ✅ Preconnect hints for faster backend connections

### Accessibility Features

- ✅ WCAG AAA compliant color contrast (7:1 ratio)
- ✅ Semantic HTML (nav, main, proper heading hierarchy)
- ✅ ARIA labels and roles on all interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators on all focusable elements
- ✅ Alt text on all images

### Security Headers

All security headers configured via Netlify:

- ✅ **Content Security Policy (CSP)** - Prevents XSS attacks
- ✅ **Cross-Origin-Opener-Policy (COOP)** - Prevents cross-origin attacks
- ✅ **X-Frame-Options** - Prevents clickjacking
- ✅ **Strict-Transport-Security (HSTS)** - Forces HTTPS
- ✅ **X-Content-Type-Options** - Prevents MIME sniffing
- ✅ **X-XSS-Protection** - Browser XSS filter
- ✅ **Referrer-Policy** - Controls referrer information
- ✅ **Permissions-Policy** - Disables unnecessary browser features

### Performance Optimizations

- ✅ Image lazy loading with async decoding
- ✅ CORS attributes for cross-origin images
- ✅ Preload metadata for audio/video (not full files)
- ✅ Single CSS bundle for better caching
- ✅ Code splitting for vendor libraries (React, Redux)
- ✅ Aggressive caching (1 year for static assets)
- ✅ Preconnect to backend API (reduces latency)
- ✅ DNS prefetch for older browser support
- ✅ Production build minified with esbuild

### Code Quality

- ✅ All console.log/console.error removed from production
- ✅ No unused variables or imports
- ✅ Proper error boundaries
- ✅ TypeScript-ready component structure

> 📋 **See [PERFORMANCE.md](PERFORMANCE.md) for detailed optimization report and all changes.**

## 📦 Deployment

### Netlify Configuration

The project includes production-ready Netlify configuration:

- **`netlify.toml`** - Security headers, caching, SPA redirects
- **`public/_headers`** - Additional security headers
- **`public/_redirects`** - SPA routing support

### Environment Variables

Set `VITE_API_BASE_URL` in Netlify dashboard or `.env` file:

```
VITE_API_BASE_URL=https://your-backend-url.com
```

### Build Command

```bash
npm run build
```

### Publish Directory

```
dist
```
