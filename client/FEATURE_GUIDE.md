# Hotel Booking Payment & Cancellation - Feature Guide

## 🎯 Overview

This feature provides flexible payment options and easy cancellation with automatic refund handling for hotel bookings.

---

## 💳 Payment Options

### Option 1: Pay Now (Full Payment)
- **Amount**: 100% of total booking cost
- **Status**: Booking confirmed immediately
- **Best for**: Users who want instant confirmation

**Example**:
```
Total Booking: ₹10,000
Pay Now: ₹10,000
Status: Confirmed ✓
```

### Option 2: Pay at Hotel (Advance Payment)
- **Amount**: 10% advance payment now
- **Remaining**: 90% at hotel check-in
- **Status**: Booking confirmed after advance payment
- **Best for**: Users who prefer to pay most at the hotel

**Example**:
```
Total Booking: ₹10,000
Pay Now: ₹1,000 (10%)
Pay at Hotel: ₹9,000 (90%)
Status: Confirmed ✓
```

---

## 📋 Booking Status Explained

### ✓ Confirmed (Green)
- Payment completed successfully
- Booking is guaranteed
- Room is reserved

### ⏳ Pending (Amber)
- Payment not completed yet
- Booking created but not confirmed
- User can complete payment later or cancel

### ✗ Cancelled (Red)
- Booking has been cancelled
- Refund initiated (if payment was made)
- Room released back to inventory

---

## 🔄 What Happens When Payment is Dismissed?

If a user closes the Razorpay payment window without completing payment:

1. **Booking is saved** with status "Pending"
2. **User receives a message**: "Payment cancelled. Your booking is saved as pending."
3. **User can**:
   - Complete payment later from My Bookings page
   - Cancel the booking without any charges

---

## ❌ Cancellation & Refunds

### Cancellation Process

1. Go to **My Bookings** page
2. Find the booking you want to cancel
3. Click **"Cancel Booking"** button
4. Review refund information
5. Optionally provide a reason
6. Confirm cancellation

### Refund Scenarios

#### Scenario 1: Full Payment Made ("Pay Now")
```
Total Paid: ₹10,000
Refund Amount: ₹10,000 (100%)
Processing Time: 5-7 business days
```

#### Scenario 2: Advance Payment Made ("Pay at Hotel")
```
Total Booking: ₹10,000
Advance Paid: ₹1,000 (10%)
Refund Amount: ₹1,000
Processing Time: 5-7 business days
```

#### Scenario 3: No Payment Made (Pending Status)
```
Total Booking: ₹10,000
Amount Paid: ₹0
Refund Amount: ₹0
No charges applied
```

---

## 🎨 Visual Indicators

### Payment Status Colors

| Status | Color | Meaning |
|--------|-------|---------|
| Paid | 🟢 Green | Payment successful |
| Pending | 🟡 Amber | Payment incomplete |
| Failed | 🔴 Red | Payment failed |

### Booking Status Colors

| Status | Color | Icon | Meaning |
|--------|-------|------|---------|
| Confirmed | 🟢 Green | ✓ | Booking guaranteed |
| Pending | 🟡 Amber | ⏳ | Awaiting payment |
| Cancelled | 🔴 Red | ✗ | Booking cancelled |

---

## 📱 User Interface Features

### Payment Options Dialog
- Clean, modern design
- Side-by-side comparison of options
- Clear calculation breakdown
- Visual badges for benefits
- Easy selection with radio buttons

### My Bookings Page
- All bookings in one place
- Color-coded status badges
- Quick access to cancellation
- Shows advance payment amount
- Booking date and details

### Cancel Booking Dialog
- Warning indicators
- Detailed booking summary
- **Automatic refund calculation**
- Refund timeline information
- Optional feedback field
- Clear action buttons

---

## 🔔 Notifications

### Toast Notifications
- **Success**: Green toast with checkmark
- **Error**: Red toast with error icon
- **Info**: Blue toast with info icon

### Examples
- ✅ "Booking Cancelled - Your booking has been cancelled successfully"
- ❌ "Cancellation Failed - Failed to cancel booking"
- ℹ️ "Payment cancelled. Your booking is saved as pending."

---

## 💡 Tips for Users

### For Booking
1. **Choose "Pay Now"** if you want instant confirmation
2. **Choose "Pay at Hotel"** if you prefer flexibility
3. **Check dates carefully** before confirming
4. **Complete payment** to confirm your booking

### For Cancellation
1. **Cancel early** if plans change
2. **Provide a reason** to help us improve
3. **Check refund amount** before confirming
4. **Wait 5-7 days** for refund processing
5. **Contact support** if refund is delayed

---

## 🛡️ Security & Privacy

- All payments processed through **Razorpay** (PCI DSS compliant)
- Secure payment gateway with encryption
- No card details stored on our servers
- Refunds to original payment method only
- User authentication required for all actions

---

## 📞 Support

If you encounter any issues:
- Check your email for booking confirmation
- Visit My Bookings page for status updates
- Contact hotel support for urgent matters
- Refund queries: Wait 5-7 days before contacting

---

## 🚀 Quick Actions

| Action | Location | Button |
|--------|----------|--------|
| Book Room | Hotel Detail Page | "Book Now" |
| View Bookings | My Bookings Page | Navigation Menu |
| Cancel Booking | My Bookings Page | "Cancel Booking" |
| Complete Payment | My Bookings Page | "Complete Payment" (pending) |

---

## ✨ Benefits

### For Users
- ✅ Flexible payment options
- ✅ Easy cancellation process
- ✅ Transparent refund policy
- ✅ Clear status tracking
- ✅ No hidden charges

### For Business
- ✅ Reduced no-shows with advance payment
- ✅ Better cash flow management
- ✅ Automated refund processing
- ✅ Customer feedback collection
- ✅ Improved booking conversion
