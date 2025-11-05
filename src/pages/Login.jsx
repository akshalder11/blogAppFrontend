import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  authStart,
  authFailure,
  loginSuccess,
} from "../features/auth/authSlice";
import { loginUser } from "../api/auth";

// ✅ Validation Schema
const loginSchema = z.object({
  username: z.string().min(2, "User Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ✅ Animation Variants
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

const groupVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      dispatch(authStart());
      const payload = {
        username: data.username,
        password: data.password,
      };
      const response = await loginUser(payload);
      console.log("Login successful:", response);
      // Extract necessary fields from response
      const userData = {
        id: response.id,
        username: response.username,
        email: response.email,
        token: response.jwtToken,
      };

      dispatch(loginSuccess(userData));

      // Persist to Local Storage
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/");
    } catch (err) {
      const errorMessage = err?.response?.data?.error || err.message;
      dispatch(authFailure(errorMessage));
    }
  };

  return (
    <div className="h-[calc(100vh-128px)] flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 text-center text-2xl font-bold"
        >
          Login to BlogApp
        </motion.h1>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Input Group */}
          <motion.div variants={groupVariants} className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                User Name
              </label>
              <Input
                id="username"
                type="username"
                {...register("username")}
                error={errors.username}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
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
          </motion.div>

          {/* Animated Button */}
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className={`w-full relative overflow-hidden h-11 flex items-center justify-center transition-all ${
                loading ? "opacity-90 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              <AnimatePresence mode="wait">
                {!loading ? (
                  // Default: Login
                  <motion.span
                    key="login"
                    initial={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex items-center justify-center"
                  >
                    Login
                  </motion.span>
                ) : (
                  // Loading: Logging in...
                  <motion.span
                    key="loggingin"
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
                    Logging in...
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Link */}
          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-gray-600"
          >
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </motion.p>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;
