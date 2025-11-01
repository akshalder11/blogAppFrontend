import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';

// Lazy load pages for code splitting
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const SignUp = lazy(() => import('../pages/SignUp'));
const PostDetail = lazy(() => import('../pages/PostDetail'));
const RegistrationSuccess = lazy(() => import('../pages/RegistrationSuccess'));

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'posts/:postId', element: <PostDetail /> },
      { path: 'registration-success', element: <RegistrationSuccess /> },
    ],
  },
]);

export default appRouter;
