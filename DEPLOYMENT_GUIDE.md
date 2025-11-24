# Deployment Guide - Hotel Booking Payment & Cancellation Feature

## 🚀 Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Verify Razorpay credentials in `.env`
  ```env
  RAZORPAY_KEY_ID=rzp_test_xxxxx  # or rzp_live_xxxxx for production
  RAZORPAY_KEY_SECRET=your_secret_key
  ```
- [ ] Ensure MongoDB connection is stable
- [ ] Check Node.js version compatibility (v14+ recommended)
- [ ] Verify all npm packages are installed

### 2. Database Backup
```bash
# Backup your database before deployment
mongodump --uri="your_mongodb_uri" --out=./backup-$(date +%Y%m%d)
```

### 3. Code Review
- [ ] Review all modified files
- [ ] Check for console.log statements (remove or use proper logging)
- [ ] Verify error handling is comprehensive
- [ ] Ensure no sensitive data in code

---

## 📋 Deployment Steps

### Step 1: Backend Deployment

#### 1.1 Install Dependencies
```bash
cd server
npm install
```

#### 1.2 Test Locally
```bash
# Start server in development mode
npm run dev

# Or production mode
npm start
```

#### 1.3 Verify Endpoints
```bash
# Test health check
curl http://localhost:5000/health

# Test booking creation (with auth token)
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hotelId":"...","roomId":"...","checkIn":"2024-12-01","checkOut":"2024-12-05","totalPrice":10000,"paymentOption":"pay-now","advancePayment":10000}'
```

#### 1.4 Deploy to Server
```bash
# If using PM2
pm2 restart hotel-booking-api

# If using Docker
docker-compose up -d --build

# If using Heroku
git push heroku main

# If using Render/Railway
git push origin main  # Auto-deploys
```

---

### Step 2: Frontend Deployment

#### 2.1 Update Environment Variables
```bash
cd client
# Update .env with production API URL
VITE_API_URL=https://your-api-domain.com
```

#### 2.2 Build Frontend
```bash
npm run build
```

#### 2.3 Test Build Locally
```bash
npm run preview
```

#### 2.4 Deploy Frontend
```bash
# If using Vercel
vercel --prod

# If using Netlify
netlify deploy --prod

# If using custom server
scp -r dist/* user@server:/var/www/html/
```

---

## 🧪 Post-Deployment Testing

### Critical Tests

#### 1. Booking Flow Test
```bash
# Test complete booking flow
1. Create booking with "Pay Now"
2. Complete payment via Razorpay
3. Verify booking status is "confirmed"
4. Check payment status is "paid"
```

#### 2. Cancellation Test
```bash
# Test cancellation with refund
1. Create and complete a booking
2. Cancel the booking
3. Verify refund is initiated
4. Check Razorpay dashboard for refund
```

#### 3. Edge Cases
- [ ] Test payment dismissal (booking should stay pending)
- [ ] Test unauthorized cancellation attempt
- [ ] Test duplicate cancellation attempt
- [ ] Test cancellation without payment

---

## 🔍 Monitoring Setup

### 1. Server Logs
```bash
# If using PM2
pm2 logs hotel-booking-api

# If using Docker
docker logs -f container_name

# Check for errors
grep -i "error" /var/log/app.log
```

### 2. Razorpay Dashboard
- Monitor payment success rate
- Track refund processing
- Check for failed transactions
- Review webhook events

### 3. Database Monitoring
```javascript
// Check booking statuses
db.bookings.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

// Check refund statuses
db.bookings.aggregate([
  { $group: { _id: "$refundStatus", count: { $sum: 1 } } }
])

// Check payment options usage
db.bookings.aggregate([
  { $group: { _id: "$paymentOption", count: { $sum: 1 } } }
])
```

---

## 🚨 Rollback Plan

### If Issues Occur

#### 1. Quick Rollback (Frontend)
```bash
# Revert to previous deployment
vercel rollback  # or
netlify rollback
```

#### 2. Backend Rollback
```bash
# If using PM2
pm2 restart hotel-booking-api --update-env

# If using Git
git revert HEAD
git push origin main

# Restore database if needed
mongorestore --uri="your_mongodb_uri" ./backup-20241124
```

#### 3. Database Schema Rollback
```javascript
// Remove new fields if needed (not recommended)
db.bookings.updateMany(
  {},
  {
    $unset: {
      paymentOption: "",
      advancePayment: "",
      refundAmount: "",
      refundStatus: "",
      razorpayRefundId: "",
      cancellationReason: "",
      cancelledAt: ""
    }
  }
)
```

---

## 📊 Success Metrics

### Monitor These KPIs

#### Week 1
- [ ] Booking creation success rate > 95%
- [ ] Payment completion rate > 80%
- [ ] Cancellation success rate > 99%
- [ ] Refund initiation success rate > 99%
- [ ] Zero critical errors

#### Week 2-4
- [ ] Track payment option preferences
- [ ] Monitor cancellation reasons
- [ ] Analyze refund processing times
- [ ] Review user feedback

---

## 🔧 Troubleshooting

### Common Issues

#### Issue 1: Refund Failed
**Symptoms**: Booking cancelled but refund not initiated

**Solution**:
1. Check Razorpay credentials
2. Verify payment ID exists
3. Check Razorpay account balance
4. Review Razorpay dashboard for errors
5. Manually initiate refund if needed

```javascript
// Manual refund script
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

razorpay.payments.refund('pay_xxxxx', {
  amount: 100000, // in paise
  speed: 'normal'
}).then(refund => {
  console.log('Refund initiated:', refund);
}).catch(error => {
  console.error('Refund failed:', error);
});
```

#### Issue 2: Booking Not Confirming
**Symptoms**: Payment successful but booking still pending

**Solution**:
1. Check payment verification endpoint
2. Verify Razorpay signature validation
3. Check server logs for errors
4. Manually update booking if needed

```javascript
// Manual booking confirmation
db.bookings.updateOne(
  { _id: ObjectId('booking_id') },
  {
    $set: {
      status: 'confirmed',
      paymentStatus: 'paid',
      razorpayPaymentId: 'pay_xxxxx'
    }
  }
)
```

#### Issue 3: Unauthorized Cancellation
**Symptoms**: Users can't cancel their own bookings

**Solution**:
1. Verify JWT token is valid
2. Check user ID in token matches booking owner
3. Review middleware authentication
4. Check CORS settings

---

## 📞 Support Contacts

### Internal Team
- **Backend Lead**: [Contact Info]
- **Frontend Lead**: [Contact Info]
- **DevOps**: [Contact Info]

### External Services
- **Razorpay Support**: support@razorpay.com
- **MongoDB Atlas**: support@mongodb.com

---

## 📝 Post-Deployment Tasks

### Immediate (Day 1)
- [ ] Monitor error logs continuously
- [ ] Test all critical flows
- [ ] Verify Razorpay integration
- [ ] Check database performance
- [ ] Review user feedback

### Short-term (Week 1)
- [ ] Analyze booking patterns
- [ ] Review cancellation reasons
- [ ] Monitor refund processing times
- [ ] Optimize slow queries
- [ ] Update documentation based on issues

### Long-term (Month 1)
- [ ] Generate analytics report
- [ ] Plan feature improvements
- [ ] Review and optimize costs
- [ ] Conduct user surveys
- [ ] Plan next iteration

---

## 🎯 Success Criteria

### Technical
- ✅ Zero critical bugs
- ✅ 99.9% uptime
- ✅ < 2s average response time
- ✅ All tests passing

### Business
- ✅ Increased booking conversion
- ✅ Reduced no-shows
- ✅ Positive user feedback
- ✅ Smooth refund processing

---

## 📚 Documentation Links

- [Implementation Summary](client/IMPLEMENTATION_SUMMARY.md)
- [Feature Guide](client/FEATURE_GUIDE.md)
- [Backend Implementation](server/IMPLEMENTATION_COMPLETE.md)
- [API Testing Guide](server/TEST_ENDPOINTS.md)
- [Changes Summary](CHANGES_SUMMARY.md)

---

## ✅ Final Checklist

### Before Going Live
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Database backed up
- [ ] Environment variables set
- [ ] Monitoring configured
- [ ] Rollback plan ready
- [ ] Team notified
- [ ] Documentation complete

### After Going Live
- [ ] Monitor for 1 hour continuously
- [ ] Test critical flows in production
- [ ] Verify Razorpay integration
- [ ] Check error rates
- [ ] Announce to users
- [ ] Update status page

---

**Deployment Date**: _____________
**Deployed By**: _____________
**Status**: _____________
**Notes**: _____________

---

## 🎉 Congratulations!

Your hotel booking payment and cancellation feature is now live!

Remember to:
- Monitor closely for the first 24 hours
- Respond quickly to any issues
- Collect user feedback
- Iterate and improve

Good luck! 🚀
