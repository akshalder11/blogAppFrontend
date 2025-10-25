import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from '../components/ui/Navbar';

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <Outlet />
      </main>
      <Toaster position="top-center" />
    </div>
  );
};

export default RootLayout;