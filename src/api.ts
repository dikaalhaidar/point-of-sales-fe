const BASE_URL = "https://q24t6dq3-8080.asse.devtunnels.ms";

const getToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token login tidak ditemukan. Silakan login kembali.");
  }

  return token;
};

const request = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || result?.success === false) {
    throw new Error(
      result?.message || `Request gagal. HTTP ${response.status}`
    );
  }

  return result;
};

// LOGIN
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

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success || !result?.data?.token) {
    throw new Error(
      result?.message || "Login gagal. Periksa username dan password."
    );
  }

  return result as LoginResponse;
};

// GET PRODUCTS + PAGINATION
export const getProducts = (page = 1, size = 10) =>
  request(`/products?page=${page}&size=${size}`);

// GET CATEGORIES
export const getCategories = () => request("/categories");

// GET PRODUCT BY ID
export const getProductById = (id: string | number) =>
  request(`/products/${id}`);

// CREATE PRODUCT
export const createProduct = (data: {
  name: string;
  categoryId: string;
  stock: number;
  price: number;
}) =>
  request("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// UPDATE PRODUCT
export const updateProduct = (
  id: string | number,
  data: {
    name: string;
    categoryId: string;
    price: number;
    stock?: number;
  }
) =>
  request(`/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// DEACTIVATE PRODUCT
export const deactivateProduct = (id: string | number) =>
  request(`/products/${id}/deactivate`, {
    method: "PATCH",
  });