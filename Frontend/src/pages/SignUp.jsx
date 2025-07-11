import {useState} from 'react'
import axios from 'axios'

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e){
        e.preventDefault();
        axios.post("http://localhost:3000/api/register", {username, password })
        .then(response => {
            console.log(response.data.message)
        }).catch((err) => {
            if(err.response){
                console.log(err.response.data.message);
            } else {
                console.log("Error: ", err.message);
            }
        })
    };
  return (
    <div className='h-screen flex flex-col gap-5 justify-center items-center'>
        <h1 className='text-2xl'>Please register to peform your expense analysis!</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-xs p-5 rounded-lg shadow-2xl">
            <label>Username</label>
            <input className="border border-gray-400 p-1 rounded-md" type="email" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label>Password</label>
            <input className="border border-gray-400 p-1 rounded-md" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className='bg-blue-500 text-white w-20 p-1 rounded-md hover:bg-blue-600 cursor-pointer'>Register</button>
        </form>
    </div>
  )
}

export default SignUp