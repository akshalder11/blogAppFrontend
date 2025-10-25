import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from '../components/ui/Navbar';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default RootLayout;