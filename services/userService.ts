// src/services/userService.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchUserData = async (userId: number) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Re-throw the error to be handled in the calling function
  }
};

/**
 * Atualiza os dados do usuário no backend
 * @param userId ID do usuário a ser atualizado
 * @param updatedData Dados atualizados do usuário
 * @returns Dados atualizados do usuário
 */

export const updateUserData = async (updatedData: any) => {
  try {
    console.log(updatedData);
    const userId = await AsyncStorage.getItem("userId");
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "POST",
      body: updatedData,
      headers: {
        "Content-Type": "multipart/form-data", // Certifique-se de adicionar esse cabeçalho
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar os dados do usuário");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro no updateUserData:", error);
    throw error; // Re-lançar erro para ser tratado no componente
  }
};
