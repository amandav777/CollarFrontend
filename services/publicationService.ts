// services/publicationService.ts

import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { NewPost } from "@/interfaces/newPost";

export type PublicationData = {
  id: number;
  description: string;
  images: string[];
  status: string;
  user: {
    id: number;
    name: string;
    profilePicture: any;
  };
  location: string;
  likeCount: number;
  createdAt: string;
};

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/publications`;

export const fetchPublications = async (controller: AbortController) => {
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(API_URL, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }
    const result: PublicationData[] = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const searchPublications = async (query: string): Promise<[]> => {
  const response = await axios.get(
    `${API_URL}/publications/search?q=${query}`
  );
  return response.data;
};

export const pickImages = async (existingImages: string[]) => {
  if (existingImages.length >= 4) {
    alert("Limite de Imagens");
    return null;
  }

  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    alert("Permissão negada!");
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: true,
    selectionLimit: 4 - existingImages.length,
    quality: 1,
    aspect: [4, 3],
  });

  if (!result.canceled && result.assets) {
    return [
      ...existingImages,
      ...result.assets.map((asset) => asset.uri),
    ].slice(0, 4);
  }

  return null;
};

export const createPost = async (newPost: NewPost, user: string) => {
  const formData = new FormData();

  formData.append("description", newPost.details);
  formData.append("contactInfos", newPost.info);
  formData.append("userId", user);
  formData.append("status", newPost.status);
  formData.append("location", newPost.location || "Marilia");

  try {
    if (newPost.images && newPost.images.length > 0) {
      const imagesToSend = newPost.images.slice(0, 4);

      for (let i = 0; i < imagesToSend.length; i++) {
        const imageUri = imagesToSend[i];
        const file = {
          uri: imageUri,
          type: "image/jpeg",
          name: `image${i + 1}.jpg`,
        };
        formData.append("images", file);
      }
    } else {
      console.error("Nenhuma imagem fornecida.");
      return;
    }

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/publications`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (response.status === 201) {
      const data = await response.json();
      return { data, status: response.status };
    } else {
      console.error("Erro ao criar publicação:", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao enviar a publicação:", error);
  }
};

export const getAllLikedPublications = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/like/user/${userId}/publications`);
    return response.data; 
  } catch (error) {
    console.error("Erro ao buscar publicações curtidas:", error);
    throw error;
  }
};
