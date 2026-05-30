const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const simulateCode = async (code) => {
  const response = await fetch(`${API_BASE_URL}/simulate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Failed to run simulation.");
  }

  return response.json();
};
