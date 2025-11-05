import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from '../components/ui/Navbar';

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 mt-16 text-gray-800">
        <Outlet />
      </main>
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
    </div>
  );
};

export default RootLayout;