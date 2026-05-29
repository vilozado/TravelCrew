import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/invites`;

const authConfig = () => ({
  withCredentials: true,
});

export const sendInvite = async (
  tripId: number,
  name: string,
  email: string,
) => {
  try {
    const res = await axios.post(
      `${API_URL}/${tripId}`,
      { name, email },
      authConfig(),
    );
    return res.data;
  } catch (error) {
    console.log(error, "Could not send invite");
  }
};

export const acceptInvite = async (inviteToken: string) => {
  try {
    const res = await axios.post(
      `${API_URL}/accept`,
      { inviteToken },
      authConfig(),
    );
    return res.data;
  } catch (error) {
    console.log(error, "Could not accept the invite");
  }
};
