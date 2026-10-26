const BASE_URL = "https://q24t6dq3-8080.asse.devtunnels.ms";

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