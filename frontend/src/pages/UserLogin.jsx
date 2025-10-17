import { useState } from "react";

import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'

import Input from '../components/UserLogin/Input'
import SignUpOrIn from '../components/UserLogin/SignUpOrIn'
import { loginUser, registerUser } from '../components/UserLogin/Authentication'

function UserLogin() {
  const [action,setAction] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const loginColor = "!bg-[#3fA2A5] hover:!bg-[#203e3f] text-white w-25 h-10 !rounded-full";
  const registerColor = "!bg-transparent hover:!bg-[#3fA2A5] text-[#3fA2A5] hover:text-white !font-semibold w-25 h-10 !rounded-full border !border-[#3fA2A5] !hover:border-transparent";

 const handleAuth = async () => {
    if (action === "Login") {
      const data = await loginUser(email, password);
      console.log("Login response:", data);
    } else {
      const data = await registerUser(email, password);
      console.log("Register response:", data);
    }
  }; 
  return(
    <>
  <div className='h-screen w-screen flex items-center justify-center'>
   <div className='flex flex-col items-center p-4 bg-white'>

   <div className="text-[#3fA2A5] text-xl">{action}</div>

    {/* asks for input for email and password */}
   <Input name={email_icon} alternative="email icon" type="email" placeholder="Email" id="email_id" value={email} onChange={(e) => setEmail(e.target.value)}/> 
   <Input name={password_icon} alternative="password icon" type="password" placeholder="Password" id="password_id" value={password} onChange={(e) => setPassword(e.target.value)}/> 

    {/* button that toggles between sign up and sign in depending on if action is Login or Register */}
   <SignUpOrIn switchMode={action} onClick={handleAuth}/>
        
    {/* changes color when login or register button is pressed */}
    <div className='flex flex-row gap-5'>
      <button className={action==="Login"? loginColor : registerColor } onClick={()=>{setAction("Register")}}>Register</button>
      <button className={action==="Register"? loginColor : registerColor } onClick={()=>{setAction("Login")}}>Login</button>
    </div>

   </div>
  </div>
    </>
  )
}

export default UserLogin
