const BASE_URL = "https://q24t6dq3-8080.asse.devtunnels.ms";

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    username: string;
    fullName: string;
    role: string;
  };
};

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json().catch(() => null) as LoginResponse | null;
  if (!response.ok || !result?.success || !result.data?.token) {
    throw new Error(result?.message || "Login gagal. Periksa username dan password.");
  }

  return result;
};

export const getProducts = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  

  return response.json();
};