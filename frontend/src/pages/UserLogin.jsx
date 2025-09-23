import { useState } from "react";
import './UserLogin.css'

import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'

function UserLogin() {

  const [action,setAction] = useState("Login");

  return(
   <div className='container'>

    <div className="header">
      <div className="text">{action}</div>
    </div>

    <div className="inputs">
      <div className="input">
        <img src={email_icon} alt="email icon" />
        <input type="email" placeholder="Email"/>
      </div>

      <div className="input">
        <img src={password_icon} alt="password icon" />
        <input type="password" placeholder="Password"/>
      </div>

    </div>
    
    {action==="Register"?
      <div>
        <div className="signUp">Sign up</div>
      </div>
      : 
      <>
      <div className="forgot-password">Forgot Password?<span> Click here!</span></div> 
      <div className = "signIn">Sign in</div> 
      </>
    }
         <div className="submit-container">
      <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Register")}}>Register</div>
      <div className={action==="Register"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
    </div>
   </div>
  )
}

export default UserLogin
