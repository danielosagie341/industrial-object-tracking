from flask import Flask, jsonify, Response, render_template
from flask_cors import CORS
import cv2
import threading
from detector import ObjectDetector

app = Flask(__name__)
CORS(app)

# Initialize detector
detector = ObjectDetector()

# Global variable to store latest frame
output_frame = None
lock = threading.Lock()

def generate_frames():
    global output_frame, lock
    
    # Open webcam (0) or video file
    # For now we'll default to webcam, later we can add video file support
    cap = cv2.VideoCapture(0) 
    
    while True:
        success, frame = cap.read()
        if not success:
            break
            
        # Process frame with YOLO
        processed_frame, stats = detector.process_frame(frame)
        
        with lock:
            output_frame = processed_frame.copy()
            
        # Encode for streaming
        ret, buffer = cv2.imencode('.jpg', processed_frame)
        frame_bytes = buffer.tobytes()
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "service": "Industrial Object Tracking API"})

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/stats')
def get_stats():
    # Return current detection statistics
    return jsonify(detector.get_current_stats())

if __name__ == '__main__':
    app.run(debug=True, port=5001)
