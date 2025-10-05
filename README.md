## 🚗 Smart Parking System using AWS

![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![IoT](https://img.shields.io/badge/IoT-00B5E2?style=for-the-badge&logo=azure-iot&logoColor=white)
![Lambda](https://img.shields.io/badge/AWS%20Lambda-FF9900?style=for-the-badge&logo=aws-lambda&logoColor=white)
![ESP8266](https://img.shields.io/badge/ESP8266-000000?style=for-the-badge&logo=esphome&logoColor=white)
![HTML](https://img.shields.io/badge/Web%20Interface-005FED?style=for-the-badge&logo=html5&logoColor=white)

---

### 🧠 Overview

This project implements a **Smart Parking System** using **AWS IoT Core** and **AWS Lambda** to manage parking availability efficiently.  
An **ultrasonic sensor** detects the presence of a car and sends the data to an **ESP8266** microcontroller.  
The ESP8266 communicates with **AWS IoT Core**, which triggers **AWS Lambda functions** to process the input and update the system.  
Parking availability data is then displayed on a **web-based dashboard**, allowing users to monitor real-time parking status seamlessly.

---

### 🏗️ System Architecture

```mermaid
graph TD
A[🚗 Car Detected by Ultrasonic Sensor] --> B[📡 ESP8266 Microcontroller]
B --> C[☁️ AWS IoT Core]
C --> D[⚙️ AWS Lambda Function]
D --> E[🖥️ Web Dashboard Display]
