import axios from "axios";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}`;


export const getAllLikedPublications = async (userId: number) => {
    try {
      const response = await axios.get(`${API_URL}/like/user/${userId}/publications`);
      return response.data; 
    } catch (error) {
      console.error("Erro ao buscar publicações curtidas:", error);
      throw error;
    }
  };