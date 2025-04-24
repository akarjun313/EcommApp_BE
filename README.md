# ⚙️ WristWatch - E-Commerce Backend  

**API Base URL:** [Render Deployment](https://ecommapp-be.onrender.com)

## 📌 Overview  
A Node.js backend for the WristWatch app, featuring:  
- **JWT authentication** (User/Seller/Admin roles)  
- **REST API** for products, orders, and payments  
- **Image uploads** via Cloudinary  

## 🛠 Tech Stack  
- **Runtime:** Node.js + Express  
- **Database:** MongoDB Atlas (Mongoose)  
- **Auth:** JWT, bcrypt  
- **Payments:** Razorpay  
- **Storage:** Cloudinary + Multer  

## 🔗 Frontend Connection  
This backend powers the [WristWatch Frontend](https://github.com/akarjun313/EcommApp_FE.git).

## 🔍 Exploring API Endpoints
All API routes are structured in the `/routes` folder.
To see available endpoints:  
1. Clone the repo  
2. Check the `routes/` directory  
3. Refer to controller logic in `controllers/` 

## 🚀 Setup & Run  
1. Clone the repo:  
   ```sh
   git clone https://github.com/yourusername/wristwatch-backend.git
   
2. Install dependencies & run:
   ```sh
    npm install
    npm run dev

3. Server runs at: http://localhost:4000

## ⚙️ Environment Variables
  Create a .env file:
  ```sh
  PORT=4000
  DB_URL="mongodb+srv://your_mongodb_connection_string"
  SE="your_jwt_secret"
  CLOUDINARY_CLOUD_NAME="your_cloud_name"
  CLOUDINARY_API_KEY="your_api_key"
  CLOUDINARY_API_SECRET="your_api_secret"
  RAZORPAY_KEY_ID="your_razorpay_key"
  RAZORPAY_SECRET="your_razorpay_secret"
  ```

