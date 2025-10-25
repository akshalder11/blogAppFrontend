import { Link } from 'react-router-dom';

const Navbar = () => {
  // TODO: Get auth state from Redux store
  const isAuthenticated = false;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            BlogApp
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button className="text-gray-600 hover:text-gray-900">
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;