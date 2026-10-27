
const BASE_URL = "https://q24t6dq3-8080.asse.devtunnels.ms";

// =========================
// AUTH: LOGIN
// =========================

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

  const result = (await response.json().catch(() => null)) as LoginResponse | null;

  if (!response.ok || !result?.success || !result.data?.token) {
    throw new Error(
      result?.message || "Login gagal. Periksa username dan password."
    );
  }

  return result;
};

// =========================
// AUTH: REGISTER
// =========================

export type RegisterPayload = {
  username: string;
  password: string;
  fullName: string;
  address: string;
  phoneNumber: string;
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
    role: string;
  };
};

export const register = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => null)) as RegisterResponse | null;

  if (!response.ok || !result?.success) {
    throw new Error(
      result?.message || "Registrasi gagal. Silakan coba lagi."
    );
  }

  return result;
};

// =========================
// PRODUCTS
// =========================

export const getProducts = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/products?page=1&size=10`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  console.log("PRODUCT API:", result);

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch products");
  }

  return result;
};

// =========================
// STOCK: TYPES
// =========================

export type StockItem = {
  productId: string;
  sku: string;
  productName: string;
  stock: number;
  status: string;
  updatedAt: string;
};

export type StockPagination = {
  page: number;
  limit: number;
  totalElements: number;
  totalPages: number;
};

export type StockResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  pagination?: StockPagination;
};

export type AdjustStockPayload = {
  type: "in" | "adjustment";
  quantity: number;
  note: string;
};

// =========================
// STOCK: GET ALL
// GET /stock
// =========================

export const getAllStock = async (params?: {
  search?: string;
  categoryId?: string;
  status?: string;
  sortBy?: string;
  direction?: string;
  page?: number;
  size?: number;
}): Promise<StockResponse<StockItem[]>> => {
  const token = localStorage.getItem("token");

  const query = new URLSearchParams({
    sortBy: params?.sortBy ?? "updatedAt",
    direction: params?.direction ?? "desc",
    page: String(params?.page ?? 1),
    size: String(params?.size ?? 10),
  });

  if (params?.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params?.categoryId) {
    query.set("categoryId", params.categoryId);
  }

  if (params?.status) {
    query.set("status", params.status);
  }

  const response = await fetch(`${BASE_URL}/stock?${query.toString()}`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = (await response.json().catch(() => null)) as
    | StockResponse<StockItem[]>
    | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Gagal mengambil data stok.");
  }

  return result;
};

// =========================
// STOCK: GET DETAIL
// GET /stock/{productId}
// =========================

export const getStockByProductId = async (
  productId: string
): Promise<StockResponse<StockItem>> => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${BASE_URL}/stock/${encodeURIComponent(productId)}`,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = (await response.json().catch(() => null)) as
    | StockResponse<StockItem>
    | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Gagal mengambil detail stok.");
  }

  return result;
};

// =========================
// STOCK: ADJUST STOCK
// POST /stock/{productId}
// =========================

export const adjustStock = async (
  productId: string,
  payload: AdjustStockPayload
): Promise<StockResponse<StockItem>> => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${BASE_URL}/stock/${encodeURIComponent(productId)}`,
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const result = (await response.json().catch(() => null)) as
    | StockResponse<StockItem>
    | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Gagal memperbarui stok.");
  }

  return result;
};
