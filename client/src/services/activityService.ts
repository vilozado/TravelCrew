import axios from "axios";
import type { ActivityData } from "../types/activityData";

const API_URL = `${import.meta.env.VITE_API_URL}/activities`;

const authConfig = () => ({
  withCredentials: true,
});

export const getActivities = async (tripId: number): Promise<ActivityData[]> => {
  try {
    const response = await axios.get(`${API_URL}/trip/${tripId}`, authConfig());
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; 
  }
};

export const createActivity = async (
  activityData: ActivityData,
): Promise<ActivityData> => {
  try {
    const response = await axios.post(API_URL, activityData, authConfig());
    return response.data;
  } catch (error) {
    console.error(error); 
    throw error; 
  }
};

export const editActivity = async (id: number, data: Partial<ActivityData>) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, data, authConfig());
    return response.data; 
  } catch (error) {
    console.error(error)
  }
};

export const deleteActivity = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, authConfig());
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
