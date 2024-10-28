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
    profileImage: any;
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
    `http://localhost:3000/publications/search?q=${query}`
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
    alert(
      "Permissão negada!"
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    selectionLimit: 4 - existingImages.length,
    quality: 1,
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
  formData.append("info", newPost.info);
  formData.append("userId", user);
  formData.append("status", newPost.status);
  formData.append("location", newPost.location || "Marilia");

  for (const [index, imageUri] of newPost.images.entries()) {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const fileName = imageUri.split("/").pop() || `image_${index}.jpg`;
    formData.append("images[]", blob, fileName);
  }

  return await fetch(`${process.env.EXPO_PUBLIC_API_URL}/publications`, {
    method: "POST",
    body: formData,
  });
};
