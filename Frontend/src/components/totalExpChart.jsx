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

    const arrayOfDate = sortedDataForChart.map((item) => item.date);
    const arrayOfAmount = sortedDataForChart.map((item) => item.amount);

    console.log(arrayOfDate);
    console.log(arrayOfAmount);

    // console.log(sortedDataForChart);
    
    // const arrayOfDate = Object.keys(sortedDataForChart);
    // const arrayOfAmount = Object.values(sortedDataForChart);
    // console.log("Date:", arrayOfDate);
    // console.log("Amount: ", arrayOfAmount);

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

const labels = expData.map((item) => {
    const [year, month, day] = item.expense_date.split("-");
    return `${day}-${month}`; 
});
const values = expData.map((item) => item.amount);

const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: values,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};


  return <Line options={options} data={data} />;
}

export default ExpChart;