import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';



function Chart() {
    const [chartDataFromBackend, setChartDataFromBackend] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:3000/api/getchartdata", {headers: {
            Authorization: `Bearer ${token}`
        }}).then(response => {
            setChartDataFromBackend(response.data.chartData);
        })
        .catch(err => console.log(err));
    },[]);
    
    const groupedData = chartDataFromBackend.reduce((acc, curr) => {
        const cat = curr.category;
        const amt = Number(curr.amount);
        if(acc[cat]){
            acc[cat] += amt;
        } else {
            acc[cat] = amt;
        }
        return acc;
    }, {});

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Category wise total expenses for the month',
    },
  },
};

const labels = Object.keys(groupedData);
const values = Object.values(groupedData);

const data = {
  labels,
  datasets: [
    {
      label: 'Total Expenses [Rs.]',
      data: values,
      backgroundColor: 'rgba(255,69,0, 0.5)',
    },
  ],
};


    return <Bar options={options} data={data}></Bar>
}

export default Chart;