import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()
  return (
  <div className="flex flex-col h-screen w-screen justify-center items-center">
    <h1>Home</h1>
    <div>
      <button onClick={() => navigate("/user-login")} className="h-20 w-40 !bg-teal-700 text-white">Login</button>
    </div>
  </div>
  )
}

export default Home