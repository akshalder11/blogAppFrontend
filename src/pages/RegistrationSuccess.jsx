import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { CheckCircle } from 'lucide-react';

const RegistrationSuccess = () => {
  return (
    <div className="h-[calc(100vh-128px)] flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1
            }}
          >
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Registration Successful!
            </h1>
            <p className="text-gray-600 mb-8">
              Your account has been created successfully. You can now login to start using BlogApp.
            </p>
          </motion.div>

          <motion.div 
            className="flex gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link to="/login" className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Login Now
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Go to Home
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
