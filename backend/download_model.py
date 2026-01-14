import requests
import os

# URL used by ultralytics internally
url = "https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt"
filename = "yolov8n.pt"

if os.path.exists(filename):
    print(f"{filename} exists. Size: {os.path.getsize(filename)} bytes")
    if os.path.getsize(filename) < 1000: # If it's too small, it's probably broken
        print("File too small, redownloading...")
    else:
        print("File seems okay. Skipping download.")
        exit(0)

print(f"Downloading {filename} from {url}...")
try:
    # verify=False to bypass SSL issues
    response = requests.get(url, verify=False, stream=True) 
    response.raise_for_status()
    with open(filename, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192): 
            f.write(chunk)
    print("Download complete.")
except Exception as e:
    print(f"Failed to download: {e}")
    # Clean up partial file
    if os.path.exists(filename):
        os.remove(filename)
