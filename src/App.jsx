import { lazy, Suspense, useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import RootLayout from './layouts/RootLayout';
import LoadingSplash from './components/LoadingSplash';
import { healthCheck } from './api/health';
import "./App.css";
import PageSkeleton from './components/ui/PageSkeleton';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const RegistrationSuccess = lazy(() => import('./pages/RegistrationSuccess'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'posts/:postId',
        element: <PostDetail />,
      },
      {
        path: 'registration-success',
        element: <RegistrationSuccess />,
      },
    ],
  },
]);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const RETRY_INTERVAL = 15000; // 15 seconds

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await healthCheck();
        setError(null);
        setIsSuccess(true);
        // Wait for success animation (1.5s) and fade out (0.5s)
        setTimeout(() => setIsLoading(false), 2000);
        return true;
      } catch (err) {
        setError(err.message);
        setIsSuccess(false);
        return false;
      }
    };

    // Initial check
    checkBackendHealth();

    // Set up periodic checks while loading
    const interval = setInterval(async () => {
      if (!isLoading) {
        clearInterval(interval);
        return;
      }
      
      const success = await checkBackendHealth();
      if (success) {
        clearInterval(interval);
      }
    }, RETRY_INTERVAL);

    // Cleanup
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingSplash isSuccess={isSuccess} />}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageSkeleton />}>
          <RouterProvider router={router} />
        </Suspense>
      </AnimatePresence>
    </>
  );
}

export default App;
