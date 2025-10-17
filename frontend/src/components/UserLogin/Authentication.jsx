export const loginUser = async (email, password) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password: password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    return data; // Django’s JSON response
  } catch (error) {
    console.error("Error:", error);
    return { error: error.message };
  }
};

export const registerUser = async (email, password) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password: password }),
    });

    if (!response.ok) {
      throw new Error("Signup failed");
    }

    const data = await response.json();
    return data; // Django’s JSON response
  } catch (error) {
    console.error("Error:", error);
    return { error: error.message };
  }
};

