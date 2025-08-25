# Raspberry Pi AgroRakshak Disease Detection Module

## 🌱 Overview

The **Raspberry Pi Disease Detection Module** is the AI-powered component of the **AgroRakshak Smart Plant Monitoring System**. It uses computer vision and machine learning to automatically detect plant diseases, analyze plant health, and provide treatment recommendations through the AgroRakshak web dashboard.

**Project**: AgroRakshak Capstone Project 2025  
**Authors**: Abhirav Yadav, Aishwarya Godse, Josna Jojen, Ananyachetam Avasthi  
**Institution**: Electronics & Communication Engineering  

## 🚀 Features

- ✅ **AI-Powered Disease Detection**: Computer vision-based plant disease identification
- ✅ **Real-time Image Capture**: Automatic plant photography using Pi Camera
- ✅ **Cloud Integration**: Direct upload to Firebase for dashboard display
- ✅ **Treatment Recommendations**: Actionable advice for detected diseases
- ✅ **Base64 Image Storage**: No external storage service required
- ✅ **24/7 Monitoring**: Continuous automated plant health surveillance

## 🛠 Hardware Requirements

### **Raspberry Pi Setup**
| Component | Specification | Purpose |
|-----------|---------------|---------|
| **Raspberry Pi** | Pi 4 (4GB RAM recommended) | Main processing unit |
| **microSD Card** | 32GB Class 10 or better | Operating system storage |
| **Pi Camera Module** | V2.1 (8MP) or Pi HQ Camera | Plant image capture |
| **Power Supply** | 5V/3A USB-C (Pi 4) | Reliable power source |
| **Case** | Weather-resistant (optional) | Outdoor protection |

### **Camera Mounting Setup**
Recommended Camera Positioning:
┌─────────────────────────────────┐
│ Raspberry Pi │
│ ┌─────────┐ ┌──────────┐ │
│ │ Pi │────│ Camera │ │ ← 30-50cm above plants
│ │ Board │ │ Module │ │
│ └─────────┘ └──────────┘ │
│ │
└─────────────────────────────────┘
│
│ 30-50cm distance
▼
🌱 🌿 Plant Canopy 🌿 🌱


### **Network Connection**
- **WiFi**: Built-in WiFi on Pi 4/3B+
- **Ethernet**: Wired connection for stable internet
- **Internet**: Required for Firebase cloud uploads

## 💻 Software Setup

### **Step 1: Raspberry Pi OS Installation**

1. **Download Raspberry Pi Imager**: 
   - Visit [rpi.org/software](https://www.rpi.org/software/)
   - Install on your computer

2. **Flash OS to SD Card**:
   - Insert microSD card into computer
   - Open Pi Imager
   - Choose **Raspberry Pi OS (64-bit)** with desktop
   - Select your SD card
   - **Configure** → Enable SSH, WiFi, username/password
   - Flash the image

3. **Boot Raspberry Pi**:
   - Insert SD card into Pi
   - Connect camera module
   - Power on Pi
   - Complete setup wizard

### **Step 2: Enable Camera Interface**
Open configuration
sudo raspi-config

Navigate: 3 Interface Options → I1 Camera → Enable → Finish → Reboot
sudo reboot


### **Step 3: System Updates**
Update package lists
sudo apt update

Upgrade all packages
sudo apt upgrade -y

Install system dependencies
sudo apt install -y python3-pip python3-venv git cmake libatlas-base-dev


### **Step 4: Python Environment Setup**
Create project directory
mkdir ~/agrorakshak
cd ~/agrorakshak

Create virtual environment
python3 -m venv agrorakshak_env

Activate environment
source agrorakshak_env/bin/activate

Install Python dependencies
pip install --upgrade pip


### **Step 5: Install Required Libraries**
Core dependencies
pip install firebase-admin
pip install opencv-python
pip install numpy
pip install pillow

Additional libraries for ML (if using custom models)
pip install tensorflow-lite-runtime
pip install scikit-learn
pip install matplotlib


**Expected Installation Output**:
Successfully installed firebase-admin-6.2.0
Successfully installed opencv-python-4.8.1.78
Successfully installed numpy-1.24.3
...


## 🔧 Configuration

### **1. Camera Testing**
Test camera functionality:
Test camera capture
raspistill -o test_image.jpg -t 2000

Verify image was created
ls -la test_image.jpg


### **2. Firebase Service Account Setup**

#### **Option A: Simple Configuration (Recommended)**
The code uses your existing Firebase web API for simplicity. No additional setup required.

#### **Option B: Service Account (Advanced)**
For production deployment:

1. **Generate Service Account**:
   - Go to [Firebase Console](https://console.firebase.google.com/project/agrorakshak-97ae7)
   - Settings → Project Settings → Service Accounts
   - Generate new private key
   - Download JSON file

2. **Install Service Account**:
Copy service account file to Pi
scp path/to/serviceAccountKey.json pi@raspberry-pi-ip:~/agrorakshak/

Update code to use service account
(Modify initialize_firebase() function)


### **3. Code Configuration**
Edit the Python script configuration:

Device configuration
self.device_id = "raspberry_pi_001" # Change for multiple devices
self.location = "greenhouse_1" # Your greenhouse location

Detection interval
detection_interval = 600 # 10 minutes (adjust as needed)


## 🚀 Installation and Running

### **Step 1: Download the Script**
cd ~/agrorakshak

Create the Python script file
nano agrorakshak_raspi.py

Copy and paste the complete Python code from the previous message
Save with Ctrl+X, then Y, then Enter


### **Step 2: Make Script Executable**
chmod +x agrorakshak_raspi.py


### **Step 3: Test Installation**

Activate virtual environment
source ~/agrorakshak/agrorakshak_env/bin/activate

Test run (Ctrl+C to stop)
python3 agrorakshak_raspi.py


**Expected Output**:
2025-08-26 04:30:00,123 - 🌱 AgroRakshak Raspberry Pi initialized
2025-08-26 04:30:00,124 - 🚀 Connected to your web dashboard database!
2025-08-26 04:30:00,125 - ✅ Camera initialized successfully
2025-08-26 04:30:01,150 - 🚀 AgroRakshak Raspberry Pi started!
2025-08-26 04:30:01,151 - 🌱 Disease detection system active
2025-08-26 04:30:01,152 - 📊 Data will appear in your web dashboard
2025-08-26 04:30:01,153 - 📸 Starting disease detection cycle...
2025-08-26 04:30:02,200 - ✅ Disease detection uploaded: bacterial_blight (0.85)
2025-08-26 04:30:02,201 - 🚀 Check your web dashboard - disease alert should appear!
2025-08-26 04:30:02,202 - ✅ Next detection in 10 minutes...


### **Step 4: Auto-Start on Boot (Optional)**
Create a systemd service for automatic startup:

Create service file
sudo nano /etc/systemd/system/agrorakshak.service


Add this content:
[Unit]
Description=AgroRakshak Disease Detection
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/agrorakshak
ExecStart=/home/pi/agrorakshak/agrorakshak_env/bin/python3 /home/pi/agrorakshak/agrorakshak_raspi.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target


Enable and start service:

Reload systemd
sudo systemctl daemon-reload

Enable service
sudo systemctl enable agrorakshak.service

Start service
sudo systemctl start agrorakshak.service

Check status
sudo systemctl status agrorakshak.service


## 🔍 Disease Detection Configuration

### **Current Detection Capabilities**
The system includes detection for:

| Disease | Severity Levels | Treatment Available |
|---------|----------------|-------------------|
| **Healthy** | None | No treatment needed |
| **Bacterial Blight** | Mild, Moderate, Severe | ✅ Copper bactericide, ventilation |
| **Early Blight** | Mild, Moderate, Severe | ✅ Fungicide, spacing, rotation |
| **Leaf Spot** | Mild, Moderate, Severe | ✅ Neem oil, air circulation |

### **Adding Custom ML Models**
To integrate your own trained model:

1. **Replace Detection Function**:

def detect_disease(self, image):
# Replace with your model inference
import tensorflow as tf

# Load your trained model
model = tf.lite.Interpreter(model_path="your_model.tflite")
model.allocate_tensors()

# Preprocess image
processed_image = self.preprocess_image(image)

# Run inference
model.set_tensor(input_details['index'], processed_image)
model.invoke()

# Get results
predictions = model.get_tensor(output_details['index'])

return {
    'name': predicted_class,
    'confidence': confidence_score,
    'severity': severity_level,
    'treatments': treatment_list
}


2. **Model File Placement**:

Place model files in project directory
~/agrorakshak/
├── models/
│ ├── plant_disease_model.tflite
│ ├── class_names.txt
│ └── treatment_database.json
├── agrorakshak_raspi.py
└── agrorakshak_env/


## 📊 Dashboard Integration

### **Data Structure Sent to Firebase**

{
"device_id": "raspberry_pi_001",
"location": "greenhouse_1",
"timestamp": "2025-08-26T04:30:00Z",
"disease_name": "bacterial_blight",
"confidence": 0.85,
"severity": "moderate",
"treatment_suggestions": [
"Apply copper-based bactericide",
"Improve ventilation around plants",
"Remove affected leaves immediately",
"Water at soil level, avoid wetting leaves"
],
"image_data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
}


### **Verifying Dashboard Connection**
1. **Check Web Dashboard**: Navigate to "Disease Detection" section
2. **Firebase Console**: Visit your Firebase project database
3. **Python Logs**: Monitor terminal output for success messages

## 🔧 Troubleshooting

### **Camera Issues**

#### **1. Camera Not Detected**

Check camera connection
vcgencmd get_camera

Expected output: supported=1 detected=1


**Solutions**:
- Ensure camera cable is properly seated
- Camera ribbon cable blue side faces USB ports
- Enable camera in `raspi-config`

#### **2. OpenCV Camera Access Error**

Test camera with OpenCV
python3 -c "import cv2; cap = cv2.VideoCapture(0); print('Camera:', cap.isOpened())"


**Solutions**:
- Try different camera indices: `cv2.VideoCapture(1)` or `cv2.VideoCapture(2)`
- Increase camera warm-up time in code

### **Network/Firebase Issues**

#### **1. Firebase Connection Failed**

Test internet connectivity
ping google.com

Check Firebase URL
curl -X GET "https://agrorakshak-97ae7-default-rtdb.asia-southeast1.firebasedatabase.app/.json"


#### **2. Permission Denied Errors**
- Verify Firebase database rules allow writes
- Check API key permissions in Firebase Console

### **Python Environment Issues**

#### **1. Module Import Errors**

Verify virtual environment activation
which python3

Should show: /home/pi/agrorakshak/agrorakshak_env/bin/python3
Reinstall problematic packages
pip install --force-reinstall opencv-python


#### **2. Memory Issues**
For Pi 3B+ or limited memory:

Increase swap space
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile

Change CONF_SWAPSIZE=100 to CONF_SWAPSIZE=1024
sudo dphys-swapfile setup
sudo dphys-swapfile swapon


### **Performance Optimization**

#### **1. Reduce Image Size**

In capture_image() function:
frame_resized = cv2.resize(frame, (320, 240)) # Smaller size


#### **2. Adjust Detection Frequency**
Change detection interval
detection_interval = 1800 # 30 minutes instead of 10


## 📊 Monitoring and Logs

### **Real-time Monitoring**
View live logs
tail -f /var/log/syslog | grep agrorakshak

Or if running manually:
python3 agrorakshak_raspi.py


### **System Resource Monitoring**
Check CPU/Memory usage
htop

Check disk space
df -h

Check temperature
vcgencmd measure_temp


### **Log File Analysis**
Create log directory
mkdir ~/agrorakshak/logs

Modify Python script to log to file:
logging.basicConfig(
level=logging.INFO,
format='%(asctime)s - %(message)s',
handlers=[
logging.FileHandler('/home/pi/agrorakshak/logs/disease_detection.log'),
logging.StreamHandler()
]
)


## 🔄 Advanced Configuration

### **Multiple Camera Setup**
For monitoring multiple plant areas:

Configure multiple cameras
cameras = [
{'id': 0, 'location': 'greenhouse_1_north'},
{'id': 1, 'location': 'greenhouse_1_south'}
]

for camera_config in cameras:
detector = AgroRakshakRaspberryPi()
detector.camera = cv2.VideoCapture(camera_config['id'])
detector.location = camera_config['location']
detector.run_disease_detection_cycle()


### **Scheduled Detection Times**
import schedule
import time

Run detection at specific times
schedule.every().day.at("06:00").do(run_detection)
schedule.every().day.at("12:00").do(run_detection)
schedule.every().day.at("18:00").do(run_detection)

while True:
schedule.run_pending()
time.sleep(60)


## 📞 Support and Maintenance

### **Regular Maintenance**

Weekly maintenance script
#!/bin/bash

Update system
sudo apt update && sudo apt upgrade -y

Clean temporary files
sudo apt autoremove -y
sudo apt autoclean

Restart AgroRakshak service
sudo systemctl restart agrorakshak.service


### **Backup Configuration**

Backup important files
tar -czf agrorakshak_backup.tar.gz ~/agrorakshak/


### **Getting Help**

**Project Team**:
- **Abhirav Yadav** - Project Lead & AI Integration
- **Aishwarya Godse** - Hardware Setup & Testing
- **Josna Jojen** - Software Development & Debugging  
- **Ananyachetam Avasthi** - System Integration & Documentation

**Common Support Resources**:
- Check dashboard for disease detection updates
- Review Python script logs for error messages
- Test camera functionality independently
- Verify Firebase database connectivity

### **Performance Benchmarks**
Expected performance metrics:
- **Image Capture**: < 2 seconds
- **Disease Detection**: < 5 seconds  
- **Firebase Upload**: < 3 seconds
- **Total Cycle Time**: < 10 seconds
- **Memory Usage**: < 500MB RAM

---

**AgroRakshak Raspberry Pi Module** - Bringing AI-powered plant health monitoring to modern agriculture! 🌱🤖🚀
