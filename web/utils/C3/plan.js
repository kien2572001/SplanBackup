import ky from "ky";

export const getAllMilestoneByUserId = async (userId) => {
  try {
    const response = await ky.get(`/api/targets?userId=${userId}`).json();
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getMilestoneById = async (planId) => {
  try {
    const response = await ky.get(`/api/targets/${planId}`).json();
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
