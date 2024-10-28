// src/services/userService.ts

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchUserData = async (userId: number) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; // Re-throw the error to be handled in the calling function
  }
};
