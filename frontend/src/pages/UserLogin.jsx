import { useState } from "react";

import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

import Input from '../components/UserLogin/Input';
import SignUpOrIn from '../components/UserLogin/SignUpOrIn';
import { loginUser, registerUser } from '../components/UserLogin/Authentication';
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../components/AxiosInstance";

function UserLogin() {
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const loginColor = "!bg-[#3fA2A5] hover:!bg-[#203e3f] text-white w-25 h-10 !rounded-full";
  const registerColor = "!bg-transparent hover:!bg-[#3fA2A5] text-[#3fA2A5] hover:text-white !font-semibold w-25 h-10 !rounded-full border !border-[#3fA2A5] !hover:border-transparent";
  const navigate = useNavigate()

  const getUserStatus = async () => {
    try {
      const response = await AxiosInstance.get("user/current")
      const data = response.data
      if(data.is_superuser){
        navigate("/portal/admin/event-management")
      }
      else{
        navigate("/portal/profile")
      }
    } catch(error) {
      console.log(err)
    }
  }

  const handleAuth = async () => {
    setMessage("");
    try {
      let data;
      if (action === "Login") {
        data = await loginUser(email, password);
      } else {
        data = await registerUser(email, password);
      }

      if (data.token) {
        // Store token for future requests
        localStorage.setItem('token', data.token);
        setMessage(`${action} successful! Token saved.`);
        console.log(`${action} response:`, data);

        getUserStatus()
      } else {
        setMessage(`Incorrect email or password`);
        console.log("Error response:", data);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Check console for details.");
    }
  };

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <div className='flex flex-col items-center p-4 bg-white gap-4'>
        <div className="text-[#3fA2A5] text-xl">{action}</div>

        <Input
          name={email_icon}
          alternative="email icon"
          type="email"
          placeholder="Email"
          id="email_id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          name={password_icon}
          alternative="password icon"
          type="password"
          placeholder="Password"
          id="password_id"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <SignUpOrIn switchMode={action} onClick={handleAuth} />

        <div className='flex flex-row gap-5'>
          <button
            className={action === "Login" ? loginColor : registerColor}
            onClick={() => setAction("Register")}
          >
            Register
          </button>
          <button
            className={action === "Register" ? loginColor : registerColor}
            onClick={() => setAction("Login")}
          >
            Login
          </button>
        </div>

        {message && <div className="text-red-500 text-sm">{message}</div>}
      </div>
    </div>
  );
}

export default UserLogin;

