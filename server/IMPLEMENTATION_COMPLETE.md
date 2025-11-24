# Backend Implementation Complete

## ✅ Changes Implemented

### 1. Database Schema Updates

**File**: `server/model/bookingModel.js`

#### New Fields Added:
```javascript
{
  // Payment options
  paymentOption: {
    type: String,
    enum: ["pay-now", "pay-at-hotel"],
    default: "pay-now"
  },
  advancePayment: {
    type: Number,
    default: 0
  },
  
  // Refund tracking
  razorpayRefundId: {
    type: String
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundStatus: {
    type: String,
    enum: ["none", "initiated", "processed", "failed"],
    default: "none"
  },
  
  // Cancellation tracking
  cancellationReason: {
    type: String
  },
  cancelledAt: {
    type: Date
  }
}
```

---

### 2. Booking Controller Updates

**File**: `server/controller/bookingController.js`

#### Updated: `createBooking`
- Now accepts `paymentOption` and `advancePayment` fields
- Creates booking with `status: "pending"` (changed from "confirmed")
- Booking will be confirmed only after successful payment

**Request Body**:
```json
{
  "hotelId": "string",
  "roomId": "string",
  "checkIn": "date",
  "checkOut": "date",
  "totalPrice": "number",
  "paymentOption": "pay-now" | "pay-at-hotel",
  "advancePayment": "number"
}
```

#### New: `cancelBooking`
- User can cancel their own bookings
- Verifies booking ownership
- Prevents duplicate cancellations
- Automatically initiates Razorpay refund if payment was made
- Calculates refund amount based on payment option:
  - **Pay Now**: Full refund (100%)
  - **Pay at Hotel**: Advance refund (10%)
  - **No Payment**: No refund

**Endpoint**: `PUT /api/bookings/:id/cancel`

**Request Body**:
```json
{
  "reason": "Optional cancellation reason"
}
```

**Response**:
```json
{
  "message": "Booking cancelled successfully. Refund of ₹1,000 has been initiated...",
  "booking": { /* updated booking object */ },
  "refund": {
    "amount": 1000,
    "status": "initiated",
    "estimatedDays": "5-7",
    "refundId": "rfnd_xxxxx"
  }
}
```

---

### 3. Payment Controller Updates

**File**: `server/controller/paymentController.js`

#### Updated: `createOrder`
- Now accepts optional `amount` parameter
- Supports custom payment amounts for advance payments
- Stores payment option in order notes

**Request Body**:
```json
{
  "bookingId": "string",
  "amount": "number (optional)"
}
```

**Logic**:
- If `amount` is provided: Use it (for 10% advance)
- If `amount` is not provided: Use `booking.totalPrice` (for full payment)

---

### 4. Routes Updates

**File**: `server/routes/bookingRoutes.js`

#### New Route Added:
```javascript
router.put("/:id/cancel", verifyToken, bookingController.cancelBooking);
```

**Complete Routes**:
- `POST /api/bookings` - Create booking
- `GET /api/bookings/me` - Get user's bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking (NEW)
- `GET /api/bookings` - Get all bookings (Admin)
- `PUT /api/bookings/:id/status` - Update status (Admin)

---

## 🔄 Booking Status Flow

### Before Payment
```
Create Booking → status: "pending", paymentStatus: "pending"
```

### After Successful Payment
```
Payment Verified → status: "confirmed", paymentStatus: "paid"
```

### After Cancellation
```
Cancel Booking → status: "cancelled"
                ↓
If payment was made → Initiate Razorpay refund
                     → refundStatus: "initiated"
```

---

## 💰 Refund Logic

### Refund Amount Calculation
```javascript
if (booking.paymentOption === "pay-at-hotel") {
  refundAmount = booking.advancePayment || Math.round(booking.totalPrice * 0.1);
} else {
  refundAmount = booking.totalPrice;
}
```

### Razorpay Refund API Call
```javascript
const refund = await razorpay.payments.refund(booking.razorpayPaymentId, {
  amount: Math.round(refundAmount * 100), // Amount in paise
  speed: "normal",
  notes: {
    bookingId: booking._id.toString(),
    reason: reason || "User cancellation"
  }
});
```

---

## 🔐 Security Features

### Authorization Checks
1. **Booking Creation**: Requires valid JWT token
2. **Booking Cancellation**: 
   - Requires valid JWT token
   - Verifies user owns the booking
   - Prevents unauthorized cancellations

### Validation
- Validates booking exists before operations
- Checks if booking is already cancelled
- Verifies payment status before refund
- Validates Razorpay signatures

---

## 🧪 Testing Guide

### Test Scenarios

#### 1. Create Booking with "Pay Now"
```bash
POST /api/bookings
{
  "hotelId": "...",
  "roomId": "...",
  "checkIn": "2024-01-01",
  "checkOut": "2024-01-05",
  "totalPrice": 10000,
  "paymentOption": "pay-now",
  "advancePayment": 10000
}

Expected: Booking created with status "pending"
```

#### 2. Create Booking with "Pay at Hotel"
```bash
POST /api/bookings
{
  "hotelId": "...",
  "roomId": "...",
  "checkIn": "2024-01-01",
  "checkOut": "2024-01-05",
  "totalPrice": 10000,
  "paymentOption": "pay-at-hotel",
  "advancePayment": 1000
}

Expected: Booking created with status "pending"
```

#### 3. Create Payment Order (Full Payment)
```bash
POST /api/payments/create-order
{
  "bookingId": "...",
  "amount": 10000
}

Expected: Razorpay order created for ₹10,000
```

#### 4. Create Payment Order (Advance Payment)
```bash
POST /api/payments/create-order
{
  "bookingId": "...",
  "amount": 1000
}

Expected: Razorpay order created for ₹1,000
```

#### 5. Verify Payment
```bash
POST /api/payments/verify
{
  "razorpay_payment_id": "...",
  "razorpay_order_id": "...",
  "razorpay_signature": "...",
  "bookingId": "..."
}

Expected: 
- Booking status: "confirmed"
- Payment status: "paid"
```

#### 6. Cancel Booking (With Payment)
```bash
PUT /api/bookings/:id/cancel
{
  "reason": "Plans changed"
}

Expected:
- Booking status: "cancelled"
- Refund initiated
- refundStatus: "initiated"
```

#### 7. Cancel Booking (Without Payment)
```bash
PUT /api/bookings/:id/cancel
{
  "reason": "Changed my mind"
}

Expected:
- Booking status: "cancelled"
- No refund (payment was never made)
```

#### 8. Unauthorized Cancellation Attempt
```bash
PUT /api/bookings/:id/cancel
(Using different user's token)

Expected: 403 Forbidden
```

#### 9. Duplicate Cancellation Attempt
```bash
PUT /api/bookings/:id/cancel
(On already cancelled booking)

Expected: 400 Bad Request - "Booking is already cancelled"
```

---

## 🚨 Error Handling

### Cancellation Errors

#### Booking Not Found
```json
{
  "message": "Booking not found"
}
Status: 404
```

#### Unauthorized
```json
{
  "message": "Not authorized to cancel this booking"
}
Status: 403
```

#### Already Cancelled
```json
{
  "message": "Booking is already cancelled"
}
Status: 400
```

#### Refund Failed
```json
{
  "message": "Booking cancelled but refund initiation failed. Please contact support.",
  "error": "Razorpay error message",
  "booking": { /* booking object */ }
}
Status: 500
```

---

## 📊 Database Migration

### For Existing Bookings

If you have existing bookings in the database, they will automatically get default values:
- `paymentOption`: "pay-now"
- `advancePayment`: 0
- `refundStatus`: "none"
- `refundAmount`: 0

No manual migration needed as all new fields have default values.

---

## 🔧 Environment Variables Required

Ensure these are set in your `.env` file:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## 📝 API Documentation Summary

### Booking Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | User | Create booking |
| GET | `/api/bookings/me` | User | Get user's bookings |
| PUT | `/api/bookings/:id/cancel` | User | Cancel booking |
| GET | `/api/bookings` | Admin | Get all bookings |
| PUT | `/api/bookings/:id/status` | Admin | Update status |

### Payment Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/create-order` | User | Create Razorpay order |
| POST | `/api/payments/verify` | User | Verify payment |

---

## ✅ Checklist

- [x] Updated booking model with new fields
- [x] Modified createBooking to accept payment options
- [x] Implemented cancelBooking controller
- [x] Updated payment controller for custom amounts
- [x] Added cancellation route
- [x] Integrated Razorpay refund API
- [x] Added authorization checks
- [x] Implemented error handling
- [x] Created comprehensive documentation

---

## 🚀 Deployment Steps

1. **Backup Database**
   ```bash
   mongodump --uri="your_mongodb_uri"
   ```

2. **Deploy Code**
   - Push changes to repository
   - Deploy to server

3. **Verify Environment Variables**
   - Check RAZORPAY_KEY_ID
   - Check RAZORPAY_KEY_SECRET

4. **Test Endpoints**
   - Test booking creation
   - Test payment flow
   - Test cancellation
   - Test refund

5. **Monitor Logs**
   - Watch for errors
   - Monitor refund processing
   - Check Razorpay dashboard

---

## 📞 Support & Troubleshooting

### Common Issues

#### Refund Failed
- Check Razorpay credentials
- Verify payment ID exists
- Check Razorpay dashboard for errors
- Ensure sufficient balance in Razorpay account

#### Booking Not Confirming
- Verify payment verification endpoint
- Check Razorpay signature validation
- Ensure webhook is configured (if using)

#### Unauthorized Errors
- Verify JWT token is valid
- Check user ID matches booking owner
- Ensure middleware is working

---

## 📈 Monitoring Recommendations

### Metrics to Track
1. Cancellation rate
2. Refund processing time
3. Failed refund attempts
4. Payment option preferences (pay-now vs pay-at-hotel)
5. Average booking value by payment option

### Logs to Monitor
- Refund initiation attempts
- Failed refund errors
- Cancellation reasons
- Payment verification failures

---

**Implementation Date**: November 24, 2025
**Status**: ✅ Complete
**Version**: 1.0.0
