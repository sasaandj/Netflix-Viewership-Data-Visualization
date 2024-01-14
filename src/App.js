import "./App.css";
import NetFlixData from "./NetflixData.csv";
import GlobalData from "./all-weeks-global.csv";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import {
  Chart as LineChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
LineChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend
);

function App() {
  // Pie Data
  const [chartData, setChartData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [runTime, setRunTime] = useState([]);

  // Line Data
  const [generalData, setGeneralData] = useState([]);
  const [lineLabels, setLineLabels] = useState([]);
  const [runTimeData, setRunTimeData] = useState([]);

  // Calendar
  const [value, OnValueChange] = useState(new Date());
  const [date, setDate] = useState("");

  useEffect(() => {
    Papa.parse(NetFlixData, {
      download: true,
      header: true,
      dynamicTyping: true,
      delimter: "",
      complete: (result) => {
        setChartData(result.data);
      },
    });
  }, []);

  useEffect(() => {
    Papa.parse(GlobalData, {
      download: true,
      header: true,
      dynamicTyping: true,
      delimter: "",
      complete: (result) => {
        setGeneralData(result.data);
      },
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await reverseDate();

      const filteredLabels = generalData
        .filter((m) => m.week === date)
        .filter((m) => m.category === "Films (English)")
        .map((m) => m.show_title);
      setLineLabels(filteredLabels);
    };
    fetchData();
  }, [date]);

  useEffect(() => {
    const filteredLabels = generalData
      .filter((m) => m.week === "2023-12-17")
      .filter((m) => m.category === "Films (English)")
      .map((m) => m.weekly_views);
    setRunTimeData(filteredLabels);
  }, [generalData]);

  useEffect(() => {
    const filteredLabels = chartData
      .filter((m) => m.category === "Films (English)")
      .map((m) => m.show_title);

    setLabels(filteredLabels);
  }, [chartData]);

  useEffect(() => {
    const filteredHoursViewed = chartData
      .filter((m) => m.category === "Films (English)")
      .map((m) => m.hours_viewed_first_91_days);

    setRunTime(filteredHoursViewed);
  }, [chartData]);

  const reverseDate = async (str) => {
    if (str) {
      const part = str.toLocaleDateString().split("/");
      const reversDate = part[2] + "-" + part[0] + "-" + part[1];
      setDate(reversDate);
      console.log(date);
    }
  };

  useEffect(() => {
    const fetchDataAndProcess = async () => {
      await reverseDate(value);
    };
    fetchDataAndProcess();
  }, [value]);

  const data = {
    labels: labels,
    datasets: [
      {
        data: runTime,
        backgroundColor: ["aqua", "orange", "purple"],
      },
    ],
  };
  const options = {};

  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: "Sales of the Week",
        data: runTimeData,
        backgroundColor: "aqua",
        borderColor: "black",
        pointBorderColor: "aqua",
        fill: true,
      },
    ],
  };

  const lineOptions = {
    plugins: {
      legend: true,
    },
    scales: {
      y: {
        // min: 0,
        // max: 1000,
      },
    },
  };

  return (
    <div className="App">
      <h1>Data Visualization Project</h1>

      <div style={{ padding: "20px", width: "200px", height: "100px" }}>
        <Pie data={data} options={options}></Pie>
      </div>
      <div style={{ width: "600px", height: "300px", padding: "20px" }}>
        <Line data={lineData} options={lineOptions}></Line>
        <Calendar value={value} onChange={OnValueChange}></Calendar>
        {value && <h3>{value.toLocaleDateString().split("")}</h3>}
      </div>
    </div>
  );
}

export default App;
