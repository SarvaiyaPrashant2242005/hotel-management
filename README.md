# Hotel Management System

A modern, full-stack hotel booking and management platform with flexible payment options, automated refunds, and a comprehensive admin panel.

## 🚀 Features

### For Customers
- **Browse Hotels**: Search and filter hotels by location, price, and amenities
- **Flexible Booking**: Book rooms with flexible payment options
- **Payment Options**:
  - **Pay Now**: Full payment with instant confirmation
  - **Pay at Hotel**: 10% advance payment, rest at check-in
- **Easy Cancellation**: Cancel bookings with automatic refund processing
- **Booking Management**: Track all bookings with real-time status updates

### For Administrators
- **Modern Dashboard**: Key metrics, revenue trends, and analytics at a glance
- **Hotel Management**: Add, edit, and manage multiple properties
- **Room Inventory**: Complete room management with images and amenities
- **Booking Tracking**: Monitor all reservations with advanced filters
- **Payment Monitoring**: Track transactions and refunds
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Recharts** for data visualization
- **Razorpay** for payment processing

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Razorpay API** for payments and refunds

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Razorpay account (for payments)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hotel-management
```

### 2. Setup Backend
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials:
# - MongoDB URI
# - JWT secret
# - Razorpay keys
```

### 3. Setup Frontend
```bash
cd client
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API URL
```

### 4. Run the Application
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

### 5. Access the Application
- **Customer Portal**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **Backend API**: https://hotel-management-plc3.onrender.com

## 📚 Documentation

- [Client Documentation](./client/README.md) - Frontend setup and features
- [Server Documentation](./server/README.md) - Backend API and endpoints

## 🔑 Key Features Explained

### Payment System
- **Razorpay Integration**: Secure payment gateway
- **Flexible Options**: Choose between full payment or advance payment
- **Payment Tracking**: Real-time payment status updates
- **Pending Bookings**: Complete payment later if dismissed

### Cancellation & Refunds
- **Easy Cancellation**: Cancel bookings with one click
- **Automatic Refunds**: Refunds initiated automatically via Razorpay
- **Refund Calculation**:
  - Full payment: 100% refund
  - Advance payment: 10% refund
  - No payment: No charges
- **Refund Timeline**: 5-7 business days

### Admin Panel
- **Dashboard Analytics**: Revenue trends, booking statistics
- **Hotel Management**: CRUD operations for hotels
- **Room Management**: Manage room inventory with images
- **Booking Filters**: Filter by hotel, status, payment, date range
- **Payment Tracking**: Monitor all transactions

## 🔐 Security

- JWT-based authentication
- Role-based access control (User/Admin)
- Secure payment processing via Razorpay
- Password hashing with bcrypt
- Protected API routes

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (640px - 1024px)
- Mobile (< 640px)

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 🚀 Deployment

### Backend Deployment
- Deploy to Heroku, Railway, Render, or any Node.js hosting
- Set environment variables
- Ensure MongoDB is accessible

### Frontend Deployment
- Deploy to Vercel, Netlify, or any static hosting
- Update API URL in environment variables
- Build: `npm run build`

## 📊 Project Structure

```
hotel-management/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and helpers
│   │   └── hooks/         # Custom React hooks
│   └── README.md          # Client documentation
├── server/                # Backend Node.js application
│   ├── controller/        # Route controllers
│   ├── model/            # MongoDB models
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   └── README.md         # Server documentation
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues or questions:
- Check the documentation in `/client/README.md` and `/server/README.md`
- Review error messages and logs
- Contact the development team

## ✨ Acknowledgments

- Built with React and Node.js
- UI components from shadcn/ui
- Payment processing by Razorpay
- Icons from Lucide React

---

**Version**: 2.0  
**Status**: Production Ready ✅  
**Last Updated**: November 2024
