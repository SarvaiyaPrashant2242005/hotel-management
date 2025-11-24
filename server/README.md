# Hotel Management - Backend

Node.js/Express backend API for hotel booking system with payment processing, refunds, and comprehensive booking management.

## 🚀 Features

- **User Authentication**: JWT-based auth with role management
- **Hotel Management**: CRUD operations for hotels
- **Room Management**: Complete room inventory control
- **Booking System**: Flexible booking with payment options
- **Payment Processing**: Razorpay integration for payments
- **Refund System**: Automatic refund processing
- **Admin Panel**: Comprehensive admin APIs

## 🛠️ Tech Stack

- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Razorpay** for payments
- **bcrypt** for password hashing
- **multer** for file uploads

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- Razorpay account

## 🚀 Installation

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Setup
Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel-management
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Run Server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs at: http://localhost:5000

## 📁 Project Structure

```
server/
├── config/
│   └── db.js              # Database connection
├── controller/
│   ├── authController.js  # Authentication logic
│   ├── hotelController.js # Hotel operations
│   ├── roomController.js  # Room operations
│   ├── bookingController.js # Booking & cancellation
│   └── paymentController.js # Payment & refunds
├── model/
│   ├── userModel.js       # User schema
│   ├── hotelModel.js      # Hotel schema
│   ├── roomModel.js       # Room schema
│   └── bookingModel.js    # Booking schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── hotelRoutes.js     # Hotel endpoints
│   ├── roomRoutes.js      # Room endpoints
│   ├── bookingRoutes.js   # Booking endpoints
│   └── paymentRoutes.js   # Payment endpoints
├── middlewares/
│   └── authMiddleware.js  # JWT verification
├── uploads/               # File uploads
├── index.js              # Entry point
├── package.json
└── .env
```

## 🔌 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Hotels

#### Get All Hotels
```http
GET /api/hotels
```

#### Get Hotel by ID
```http
GET /api/hotels/:id
```

#### Create Hotel (Admin)
```http
POST /api/hotels
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Grand Hotel",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "contactNumber": "1234567890",
  "description": "Luxury hotel",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Update Hotel (Admin)
```http
PUT /api/hotels/:id
Authorization: Bearer <token>
```

#### Delete Hotel (Admin)
```http
DELETE /api/hotels/:id
Authorization: Bearer <token>
```

### Rooms

#### Get All Rooms
```http
GET /api/rooms
```

#### Get Rooms by Hotel
```http
GET /api/rooms/hotel/:hotelId
```

#### Create Room (Admin)
```http
POST /api/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "hotelId": "hotel_id",
  "roomNumber": "101",
  "type": "Deluxe",
  "price": 5000,
  "capacity": 2,
  "status": "available",
  "amenities": ["WiFi", "AC", "TV"]
}
```

### Bookings

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "hotelId": "hotel_id",
  "roomId": "room_id",
  "checkIn": "2024-12-01",
  "checkOut": "2024-12-05",
  "totalPrice": 10000,
  "paymentOption": "pay-now",
  "advancePayment": 10000
}
```

**Payment Options:**
- `pay-now`: Full payment (100%)
- `pay-at-hotel`: Advance payment (10%)

#### Get User Bookings
```http
GET /api/bookings/me
Authorization: Bearer <token>
```

#### Cancel Booking
```http
PUT /api/bookings/:id/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Plans changed"
}
```

**Response:**
```json
{
  "message": "Booking cancelled successfully. Refund of ₹10,000 has been initiated...",
  "booking": { ... },
  "refund": {
    "amount": 10000,
    "status": "initiated",
    "estimatedDays": "5-7",
    "refundId": "rfnd_xxxxx"
  }
}
```

#### Get All Bookings (Admin)
```http
GET /api/bookings
Authorization: Bearer <token>
```

### Payments

#### Create Payment Order
```http
POST /api/payments/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "booking_id",
  "amount": 10000
}
```

**Response:**
```json
{
  "orderId": "order_xxxxx",
  "amount": 1000000,
  "currency": "INR",
  "key": "rzp_test_xxxxx"
}
```

#### Verify Payment
```http
POST /api/payments/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_order_id": "order_xxxxx",
  "razorpay_signature": "signature",
  "bookingId": "booking_id"
}
```

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  createdAt: Date
}
```

### Hotel Model
```javascript
{
  name: String,
  address: String,
  city: String,
  state: String,
  country: String,
  contactNumber: String,
  description: String,
  imageUrl: String,
  createdAt: Date
}
```

### Room Model
```javascript
{
  hotelId: ObjectId,
  roomNumber: String,
  type: String,
  price: Number,
  capacity: Number,
  status: String,
  amenities: [String],
  images: [String],
  createdAt: Date
}
```

### Booking Model
```javascript
{
  userId: ObjectId,
  hotelId: ObjectId,
  roomId: ObjectId,
  checkIn: Date,
  checkOut: Date,
  totalPrice: Number,
  status: String,
  paymentStatus: String,
  paymentOption: String,
  advancePayment: Number,
  razorpayPaymentId: String,
  razorpayOrderId: String,
  razorpayRefundId: String,
  refundAmount: Number,
  refundStatus: String,
  cancellationReason: String,
  cancelledAt: Date,
  createdAt: Date
}
```

## 💰 Payment & Refund Logic

### Payment Calculation
```javascript
// Full payment
if (paymentOption === "pay-now") {
  amount = totalPrice; // 100%
}

// Advance payment
if (paymentOption === "pay-at-hotel") {
  amount = Math.round(totalPrice * 0.1); // 10%
}
```

### Refund Calculation
```javascript
// Full payment refund
if (paymentOption === "pay-now") {
  refundAmount = totalPrice; // 100%
}

// Advance payment refund
if (paymentOption === "pay-at-hotel") {
  refundAmount = advancePayment; // 10%
}

// No payment made
if (paymentStatus === "pending") {
  refundAmount = 0; // No charges
}
```

### Razorpay Refund
```javascript
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const refund = await razorpay.payments.refund(paymentId, {
  amount: refundAmount * 100, // Amount in paise
  speed: "normal",
  notes: {
    bookingId: booking._id,
    reason: cancellationReason
  }
});
```

## 🔐 Authentication & Authorization

### JWT Middleware
```javascript
// Verify token
const token = req.headers.authorization?.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
```

### Role-Based Access
```javascript
// Admin only routes
if (req.user.role !== 'admin') {
  return res.status(403).json({ message: 'Access denied' });
}
```

## 🔄 Booking Status Flow

```
Created → "pending" (payment not completed)
         ↓
Payment Success → "confirmed"
         ↓
User Cancels → "cancelled"
```

## 🧪 Testing

### Test Endpoints with cURL

#### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hotelId": "hotel_id",
    "roomId": "room_id",
    "checkIn": "2024-12-01",
    "checkOut": "2024-12-05",
    "totalPrice": 10000,
    "paymentOption": "pay-at-hotel",
    "advancePayment": 1000
  }'
```

#### Cancel Booking
```bash
curl -X PUT http://localhost:5000/api/bookings/BOOKING_ID/cancel \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Plans changed"}'
```

### Test Checklist
- [ ] User registration and login
- [ ] Create booking with "pay-now"
- [ ] Create booking with "pay-at-hotel"
- [ ] Payment order creation
- [ ] Payment verification
- [ ] Cancel booking with refund
- [ ] Cancel booking without payment
- [ ] Unauthorized cancellation (should fail)
- [ ] Duplicate cancellation (should fail)

## 🚨 Error Handling

### Common Errors

#### 400 Bad Request
```json
{
  "message": "Booking is already cancelled"
}
```

#### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

#### 403 Forbidden
```json
{
  "message": "Not authorized to cancel this booking"
}
```

#### 404 Not Found
```json
{
  "message": "Booking not found"
}
```

#### 500 Server Error
```json
{
  "message": "Booking cancelled but refund initiation failed",
  "error": "Razorpay error details"
}
```

## 🔧 Configuration

### Environment Variables
```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/hotel-management

# Authentication
JWT_SECRET=your_secret_key_here

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key

# Optional
NODE_ENV=development
```

### CORS Configuration
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## 🚀 Deployment

### Heroku
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set RAZORPAY_KEY_ID=your_key
heroku config:set RAZORPAY_KEY_SECRET=your_secret
git push heroku main
```

### Railway/Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Environment Variables Checklist
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] RAZORPAY_KEY_ID
- [ ] RAZORPAY_KEY_SECRET
- [ ] PORT (optional)

## 📊 Monitoring

### Database Queries
```javascript
// Check booking statuses
db.bookings.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
]);

// Check refund statuses
db.bookings.aggregate([
  { $group: { _id: "$refundStatus", count: { $sum: 1 } } }
]);
```

### Logs
```bash
# View logs
npm run logs

# Monitor in real-time
tail -f logs/app.log
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongosh

# Verify connection string
echo $MONGODB_URI
```

### Razorpay Issues
- Verify API keys in `.env`
- Check test/live mode
- Review Razorpay dashboard
- Check webhook configuration

### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration
- Review middleware order

## 📞 Support

For issues:
1. Check server logs
2. Review error messages
3. Verify environment variables
4. Check database connection
5. Contact development team

## ✨ Features Roadmap

- [ ] Email notifications
- [ ] Webhook handling
- [ ] Advanced analytics
- [ ] Bulk operations
- [ ] Rate limiting
- [ ] API documentation (Swagger)

---

**Version**: 2.0  
**Status**: Production Ready ✅  
**Built with**: Node.js + Express + MongoDB
