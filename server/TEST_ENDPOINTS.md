# API Testing Guide

## Quick Test Commands

### Prerequisites
```bash
# Set your base URL
BASE_URL="http://localhost:5000"  # or your server URL

# Get your auth token after login
TOKEN="your_jwt_token_here"
```

---

## 1. Create Booking with "Pay Now"

```bash
curl -X POST ${BASE_URL}/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "hotelId": "hotel_id_here",
    "roomId": "room_id_here",
    "checkIn": "2024-12-01",
    "checkOut": "2024-12-05",
    "totalPrice": 10000,
    "paymentOption": "pay-now",
    "advancePayment": 10000
  }'
```

**Expected Response**:
```json
{
  "message": "Booking created successfully",
  "booking": {
    "_id": "...",
    "status": "pending",
    "paymentStatus": "pending",
    "paymentOption": "pay-now",
    "totalPrice": 10000,
    "advancePayment": 10000
  }
}
```

---

## 2. Create Booking with "Pay at Hotel"

```bash
curl -X POST ${BASE_URL}/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "hotelId": "hotel_id_here",
    "roomId": "room_id_here",
    "checkIn": "2024-12-01",
    "checkOut": "2024-12-05",
    "totalPrice": 10000,
    "paymentOption": "pay-at-hotel",
    "advancePayment": 1000
  }'
```

**Expected Response**:
```json
{
  "message": "Booking created successfully",
  "booking": {
    "_id": "...",
    "status": "pending",
    "paymentStatus": "pending",
    "paymentOption": "pay-at-hotel",
    "totalPrice": 10000,
    "advancePayment": 1000
  }
}
```

---

## 3. Create Payment Order (Full Payment)

```bash
curl -X POST ${BASE_URL}/api/payments/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "bookingId": "booking_id_here",
    "amount": 10000
  }'
```

**Expected Response**:
```json
{
  "orderId": "order_xxxxx",
  "amount": 1000000,
  "currency": "INR",
  "bookingId": "...",
  "key": "rzp_test_xxxxx"
}
```

---

## 4. Create Payment Order (Advance Payment - 10%)

```bash
curl -X POST ${BASE_URL}/api/payments/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "bookingId": "booking_id_here",
    "amount": 1000
  }'
```

**Expected Response**:
```json
{
  "orderId": "order_xxxxx",
  "amount": 100000,
  "currency": "INR",
  "bookingId": "...",
  "key": "rzp_test_xxxxx"
}
```

---

## 5. Verify Payment

```bash
curl -X POST ${BASE_URL}/api/payments/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "razorpay_payment_id": "pay_xxxxx",
    "razorpay_order_id": "order_xxxxx",
    "razorpay_signature": "signature_here",
    "bookingId": "booking_id_here"
  }'
```

**Expected Response**:
```json
{
  "message": "Payment verified successfully",
  "booking": {
    "_id": "...",
    "status": "confirmed",
    "paymentStatus": "paid",
    "razorpayPaymentId": "pay_xxxxx"
  }
}
```

---

## 6. Get My Bookings

```bash
curl -X GET ${BASE_URL}/api/bookings/me \
  -H "Authorization: Bearer ${TOKEN}"
```

**Expected Response**:
```json
[
  {
    "_id": "...",
    "hotel": {
      "name": "Grand Hotel",
      "city": "Mumbai"
    },
    "room": {
      "roomNumber": "101",
      "type": "Deluxe"
    },
    "status": "confirmed",
    "paymentStatus": "paid",
    "paymentOption": "pay-at-hotel",
    "totalPrice": 10000,
    "advancePayment": 1000,
    "checkIn": "2024-12-01",
    "checkOut": "2024-12-05"
  }
]
```

---

## 7. Cancel Booking (With Refund)

```bash
curl -X PUT ${BASE_URL}/api/bookings/booking_id_here/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "reason": "Plans changed"
  }'
```

**Expected Response (Full Payment)**:
```json
{
  "message": "Booking cancelled successfully. Refund of ₹10,000 has been initiated and will be processed within 5-7 business days.",
  "booking": {
    "_id": "...",
    "status": "cancelled",
    "cancelledAt": "2024-11-24T...",
    "cancellationReason": "Plans changed",
    "refundAmount": 10000,
    "refundStatus": "initiated"
  },
  "refund": {
    "amount": 10000,
    "status": "initiated",
    "estimatedDays": "5-7",
    "refundId": "rfnd_xxxxx"
  }
}
```

**Expected Response (Advance Payment)**:
```json
{
  "message": "Booking cancelled successfully. Refund of ₹1,000 has been initiated and will be processed within 5-7 business days.",
  "booking": {
    "_id": "...",
    "status": "cancelled",
    "refundAmount": 1000,
    "refundStatus": "initiated"
  },
  "refund": {
    "amount": 1000,
    "status": "initiated",
    "estimatedDays": "5-7",
    "refundId": "rfnd_xxxxx"
  }
}
```

---

## 8. Cancel Booking (Without Payment)

```bash
curl -X PUT ${BASE_URL}/api/bookings/booking_id_here/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "reason": "Changed my mind"
  }'
```

**Expected Response**:
```json
{
  "message": "Booking cancelled successfully.",
  "booking": {
    "_id": "...",
    "status": "cancelled",
    "cancelledAt": "2024-11-24T...",
    "cancellationReason": "Changed my mind"
  },
  "refund": null
}
```

---

## Error Scenarios

### 1. Unauthorized Cancellation

```bash
# Try to cancel someone else's booking
curl -X PUT ${BASE_URL}/api/bookings/other_user_booking_id/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "reason": "Test"
  }'
```

**Expected Response**:
```json
{
  "message": "Not authorized to cancel this booking"
}
Status: 403
```

---

### 2. Duplicate Cancellation

```bash
# Try to cancel already cancelled booking
curl -X PUT ${BASE_URL}/api/bookings/cancelled_booking_id/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "reason": "Test"
  }'
```

**Expected Response**:
```json
{
  "message": "Booking is already cancelled"
}
Status: 400
```

---

### 3. Booking Not Found

```bash
curl -X PUT ${BASE_URL}/api/bookings/invalid_id/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "reason": "Test"
  }'
```

**Expected Response**:
```json
{
  "message": "Booking not found"
}
Status: 404
```

---

## Postman Collection

### Import this JSON into Postman:

```json
{
  "info": {
    "name": "Hotel Booking API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    },
    {
      "key": "token",
      "value": "your_jwt_token"
    }
  ],
  "item": [
    {
      "name": "Create Booking (Pay Now)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"hotelId\": \"hotel_id\",\n  \"roomId\": \"room_id\",\n  \"checkIn\": \"2024-12-01\",\n  \"checkOut\": \"2024-12-05\",\n  \"totalPrice\": 10000,\n  \"paymentOption\": \"pay-now\",\n  \"advancePayment\": 10000\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/api/bookings",
          "host": ["{{baseUrl}}"],
          "path": ["api", "bookings"]
        }
      }
    },
    {
      "name": "Create Booking (Pay at Hotel)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"hotelId\": \"hotel_id\",\n  \"roomId\": \"room_id\",\n  \"checkIn\": \"2024-12-01\",\n  \"checkOut\": \"2024-12-05\",\n  \"totalPrice\": 10000,\n  \"paymentOption\": \"pay-at-hotel\",\n  \"advancePayment\": 1000\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/api/bookings",
          "host": ["{{baseUrl}}"],
          "path": ["api", "bookings"]
        }
      }
    },
    {
      "name": "Cancel Booking",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"reason\": \"Plans changed\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/api/bookings/:id/cancel",
          "host": ["{{baseUrl}}"],
          "path": ["api", "bookings", ":id", "cancel"],
          "variable": [
            {
              "key": "id",
              "value": "booking_id"
            }
          ]
        }
      }
    },
    {
      "name": "Get My Bookings",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/bookings/me",
          "host": ["{{baseUrl}}"],
          "path": ["api", "bookings", "me"]
        }
      }
    }
  ]
}
```

---

## Testing Checklist

- [ ] Create booking with "pay-now" option
- [ ] Create booking with "pay-at-hotel" option
- [ ] Create payment order with full amount
- [ ] Create payment order with advance amount (10%)
- [ ] Verify payment successfully
- [ ] Get user's bookings list
- [ ] Cancel booking with full payment (verify refund)
- [ ] Cancel booking with advance payment (verify refund)
- [ ] Cancel booking without payment (no refund)
- [ ] Try unauthorized cancellation (should fail)
- [ ] Try duplicate cancellation (should fail)
- [ ] Verify refund in Razorpay dashboard

---

## Razorpay Dashboard Verification

After testing, verify in Razorpay Dashboard:

1. **Payments**: Check payment status
2. **Orders**: Verify order creation
3. **Refunds**: Confirm refund initiation
4. **Webhooks**: Check webhook events (if configured)

---

## Notes

- Replace `hotel_id_here`, `room_id_here`, `booking_id_here` with actual IDs
- Get JWT token from login endpoint first
- Test in development environment before production
- Monitor server logs for errors
- Check Razorpay test mode vs live mode
