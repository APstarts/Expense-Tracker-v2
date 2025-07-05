import {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function handleSubmit(e){
        e.preventDefault();
        axios.post("http://localhost:3000/api/login", {username, password})
        .then(response => {
            console.log(response.data.message);
            console.log("token: ", response.data.token);
            localStorage.setItem("token", response.data.token);//need to save the token into local storage here which can be further used to access the protected routes.
            navigate("/dashboard");
        }).catch((err) => {
            console.log(err.response);
        })
    }
    
return (
    <div className="w-screen h-screen flex flex-col gap-2 justify-center items-center">
        <h1 className='text-2xl block p-1'>Welcome! Please login to access your dashboard!</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-xs p-5 rounded-lg shadow-2xl">
            <label>Username</label>
            <input className="border border-gray-400 p-1 rounded-md" type="email" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label>Password</label>
            <input className="border border-gray-400 p-1 rounded-md" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className='bg-blue-500 text-white w-20 p-1 rounded-md hover:bg-blue-600 cursor-pointer'>Login</button>
        </form>
    </div>
)
}

export default Login