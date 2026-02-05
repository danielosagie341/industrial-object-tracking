# Industrial Object Tracking System

## 📋 Project Overview

### What is this project?
This is a **real-time object detection and tracking system** designed for industrial environments. It uses your computer's webcam (or any video source) to automatically identify and count three categories of objects:
- **People/Personnel** - Workers and staff in the facility
- **Vehicles** - Cars, motorcycles and boats
- **Machinery/Equipment** - Industrial equipment, trucks, computers, electronics, and other devices

### Why is this useful?
In industrial settings, tracking the movement of people, vehicles, and equipment is crucial for:
- **Safety monitoring** - Knowing how many people are in dangerous areas
- **Resource management** - Tracking equipment usage and availability
- **Security** - Monitoring unauthorized access or unusual activity
- **Efficiency** - Understanding workflow patterns and bottlenecks

### How does it work?
The system uses **Artificial Intelligence (AI)** to "see" and understand what's in the video feed. Specifically, it uses a computer vision algorithm called **YOLOv8** (You Only Look Once, version 8), which can detect objects in images incredibly fast - up to 30+ times per second!

The system has two main parts:
1. **Backend (Python)** - Does the heavy lifting: processes video, runs AI detection, and provides data
2. **Frontend (React)** - Shows you the results: displays live video with detected objects and statistics

---

## 🛠️ Technologies Used

### Backend Technologies
| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **Python 3.12** | Programming language | Fast, popular for AI/ML applications |
| **Flask** | Web framework | Creates the web server that streams video and data |
| **OpenCV** | Computer vision library | Handles video capture and image processing |
| **Ultralytics YOLOv8** | AI object detection | State-of-the-art, fast, and accurate object detection |
| **PyTorch** | Deep learning framework | Powers the neural network that runs YOLOv8 |
| **Flask-CORS** | Cross-origin resource sharing | Allows frontend and backend to communicate |

### Frontend Technologies
| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **React 18** | JavaScript UI framework | Builds interactive, responsive user interfaces |
| **TypeScript** | Programming language | Adds type safety to JavaScript code |
| **Chart.js** | Data visualization | Creates beautiful, animated charts for statistics |
| **Axios** | HTTP client | Fetches data from the backend server |
| **CSS3** | Styling | Makes the interface look professional and modern |

---

## 🧠 The Algorithm: How YOLOv8 Works

### Non-Technical Explanation
Imagine you're looking at a photograph and trying to find all the people in it. You'd scan the image, recognize faces and body shapes, and mentally count them. YOLOv8 does exactly this, but:
- It does it **thousands of times faster** than a human
- It can recognize **80 different types of objects** (not just people)
- It can process **video in real-time** (30+ frames per second)
- It draws colored boxes around detected objects and labels them

### Technical Explanation

**YOLOv8 Architecture:**
YOLOv8 is a single-stage object detector that uses a **Convolutional Neural Network (CNN)** architecture. Here's how it works:

1. **Backbone Network (CSPDarknet)**
   - Extracts features from the input image using multiple convolutional layers
   - Uses Cross-Stage Partial (CSP) connections for better gradient flow
   - Produces feature maps at different scales (small, medium, large)

2. **Neck (Path Aggregation Network - PAN)**
   - Combines features from different scales
   - Uses both top-down and bottom-up pathways
   - Enhances feature pyramid for better multi-scale detection

3. **Head (Detection Layers)**
   - Predicts bounding boxes, class probabilities, and confidence scores
   - Uses anchor-free detection (unlike older YOLO versions)
   - Outputs detections at multiple scales for objects of different sizes

4. **Post-Processing (Non-Maximum Suppression - NMS)**
   - Removes duplicate detections of the same object
   - Keeps only the most confident predictions
   - Applies confidence thresholds to filter weak detections

**Key Features:**
- **Speed**: 150+ FPS on GPU, 30+ FPS on CPU
- **Accuracy**: 50+ mAP (mean Average Precision) on COCO dataset
- **Efficiency**: Nano model (yolov8n.pt) is only 6.2 MB
- **Pre-trained**: Trained on COCO dataset with 80 object classes

**Detection Categories in Our System:**
- **Person**: COCO class 0
- **Vehicles**: Classes 2 (car), 3 (motorcycle), 7 (truck), 8 (boat)
- **Machinery**: Classes 5 (bus), 6 (train), 9 (traffic light), 63 (laptop), 64 (mouse), 65 (remote), 66 (keyboard), 67 (cell phone), 73 (book), 84 (clock)

---

## 📁 Project Structure

```
industrial-object-tracking/
│
├── backend/                          # Python Flask server
│   ├── app.py                       # Main Flask application
│   ├── detector.py                  # YOLOv8 object detection logic
│   ├── requirements.txt             # Python dependencies
│   ├── yolov8n.pt                   # AI model file (downloaded automatically)
│   ├── download_model.py            # Helper script to download model
│   └── templates/
│       └── index.html              # Simple HTML frontend (alternative)
│
└── frontend/                         # React application
    ├── public/
    │   └── index.html               # HTML template
    ├── src/
    │   ├── App.tsx                  # Main React component
    │   ├── App.css                  # Styles
    │   ├── index.tsx                # React entry point
    │   └── index.css                # Global styles
    ├── package.json                 # Node.js dependencies
    └── tsconfig.json                # TypeScript configuration
```

---

## 🚀 Installation & Setup Guide

### Prerequisites
Before you begin, ensure you have the following installed on your computer:

1. **Python 3.12 or higher**
   - Download from: https://www.python.org/downloads/
   - ⚠️ **Important**: During installation, check "Add Python to PATH"

2. **Node.js 18 or higher**
   - Download from: https://nodejs.org/
   - ⚠️ **Important**: During installation, check "Add to PATH"

3. **Visual Studio Code (VS Code)**
   - Download from: https://code.visualstudio.com/

4. **Webcam or Camera**
   - Built-in laptop camera or USB webcam

### Step-by-Step Setup

#### 1️⃣ Clone or Download the Project
```bash
# If using Git:
git clone <repository-url>
cd industrial-object-tracking

# OR simply download and extract the ZIP file
```

#### 2️⃣ Open in VS Code
```bash
# Open VS Code in the project folder
code .
```

#### 3️⃣ Setup Backend (Python Server)

**Option A: Using VS Code Terminal**
1. Open a new terminal in VS Code (`Terminal` → `New Terminal`)
2. Navigate to the backend folder:
```powershell
cd backend
```

3. Create a virtual environment (recommended):
```powershell
python -m venv venv
```

4. Activate the virtual environment:
```powershell
# On Windows:
.\venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

5. Install Python dependencies:
```powershell
pip install -r requirements.txt
```

**Option B: Using Global Python**
```powershell
cd backend
pip install -r requirements.txt
```

#### 4️⃣ Setup Frontend (React Application)

1. Open a **new terminal** in VS Code (keep the backend terminal open)
2. Navigate to the frontend folder:
```powershell
cd frontend
```

3. Install Node.js dependencies:
```powershell
npm install
```

This will take 2-5 minutes and install ~1,300 packages.

---

## ▶️ Running the Application

### Starting the Backend Server

1. Open a terminal and navigate to the backend folder:
```powershell
cd backend
```

2. If using a virtual environment, activate it first:
```powershell
.\venv\Scripts\activate  # Windows
```

3. Run the Flask server:
```powershell
python app.py
```

**Expected Output:**
```
Downloading https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt...
100%|████████████████████| 6.23M/6.23M [00:13<00:00, 497kB/s]
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5001
```

✅ **Backend is ready!** The server is running on `http://localhost:5001`

### Starting the Frontend Server

1. Open a **new terminal** (keep the backend running)
2. Navigate to the frontend folder:
```powershell
cd frontend
```

3. Start the React development server:
```powershell
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view industrial-tracking-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

✅ **Frontend is ready!** A browser window will open automatically at `http://localhost:3000`

---

## 🎯 Using the Application

### What You'll See

1. **Header Section**
   - Title: "Industrial Object Tracking Dashboard"
   - Status Indicator: Shows "System Online" (green) when connected

2. **Live Feed Panel** (Left Side)
   - Real-time video from your webcam
   - Colored bounding boxes around detected objects:
     - **Blue boxes**: People
     - **Green boxes**: Vehicles
     - **Yellow boxes**: Machinery
   - Object labels and confidence scores (e.g., "person 0.95")

3. **Statistics Panel** (Right Side)
   - **Bar Chart**: Visual representation of detection counts
   - **Count Cards**: Three cards showing:
     - Personnel count
     - Vehicles count
     - Machinery count
   - Updates in real-time (every second)

### Troubleshooting

**Problem: "Video Feed Unavailable"**
- ✅ Check if backend server is running
- ✅ Allow camera permissions in your browser
- ✅ Close other apps using the webcam (Zoom, Skype, etc.)

**Problem: "Connecting to Server..."**
- ✅ Verify backend is running on port 5001
- ✅ Check for firewall blocking the connection
- ✅ Try refreshing the page

**Problem: Backend won't start (PyTorch errors)**
- ✅ This is usually due to PyTorch 2.6+ security features
- ✅ The code includes a fix (monkey-patching torch.load)
- ✅ If issues persist, downgrade PyTorch: `pip install torch==2.0.0`

**Problem: Objects not detected**
- ✅ Ensure good lighting in the room
- ✅ Move closer to the camera
- ✅ The model works best with objects it was trained on (COCO dataset)

---

## 🔧 Configuration & Customization

### Changing the Video Source

**Edit `backend/app.py`:**
```python
# Line 22: Change the video source
cap = cv2.VideoCapture(0)  # 0 = default webcam

# Options:
# cv2.VideoCapture(0)  # First webcam
# cv2.VideoCapture(1)  # Second webcam
# cv2.VideoCapture('path/to/video.mp4')  # Video file
# cv2.VideoCapture('rtsp://camera-ip')  # IP camera
```

### Changing Detection Categories

**Edit `backend/detector.py`:**
```python
# Lines 19-23: Modify the class lists
self.person_classes = [0]
self.vehicle_classes = [2, 3, 7, 8]
self.machinery_classes = [5, 6, 9, 63, 64, 65, 66, 67, 73, 84]
```

**COCO Dataset Classes (80 total):**
Reference: https://github.com/amikelive/coco-labels/blob/master/coco-labels-2014_2017.txt

### Changing the Model

**For better accuracy (but slower):**
```python
# In detector.py, line 17:
self.model = YOLO('yolov8s.pt')  # Small (11 MB)
self.model = YOLO('yolov8m.pt')  # Medium (26 MB)
self.model = YOLO('yolov8l.pt')  # Large (44 MB)
self.model = YOLO('yolov8x.pt')  # Extra Large (68 MB)
```

### Adjusting Confidence Threshold

**Edit `backend/detector.py`:**
```python
# Line 31: Add confidence parameter
results = self.model(frame, verbose=False, conf=0.5)  # 0.5 = 50% confidence
```

---

## 📊 API Endpoints

The backend server provides these REST API endpoints:

### `GET /`
- **Description**: Serves the web interface
- **Response**: HTML page

### `GET /health`
- **Description**: Health check endpoint
- **Response**: 
```json
{
  "status": "healthy",
  "service": "Industrial Object Tracking API"
}
```

### `GET /video_feed`
- **Description**: Streams live video with object detection
- **Response**: Multipart JPEG stream
- **Content-Type**: `multipart/x-mixed-replace; boundary=frame`

### `GET /stats`
- **Description**: Returns current detection statistics
- **Response**:
```json
{
  "person": 2,
  "vehicle": 1,
  "machinery": 3
}
```
- **Updates**: Real-time (based on latest frame)

---

## 🐛 Common Issues & Solutions

### Issue: `ModuleNotFoundError: No module named 'cv2'`
**Solution:**
```powershell
pip install opencv-python
```

### Issue: `_pickle.UnpicklingError: Weights only load failed`
**Solution:** The code includes a fix. If it persists:
```powershell
pip install torch==2.0.0 torchvision==0.15.0
```

### Issue: `CORS Error` in browser console
**Solution:** Ensure Flask-CORS is installed:
```powershell
pip install flask-cors
```

### Issue: High CPU usage
**Solution:** Use a smaller model or reduce frame rate:
```python
# In app.py, add a delay in the loop
import time
time.sleep(0.033)  # ~30 FPS
```

---

## 🔒 Security Considerations

### PyTorch Model Loading
The code uses `weights_only=False` when loading the YOLOv8 model. This is necessary due to PyTorch 2.6+ security changes but could potentially execute arbitrary code.

**Mitigation:**
- Only use models from trusted sources (official Ultralytics repository)
- Never load `.pt` files from unknown sources
- Consider using model verification/checksums in production

### Camera Access
The application requires webcam access. Users will see a browser permission prompt.

**Best Practices:**
- Always inform users about camera usage
- Use HTTPS in production environments
- Implement proper access controls

---

## 📈 Performance Optimization

### For Better Speed:
1. **Use GPU**: Install CUDA-enabled PyTorch
   ```powershell
   pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
   ```

2. **Reduce Resolution**:
   ```python
   frame = cv2.resize(frame, (640, 480))
   ```

3. **Skip Frames**:
   ```python
   frame_skip = 2  # Process every 2nd frame
   ```

### For Better Accuracy:
1. **Use Larger Model**: Switch to yolov8s.pt or yolov8m.pt
2. **Increase Confidence**: Set `conf=0.7` for fewer false positives
3. **Fine-tune**: Train on custom dataset with industrial-specific objects

---

## 📚 Additional Resources

### Learning Resources
- **YOLOv8 Documentation**: https://docs.ultralytics.com/
- **Flask Documentation**: https://flask.palletsprojects.com/
- **React Documentation**: https://react.dev/
- **OpenCV Tutorials**: https://docs.opencv.org/4.x/d9/df8/tutorial_root.html

### Related Projects
- **Ultralytics YOLOv8**: https://github.com/ultralytics/ultralytics
- **Flask-CORS**: https://flask-cors.readthedocs.io/
- **Chart.js**: https://www.chartjs.org/

---

## 🤝 Contributing

To improve this project:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is intended for educational purposes. Please ensure compliance with the licenses of all included libraries:
- **YOLOv8**: AGPL-3.0 (Ultralytics)
- **PyTorch**: BSD-style license
- **React**: MIT License
- **Flask**: BSD License

---

## 👨‍💻 Support

If you encounter issues:
1. Check the **Troubleshooting** section above
2. Review error messages in the terminal
3. Ensure all dependencies are correctly installed
4. Check that ports 3000 and 5001 are not in use by other applications

---

## 🎓 Project Context

This project was created as part of a final year project to demonstrate:
- Real-time computer vision applications
- Full-stack web development (Python backend + React frontend)
- Integration of AI/ML models into practical applications
- Industrial safety and monitoring systems

**Use Cases:**
- Manufacturing facility monitoring
- Warehouse safety compliance
- Construction site supervision
- Smart office management
- Retail analytics

---

**Last Updated**: November 26, 2025
**Version**: 1.0.0
