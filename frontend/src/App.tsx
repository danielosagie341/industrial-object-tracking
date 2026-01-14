import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import './App.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Stats {
  person: number;
  vehicle: number;
  machinery: number;
}

function App() {
  const [stats, setStats] = useState<Stats>({ person: 0, vehicle: 0, machinery: 0 });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5001/stats');
        setStats(response.data);
        setIsConnected(true);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setIsConnected(false);
      }
    };

    const interval = setInterval(fetchStats, 1000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: ['Person', 'Vehicle', 'Machinery'],
    datasets: [
      {
        label: 'Detected Objects',
        data: [stats.person, stats.vehicle, stats.machinery],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Real-time Object Detection Stats',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Industrial Object Tracking Dashboard</h1>
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? 'System Online' : 'Connecting to Server...'}
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="video-container">
          <h2>Live Feed</h2>
          <div className="video-wrapper">
            <img 
              src="http://localhost:5001/video_feed" 
              alt="Live Object Detection Feed" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x480?text=Video+Feed+Unavailable';
              }}
            />
          </div>
        </div>
        
        <div className="stats-container">
          <h2>Statistics</h2>
          <div className="chart-wrapper">
            <Bar options={options} data={chartData} />
          </div>
          <div className="stats-cards">
            <div className="card">
              <h3>Personnel</h3>
              <p className="count">{stats.person}</p>
            </div>
            <div className="card">
              <h3>Vehicles</h3>
              <p className="count">{stats.vehicle}</p>
            </div>
            <div className="card">
              <h3>Machinery</h3>
              <p className="count">{stats.machinery}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
