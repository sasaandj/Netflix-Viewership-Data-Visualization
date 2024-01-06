import "./App.css";
import NetFlixData from "./NetflixData.csv";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [chartData, setChartData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [runTime, setRunTime] = useState([]);

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

  console.log(chartData);

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

  return (
    <div className="App">
      <h1>Data Visualization Project</h1>

      <div style={{ padding: "20px", width: "50%" }}>
        <Pie data={data} options={options}></Pie>
      </div>
    </div>
  );
}

export default App;
