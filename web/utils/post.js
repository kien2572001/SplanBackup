import ky from "ky";

export const getPostById = async (postId) => {
  try {
    const response = await ky.get(`/api/users/posts/${postId}`).json();
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPostsPage = async (userId, pageParam = 1) => {
  try {
    const response = await ky
      .get(`/api/users/posts?user_id=${userId}&page=${pageParam}`)
      .json();
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async (pageParam = 1) => {
  try {
    const response = await ky.get(`/api/posts?page=${pageParam}`).json();
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
