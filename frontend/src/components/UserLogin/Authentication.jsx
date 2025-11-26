export const loginUser = async (email, password) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/user_login/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Login failed");
    }

    const data = await response.json();
    return data; // Django’s JSON response with token
  } catch (error) {
    console.error("Error:", error);
    return { error: error.message };
  }
};

export const registerUser = async (email, password) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/user_login/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(JSON.stringify(err));
    }

    const data = await response.json();
    return data; // Django's JSON response with token
  } catch (error) {
    console.error("Error:", error);
    return { error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch("http://127.0.0.1:8000/user_login/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Logout failed");
    }

    // Clear token from localStorage
    localStorage.removeItem("token");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    // Even if the request fails, remove the token locally
    localStorage.removeItem("token");
    return { error: error.message };
  }
};
