# Backend Requirements for Payment & Cancellation Feature

## Required API Endpoints

### 1. Booking Creation (Update Existing)
**Endpoint**: `POST /api/bookings`

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

**Response**:
```json
{
  "booking": {
    "_id": "string",
    "status": "pending",
    "paymentStatus": "pending",
    ...
  }
}
```

**Logic**:
- Create booking with `status: "pending"` initially
- Store `paymentOption` and `advancePayment` fields
- Only change status to "confirmed" after successful payment verification

---

### 2. Payment Order Creation (Update Existing)
**Endpoint**: `POST /api/payments/create-order`

**Request Body**:
```json
{
  "bookingId": "string",
  "amount": "number"  // Can be full amount or 10% advance
}
```

**Response**:
```json
{
  "orderId": "string",
  "amount": "number",
  "currency": "INR",
  "key": "razorpay_key"
}
```

**Logic**:
- Accept custom `amount` parameter
- Create Razorpay order with the specified amount
- Link order to booking

---

### 3. Payment Verification (Update Existing)
**Endpoint**: `POST /api/payments/verify`

**Request Body**:
```json
{
  "razorpay_payment_id": "string",
  "razorpay_order_id": "string",
  "razorpay_signature": "string",
  "bookingId": "string"
}
```

**Response**:
```json
{
  "message": "Payment verified successfully",
  "booking": {
    "status": "confirmed",
    "paymentStatus": "paid"
  }
}
```

**Logic**:
- Verify Razorpay signature
- Update booking:
  - `status: "confirmed"`
  - `paymentStatus: "paid"`
  - Store payment IDs
- Send confirmation email (optional)

---

### 4. Booking Cancellation (NEW)
**Endpoint**: `PUT /api/bookings/:bookingId/cancel`

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "reason": "string (optional)"
}
```

**Response**:
```json
{
  "message": "Booking cancelled successfully",
  "refund": {
    "amount": "number",
    "status": "initiated",
    "estimatedDays": "5-7"
  }
}
```

**Logic**:
1. Verify user owns the booking
2. Check if booking can be cancelled (not already cancelled)
3. Update booking status to "cancelled"
4. If payment was made (`paymentStatus: "paid"`):
   - Initiate Razorpay refund
   - Refund amount:
     - Full payment: `totalPrice`
     - Advance payment: `advancePayment` (10%)
5. Store cancellation reason and timestamp
6. Send cancellation confirmation email (optional)

---

## Database Schema Updates

### Booking Model
Add the following fields to the existing booking schema:

```javascript
{
  // Existing fields...
  
  // New fields
  paymentOption: {
    type: String,
    enum: ["pay-now", "pay-at-hotel"],
    default: "pay-now"
  },
  advancePayment: {
    type: Number,
    default: 0
  },
  cancellationReason: {
    type: String
  },
  cancelledAt: {
    type: Date
  }
}
```

---

## Razorpay Refund Integration

### Refund API Call
```javascript
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Initiate refund
const refund = await razorpay.payments.refund(paymentId, {
  amount: refundAmount * 100, // Amount in paise
  speed: "normal", // or "optimum"
  notes: {
    bookingId: booking._id,
    reason: cancellationReason
  }
});
```

### Refund Response
```json
{
  "id": "rfnd_xxxxx",
  "entity": "refund",
  "amount": 150000,
  "currency": "INR",
  "payment_id": "pay_xxxxx",
  "status": "processed",
  "speed_processed": "normal",
  "created_at": 1234567890
}
```

---

## Status Flow Logic

### Booking Status
```
pending → confirmed → cancelled
   ↓
(payment not completed)
```

### Payment Status
```
pending → paid → (refunded if cancelled)
   ↓
failed
```

---

## Email Notifications (Optional)

### 1. Booking Confirmation Email
- Sent when payment is verified
- Include booking details, payment receipt
- Show remaining amount for "pay-at-hotel"

### 2. Cancellation Confirmation Email
- Sent when booking is cancelled
- Include refund details and timeline
- Provide support contact information

---

## Error Handling

### Cancellation Errors
- **Booking not found**: 404
- **Unauthorized**: 403 (user doesn't own booking)
- **Already cancelled**: 400
- **Refund failed**: 500 (log error, notify admin)

### Payment Errors
- **Payment verification failed**: 400
- **Order creation failed**: 500
- **Invalid amount**: 400

---

## Security Considerations

1. **Authorization**: Verify user owns the booking before cancellation
2. **Signature Verification**: Always verify Razorpay signatures
3. **Idempotency**: Prevent duplicate refunds
4. **Audit Trail**: Log all payment and cancellation actions
5. **Rate Limiting**: Prevent abuse of cancellation endpoint

---

## Testing Checklist

- [ ] Create booking with "pay-now" option
- [ ] Create booking with "pay-at-hotel" option
- [ ] Complete payment successfully
- [ ] Dismiss payment (booking stays pending)
- [ ] Cancel booking with payment (refund initiated)
- [ ] Cancel booking without payment (no refund)
- [ ] Verify refund amount calculation
- [ ] Test unauthorized cancellation attempt
- [ ] Test duplicate cancellation attempt
- [ ] Verify email notifications (if implemented)
