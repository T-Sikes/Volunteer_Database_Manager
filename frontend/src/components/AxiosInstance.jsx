import axios from "axios"

const baseUrl = "http://127.0.0.1:8000/"

const AxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        "Content-Type":"application/json",
        accept: "application/json"
    }
})

AxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        
        // Add token to request
        if(token){
            config.headers.Authorization = `Token ${token}`
        }
        else{
            config.headers.Authorization = ``        
        }
        return config
    }
)

AxiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Whenever the request is unauthorized
        // 401 error - When our token is expired or invalid
        if(error.response && error.response.status === 401){
            localStorage.removeItem("token")
            window.location.href = "/user-login"
        }
    }
)

export default AxiosInstance