import axios from "axios";
import type { TripData } from "../types/tripData";

const API_URL = `${import.meta.env.VITE_API_URL}/trips`;

const authConfig = () => ({
  withCredentials: true,
});

export const getTrips = async () => {
  try {
    const response = await axios.get(API_URL, authConfig());
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getTrip = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, authConfig());
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createTrip = async (tripData: TripData): Promise<TripData> => {
  try {
    const res = await axios.post(API_URL, tripData, authConfig());
    return res.data; 
  } catch (error) {
    console.error(error); 
    throw error; 
  }
};

export const deleteTrip = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, authConfig());
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateTrip = async (id: number, tripData: TripData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${id}`,
      tripData,
      authConfig(),
    );
    if (!response.data) throw new Error("Could not update trip.");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
