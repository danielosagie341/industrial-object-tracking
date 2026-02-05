import React, { useEffect, useState, useRef } from 'react';
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
import './App.css';

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

const API_URL = 'http://localhost:5001' // 'https://industrial-tracking-api.onrender.com';

function App() {
  const [stats, setStats] = useState<Stats>({ person: 0, vehicle: 0, machinery: 0 });
  const [isStreaming, setIsStreaming] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  // Remove intervalRef, we use a recursive loop now
  const isProcessingRef = useRef(false); 

  // Start Camera
  const startCamera = async () => {
    try {
      // Request specific lower resolution for speed (640x480 is standard for YOLO)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, frameRate: { ideal: 30 } } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsStreaming(true);
        };
        setError(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please allow camera permissions.");
    }
  };
  
  // Stop Camera
  const stopCamera = () => {
    setIsStreaming(false);
    isProcessingRef.current = false; // Break the loop
    
    if (videoRef.current && videoRef.current.srcObject) {
         const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
         tracks.forEach(track => track.stop());
         videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // OPTIMIZED FRAME PROCESSING LOOP
  useEffect(() => {
    if (!isStreaming) return;

    let isActive = true; // Safety flag for cleanup

    const processFrame = async () => {
      // 1. Basic checks
      if (!isActive || !videoRef.current || videoRef.current.readyState !== 4) {
        if (isActive) requestAnimationFrame(processFrame);
        return;
      }

      // 2. Logic to allow continuous looping
      // If we are already waiting for a server response, don't send another yet.
      // But we call requestAnimationFrame to keep checking.
      if (isProcessingRef.current) {
         if (isActive) requestAnimationFrame(processFrame);
         return; 
      }

      // 3. Capture & Send
      isProcessingRef.current = true; // Lock

      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        // Limit Resolution for speed (320px is enough for detection, 640px for nice view)
        // If your internet is slow, change this to video.videoWidth / 2
        canvas.width = video.videoWidth; 
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // CONVERT TO BLOB
          // Use 'image/jpeg' with 0.5 quality -> 50% smaller file size -> 2x faster upload
          canvas.toBlob(async (blob) => {
            if (!blob || !isActive) {
               isProcessingRef.current = false;
               return;
            }

            const formData = new FormData();
            formData.append('frame', blob);

            try {
              const response = await axios.post(`${API_URL}/process_frame`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });

              if (isActive) {
                setStats(response.data.stats);
                setProcessedImage(`data:image/jpeg;base64,${response.data.image}`);
              }
            } catch (err) {
              console.error("Frame skip:", err);
            } finally {
              // Unlock immediately after response
              isProcessingRef.current = false;
            }
          }, 'image/jpeg', 0.5); // Quality 0.5 is key for speed
        }
      } catch (e) {
        isProcessingRef.current = false;
      }

      // Schedule next check
      if (isActive) requestAnimationFrame(processFrame);
    };

    // Kick off the loop
    processFrame();

    return () => {
      isActive = false;
      isProcessingRef.current = false;
    };
  }, [isStreaming]);

  const chartData = {
    labels: ['Person', 'Vehicle', 'Machinery'],
    datasets: [
      {
        label: 'Detected Objects',
        data: [stats.person, stats.vehicle, stats.machinery],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(53, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(53, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Industrial Object Tracking</h1>
        {error && <div className="status-indicator disconnected">{error}</div>}
      </header>
      
      <main className="dashboard-content">
        <div className="video-container" style={{padding: '20px', minWidth: '640px'}}>
          <h2>Live Feed</h2>
          
          <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              style={{ display: 'none' }} 
          />
          
          <div style={{position: 'relative', minHeight: '480px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {isStreaming ? (
                processedImage ? (
                    <img src={processedImage} alt="Processed Stream" style={{maxWidth: '100%', maxHeight: '480px'}} />
                ) : (
                    <div>Connecting to AI Engine...</div>
                )
            ) : (
                <div>Camera Stopped</div>
            )}
          </div>
          
          <div style={{marginTop: '20px'}}>
            {!isStreaming ? (
                <button 
                  onClick={startCamera} 
                  style={{padding: '10px 20px', fontSize: '16px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
                >
                  Start Camera
                </button>
            ) : (
                <button 
                  onClick={stopCamera} 
                  style={{padding: '10px 20px', fontSize: '16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
                >
                  Stop Camera
                </button>
            )}
          </div>
        </div>
        
        <div className="stats-container" style={{padding: '20px', minWidth: '400px'}}>
            <h2>Real-time Statistics</h2>
            <div style={{height: '400px'}}>
              <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;