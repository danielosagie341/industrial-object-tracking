from ultralytics import YOLO
import cv2
import numpy as np
import os
import torch

# Monkey-patch torch.load to disable weights_only security feature
# This is needed for PyTorch 2.6+ to load YOLOv8 models
_original_torch_load = torch.load
def patched_torch_load(*args, **kwargs):
    kwargs['weights_only'] = False
    return _original_torch_load(*args, **kwargs)
torch.load = patched_torch_load

class ObjectDetector:
    def __init__(self):
        # Load a pretrained YOLOv8n model (nano version for speed)
        self.model = YOLO('yolov8n.pt')
        self.current_stats = {
            "person": 0,
            "vehicle": 0,
            "machinery": 0
        }
        
        # Define classes we care about (COCO dataset indices)
        # 0: person
        # Vehicles: 2: car, 3: motorcycle, 7: truck, 8: boat
        # Machinery/Equipment: 5: bus, 6: train, 9: traffic light, 
        #                      63: laptop, 64: mouse, 65: remote, 66: keyboard, 67: cell phone
        self.person_classes = [0]
        self.vehicle_classes = [2, 3, 8]  # car, motorcycle, boat
        self.machinery_classes = [5, 6, 7, 9, 63, 64, 65, 66, 67, 73, 84]  # bus, train, truck, traffic light, laptop, mouse, remote, keyboard, cell phone, book, clock

    def process_frame(self, frame):
        # Run inference
        results = self.model(frame, verbose=False)
        
        # Reset stats for this frame
        self.current_stats = {"person": 0, "vehicle": 0, "machinery": 0}
        
        # Annotate frame
        annotated_frame = results[0].plot()
        
        # Update stats based on detections
        for box in results[0].boxes:
            cls_id = int(box.cls[0])
            if cls_id in self.person_classes:
                self.current_stats["person"] += 1
            elif cls_id in self.vehicle_classes:
                self.current_stats["vehicle"] += 1
            elif cls_id in self.machinery_classes:
                self.current_stats["machinery"] += 1
                
        return annotated_frame, self.current_stats

    def get_current_stats(self):
        return self.current_stats
