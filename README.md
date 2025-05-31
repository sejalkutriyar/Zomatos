# Zomato Ops - Order Management System

A streamlined order management system for restaurant operations, built with React and Node.js.

## Project Structure

```
Zomato/
├── frontend.js    # React frontend application
├── backend.js     # Node.js backend server
└── README.md      # Project documentation
```

## Features

- User Authentication (Manager & Delivery Partners)
- Real-time Order Management
- Order Status Updates
- Delivery Partner Assignment
- Responsive Dashboard

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Install dependencies:
```bash
npm install express cors body-parser mongoose dotenv
```

2. Create a `.env` file with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/zomato_ops
```

3. Start the backend:
```bash
node backend.js
```

### Frontend Setup

1. Install dependencies:
```bash
npm install react react-dom axios
```

2. Create an `index.html` file with:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Zomato Ops</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="frontend.js"></script>
  </body>
</html>
```

3. Start the frontend:
```bash
npx vite
```

## Login Credentials

- Manager:
  - Username: manager
  - Password: manager123

- Delivery Partners:
  - Username: rider1, rider2, rider3
  - Password: rider123

## API Endpoints

- POST `/api/login` - User authentication
- GET `/api/orders` - List all orders
- POST `/api/orders` - Create new order
- PUT `/api/orders/:orderId/assign` - Assign order to partner
- PUT `/api/orders/:orderId/status` - Update order status
- GET `/api/partner/:partnerId/order` - Get partner's current order
