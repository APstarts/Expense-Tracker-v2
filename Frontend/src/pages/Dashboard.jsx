import axios from 'axios';
import {useEffect} from 'react';

const Dashboard = () => {
  useEffect(() => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token inside useEffect:", token);

    axios.get("http://localhost:3000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      console.log("Dashboard data: ", res.data);
    }).catch(err => {
      console.log("Axios error:", err);
    });
  } catch (err) {
    console.log("Error in useEffect:", err);
  }
}, []);

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard