import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllPosts = async () => {
  try {
    console.log("Making API request to:", `${API_BASE_URL}/posts/allPost`);
    const response = await axios.get(`${API_BASE_URL}/posts/allPost`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("API Error:", {
      response: err.response?.data,
      status: err.response?.status,
      error: err,
    });

    // Normalize error message
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err.message ||
      "Failed to fetch posts";
    throw new Error(message);
  }
};


export const getPostById = async (postId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      throw new Error("User not authenticated");
    }

    console.log("Making API request to:", `${API_BASE_URL}/posts/getPost`);
    const response = await axios.post(
      `${API_BASE_URL}/posts/getPost`,
      { postId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("API Error:", {
      response: err.response?.data,
      status: err.response?.status,
      error: err,
    });

    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err.message ||
      "Failed to fetch post";
    throw new Error(message);
  }
};