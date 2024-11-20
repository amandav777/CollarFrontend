// src/services/authService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchWithTimeout = (
  url: string | URL | Request,
  options: RequestInit | undefined,
  timeout = 10000
) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    ),
  ]);
};

export const register = async (formData: FormData) => {
  const response: any = await fetchWithTimeout(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return await response.json();
};

export const login = async (email: string, password: string) => {
  const response:any = await fetchWithTimeout(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  const { access_token, userId } = await response.json();
  await AsyncStorage.setItem("token", access_token);
  await AsyncStorage.setItem("userId", userId.toString());
};
