import firebase_admin
from firebase_admin import credentials, db
import cv2
import numpy as np
import base64
from datetime import datetime, timezone
import time
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class AgroRakshakRaspberryPi:
    def __init__(self):
        # Device configuration - MUST MATCH YOUR DASHBOARD
        self.device_id = "raspberry_pi_001"
        self.location = "greenhouse_1"
        
        # Initialize Firebase with YOUR project
        self.initialize_firebase()
        
        # Initialize camera
        try:
            self.camera = cv2.VideoCapture(0)
            logger.info("✅ Camera initialized successfully")
        except Exception as e:
            logger.error(f"❌ Camera initialization failed: {e}")
            self.camera = None
        
        logger.info("🌱 AgroRakshak Raspberry Pi initialized")
        logger.info("🚀 Connected to your web dashboard database!")
    
    def initialize_firebase(self):
        """Initialize Firebase with your exact project configuration"""
        try:
            # Initialize with your project's service account
            # For now, using web API key method (simpler setup)
            firebase_admin.initialize_app(options={
                'databaseURL': 'https://agrorakshak-97ae7-default-rtdb.asia-southeast1.firebasedatabase.app/'
            })
            logger.info("✅ Firebase connected to agrorakshak-97ae7")
        except ValueError:
            # Already initialized
            pass
        except Exception as e:
            logger.error(f"❌ Firebase initialization failed: {e}")
    
    def capture_image(self):
        """Capture image from camera"""
        if not self.camera:
            logger.warning("Camera not available, using mock image")
            return self.create_mock_image()
        
        try:
            ret, frame = self.camera.read()
            if ret:
                # Resize to optimize for dashboard display
                frame_resized = cv2.resize(frame, (640, 480))
                return frame_resized
            else:
                logger.warning("Failed to capture image, using mock")
                return self.create_mock_image()
        except Exception as e:
            logger.error(f"Image capture error: {e}")
            return self.create_mock_image()
    
    def create_mock_image(self):
        """Create a mock plant image for testing"""
        # Create a green plant-like image
        mock_image = np.zeros((480, 640, 3), dtype=np.uint8)
        mock_image[:, :] = [50, 150, 50]  # Green background
        
        # Add some plant-like features
        cv2.circle(mock_image, (320, 240), 100, (30, 200, 30), -1)
        cv2.circle(mock_image, (250, 180), 60, (20, 180, 20), -1)
        cv2.circle(mock_image, (390, 200), 50, (40, 220, 40), -1)
        
        return mock_image
    
    def image_to_base64(self, image):
        """Convert image to base64 string for dashboard display"""
        try:
            # Encode image to JPEG
            _, buffer = cv2.imencode('.jpg', image, [cv2.IMWRITE_JPEG_QUALITY, 70])
            
            # Convert to base64
            image_base64 = base64.b64encode(buffer).decode('utf-8')
            return f"data:image/jpeg;base64,{image_base64}"
        except Exception as e:
            logger.error(f"Base64 encoding error: {e}")
            return None
    
    def detect_disease(self, image):
        """
        Mock disease detection - Replace with your actual ML model
        """
        # Simulate different diseases with probabilities
        diseases = [
            {'name': 'healthy', 'confidence': 0.85, 'severity': 'none', 'treatments': []},
            {'name': 'bacterial_blight', 'confidence': 0.75, 'severity': 'moderate', 'treatments': [
                'Apply copper-based bactericide',
                'Improve ventilation around plants', 
                'Remove affected leaves immediately',
                'Water at soil level, avoid wetting leaves'
            ]},
            {'name': 'early_blight', 'confidence': 0.68, 'severity': 'mild', 'treatments': [
                'Apply fungicide containing chlorothalonil',
                'Ensure proper plant spacing',
                'Remove lower leaves touching soil',
                'Practice crop rotation'
            ]},
            {'name': 'leaf_spot', 'confidence': 0.72, 'severity': 'moderate', 'treatments': [
                'Apply neem oil spray',
                'Improve air circulation',
                'Remove infected plant debris',
                'Avoid overhead watering'
            ]}
        ]
        
        # Simulate ML prediction
        import random
        detected = random.choice(diseases)
        
        # Add some randomness to confidence
        detected['confidence'] += random.uniform(-0.1, 0.1)
        detected['confidence'] = max(0.5, min(0.95, detected['confidence']))
        
        return detected
    
    def upload_disease_detection(self, detection_result, image_base64):
        """Upload disease detection to your dashboard's database"""
        try:
            # Get reference to your exact database path
            ref = db.reference(f'disease_detection/{self.device_id}')
            
            # Create timestamp in ISO format (dashboard compatible)
            timestamp = datetime.now(timezone.utc).isoformat()
            
            # Structure data exactly as your dashboard expects
            data = {
                timestamp: {
                    'device_id': self.device_id,
                    'location': self.location,
                    'timestamp': timestamp,
                    'disease_name': detection_result['name'],
                    'confidence': detection_result['confidence'],
                    'severity': detection_result['severity'],
                    'treatment_suggestions': detection_result['treatments'],
                    'image_data': image_base64
                }
            }
            
            # Upload to Firebase
            ref.update(data)
            logger.info(f"✅ Disease detection uploaded: {detection_result['name']} ({detection_result['confidence']:.2f})")
            logger.info("🚀 Check your web dashboard - disease alert should appear!")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to upload disease detection: {e}")
            return False
    
    def run_disease_detection_cycle(self):
        """Run complete disease detection cycle"""
        try:
            logger.info("📸 Starting disease detection cycle...")
            
            # Capture image
            image = self.capture_image()
            if image is None:
                logger.error("Failed to capture image")
                return False
            
            # Convert to base64 for dashboard
            image_base64 = self.image_to_base64(image)
            if image_base64 is None:
                logger.error("Failed to encode image")
                return False
            
            # Detect disease (replace with your actual ML model)
            detection_result = self.detect_disease(image)
            
            # Upload to your dashboard's database
            success = self.upload_disease_detection(detection_result, image_base64)
            
            if success:
                logger.info("🎯 Disease detection cycle completed successfully!")
                return True
            else:
                logger.error("❌ Disease detection cycle failed")
                return False
                
        except Exception as e:
            logger.error(f"❌ Disease detection cycle error: {e}")
            return False
    
    def cleanup(self):
        """Clean up resources"""
        if self.camera:
            self.camera.release()
        cv2.destroyAllWindows()

def main():
    # Initialize AgroRakshak Raspberry Pi
    agrorakshak = AgroRakshakRaspberryPi()
    
    try:
        logger.info("🚀 AgroRakshak Raspberry Pi started!")
        logger.info("🌱 Disease detection system active")
        logger.info("📊 Data will appear in your web dashboard")
        
        # Run disease detection every 10 minutes (600 seconds)
        detection_interval = 600
        
        while True:
            try:
                # Run disease detection
                success = agrorakshak.run_disease_detection_cycle()
                
                if success:
                    logger.info(f"✅ Next detection in {detection_interval//60} minutes...")
                else:
                    logger.warning("⚠️ Detection failed, retrying in 2 minutes...")
                    time.sleep(120)  # Wait 2 minutes on failure
                    continue
                
                # Wait for next cycle
                time.sleep(detection_interval)
                
            except KeyboardInterrupt:
                logger.info("🛑 Stopping AgroRakshak Raspberry Pi...")
                break
            except Exception as e:
                logger.error(f"❌ Main loop error: {e}")
                time.sleep(60)  # Wait 1 minute before retry
                
    finally:
        agrorakshak.cleanup()
        logger.info("🏁 AgroRakshak Raspberry Pi stopped")

if __name__ == "__main__":
    main()
