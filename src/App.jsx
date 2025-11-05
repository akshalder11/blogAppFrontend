import { lazy, Suspense, useState, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster, toast } from 'sonner';
import RootLayout from "./layouts/RootLayout";
import LoadingSplash from "./components/LoadingSplash";
import { healthCheck } from "./api/health";
import "./App.css";
import PageSkeleton from "./components/ui/PageSkeleton";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./features/auth/authSlice";
import appRouter from "./router/appRouter";


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds
  const [isRetrying, setIsRetrying] = useState(false);
  const dispatch = useDispatch();
  const RETRY_INTERVAL = 5000; // 5 seconds between retries
  const COUNTDOWN_DURATION = 120; // 2 minutes

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await healthCheck();
        setIsSuccess(true);

        // 🟢 After backend is healthy, sync auth state from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          dispatch(loginSuccess(JSON.parse(storedUser)));
        } else {
          dispatch(logout());
        }

        // Wait for success animation (1.5s) and fade out (0.5s)
        setTimeout(() => setIsLoading(false), 2000);
        return true;
      } catch (err) {
        // Error logged but toast hidden during splash screen
        setIsSuccess(false);
        return false;
      }
    };

    // Initial check
    checkBackendHealth();

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Countdown finished, reset for retry
          setIsRetrying(true);
          return COUNTDOWN_DURATION; // Reset to 2 minutes
        }
        return prev - 1;
      });
    }, 1000);

    // Periodic health check until success
    const healthCheckInterval = setInterval(async () => {
      if (!isLoading) {
        clearInterval(healthCheckInterval);
        clearInterval(countdownInterval);
        return;
      }

      const success = await checkBackendHealth();
      if (success) {
        clearInterval(healthCheckInterval);
        clearInterval(countdownInterval);
      }
    }, RETRY_INTERVAL);

    return () => {
      clearInterval(healthCheckInterval);
      clearInterval(countdownInterval);
    };
  }, [isLoading, dispatch]);

  return (
    <>
      <Toaster 
        position="top-center" 
        richColors
        toastOptions={{
          style: {
            background: 'white',
            color: '#374151',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        }}
      />
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingSplash 
            isSuccess={isSuccess} 
            countdown={countdown}
            isRetrying={isRetrying}
          />
        )}
      </AnimatePresence>

      {!isLoading && (
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageSkeleton />}>
            <div data-app-loaded="true">
              <RouterProvider router={appRouter} />
            </div>
          </Suspense>
        </AnimatePresence>
      )}
    </>
  );
}

export default App;
