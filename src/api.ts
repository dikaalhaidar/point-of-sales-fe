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

export type RegisterPayload = {
  username: string;
  password: string;
  fullName: string;
  address: string;
  phoneNumber: string; // format E.164, mis. "+628123456789"
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data: {
    id?: number;
    username: string;
    fullName: string;
    address?: string;
    phoneNumber?: string;
    role: string; // otomatis "CASHIER"
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

export const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => null) as RegisterResponse | null;
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Registrasi gagal. Silakan coba lagi.");
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