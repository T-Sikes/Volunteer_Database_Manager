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
    return data; // Django’s JSON response with token
  } catch (error) {
    console.error("Error:", error);
    return { error: error.message };
  }
};
