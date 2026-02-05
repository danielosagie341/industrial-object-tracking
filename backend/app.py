from flask import Flask, jsonify, Response, render_template, request
from flask_cors import CORS
import cv2
import numpy as np
import base64
from detector import ObjectDetector

app = Flask(__name__)
CORS(app)

# Initialize detector
detector = ObjectDetector()

@app.route('/')
def index():
    return jsonify({"status": "running", "service": "Industrial Object Tracking API"})

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "service": "Industrial Object Tracking API"})

@app.route('/process_frame', methods=['POST'])
def process_frame():
    try:
        if 'frame' not in request.files:
            return jsonify({'error': 'No frame provided'}), 400
            
        file = request.files['frame']
        
        # Convert string data to numpy array
        npimg = np.frombuffer(file.read(), np.uint8)
        # Convert numpy array to image
        frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Failed to decode image'}), 400

        # Process frame with YOLO
        processed_frame, stats = detector.process_frame(frame)
        
        # Encode result to jpg
        ret, buffer = cv2.imencode('.jpg', processed_frame)
        frame_bytes = buffer.tobytes()
        
        # Convert to base64 for JSON response
        img_base64 = base64.b64encode(frame_bytes).decode('utf-8')
        
        return jsonify({
            'image': img_base64,
            'stats': stats
        })
        
    except Exception as e:
        print(f"Error processing frame: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/stats')
def stats():
    # Return the last known stats (from the last processed frame)
    return jsonify(detector.get_current_stats())

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
