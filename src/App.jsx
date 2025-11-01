import { lazy, Suspense, useState, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();
  const RETRY_INTERVAL = 15000; // 15 seconds

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await healthCheck();
        setError(null);
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
        setError(err.message);
        setIsSuccess(false);
        return false;
      }
    };

    // Initial check
    checkBackendHealth();

    // Periodic re-check until success
    const interval = setInterval(async () => {
      if (!isLoading) {
        clearInterval(interval);
        return;
      }

      const success = await checkBackendHealth();
      if (success) clearInterval(interval);
    }, RETRY_INTERVAL);

    return () => clearInterval(interval);
  }, [isLoading, dispatch]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingSplash isSuccess={isSuccess} />}
      </AnimatePresence>

      {!isLoading && (
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageSkeleton />}>
            <RouterProvider router={appRouter} />
          </Suspense>
        </AnimatePresence>
      )}
    </>
  );
}

export default App;
