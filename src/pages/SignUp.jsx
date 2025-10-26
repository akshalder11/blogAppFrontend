import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  authStart,
  authFailure,
  loginSuccess,
} from "../features/auth/authSlice";
import { registerUser } from "../api/auth";
import { LoaderCircle } from "lucide-react";

// Validation Schema
const signupSchema = z
  .object({
    username: z.string().min(2, "User Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// For grouped inputs (appear together)
const groupVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data) => {
    try {
      dispatch(authStart());
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password,
      };
      const response = await registerUser(payload);
      console.log("Registration successful:", response);
      dispatch(loginSuccess(null));
      navigate("/registration-success");
    } catch (err) {
      const errorMessage = err?.response?.data?.error || err.message;
      dispatch(authFailure(errorMessage));
    }
  };

  return (
    <div className="h-[calc(100vh-128px)] flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <motion.h1
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 text-center text-2xl font-bold"
        >
          Create an Account
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Input Group - all appear together */}
          <motion.div variants={groupVariants} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                User Name
              </label>
              <Input
                id="username"
                type="text"
                {...register("username")}
                error={errors.username}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                error={errors.email}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                error={errors.password}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                error={errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </motion.div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Button */}
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full relative overflow-hidden h-11 flex items-center justify-center"
              disabled={loading}
            >
              <AnimatePresence mode="wait">
                {!loading ? (
                  // Default: "Sign Up"
                  <motion.span
                    key="signup"
                    initial={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex items-center justify-center"
                  >
                    Sign Up
                  </motion.span>
                ) : (
                  // Loading: "Signing Up..."
                  <motion.span
                    key="signingup"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex items-center justify-center gap-2"
                  >
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    >
                      <LoaderCircle size={18} />
                    </motion.span>
                    Just a moment...
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Login Link */}
          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-gray-600"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Login
            </Link>
          </motion.p>
        </motion.form>
      </div>
    </div>
  );
};

export default SignUp;
