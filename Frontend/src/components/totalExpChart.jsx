import {useEffect, useState} from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
function ExpChart() {
    const [expData, SetExpData] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:3000/api/getchartdata", {headers: {
            Authorization: `Bearer ${token}`
        }}).then(response => {
            SetExpData(response.data.chartData);
        })
        .catch(err => console.log(err));
    },[]);

    const sortedDataForChart = expData.map((item) => ({
        date: item.expense_date,
        amount: item.amount
    }));

    let togData = sortedDataForChart.reduce((acc, curr) => {
        if(!acc[curr.date]){
            acc[curr.date] = curr.amount;
        } else {
            acc[curr.date] += curr.amount;
        }
        return acc;
    },{});


const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Total Expenses Trend',
    },
  },
};


const labels = Object.keys(togData).map((item) => {
    const [year, month, day] = item.split("-");
    return `${day}-${month}`;
});
const values = Object.values(togData);



const data = {
  labels,
  datasets: [
    {
      label: 'Expenses per day',
      data: values,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255,69,0, 0.5)',
    },
  ],
};


  return <Line options={options} data={data} />;
}

export default ExpChart;