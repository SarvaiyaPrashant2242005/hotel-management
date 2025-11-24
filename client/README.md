# Hotel Management - Frontend

Modern React-based frontend for the hotel booking and management system with flexible payment options and comprehensive admin panel.

## 🚀 Features

### Customer Features
- **Hotel Browsing**: Search and filter hotels
- **Room Booking**: Book rooms with flexible payment options
- **Payment Options**:
  - Pay Now (100% payment)
  - Pay at Hotel (10% advance)
- **Booking Management**: View and manage all bookings
- **Easy Cancellation**: Cancel with automatic refund

### Admin Features
- **Dashboard**: Analytics, revenue trends, booking statistics
- **Hotel Management**: CRUD operations for hotels
- **Room Management**: Manage inventory with images
- **Booking Tracking**: Monitor reservations with filters
- **Payment Monitoring**: Track all transactions

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - UI component library
- **Recharts** - Data visualization
- **Razorpay** - Payment gateway
- **React Router** - Navigation
- **Axios** - HTTP client

## 📋 Prerequisites

- Node.js (v14+)
- npm or yarn
- Backend server running

## 🚀 Installation

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Environment Setup
Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Run Development Server
```bash
npm run dev
```

Access at: http://localhost:5173

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable components
│   │   ├── CancelBookingDialog.tsx
│   │   ├── PaymentOptionsDialog.tsx
│   │   └── SearchBar.tsx
│   ├── pages/              # Page components
│   │   ├── Home.tsx
│   │   ├── HotelDetail.tsx
│   │   ├── MyBookings.tsx
│   │   ├── Contact.tsx
│   │   ├── Login.tsx
│   │   └── admin/          # Admin pages
│   │       ├── AdminLayout.jsx
│   │       ├── Dashboard.tsx
│   │       ├── Hotels.tsx
│   │       ├── Rooms.tsx
│   │       ├── Bookings.tsx
│   │       └── Payments.tsx
│   ├── lib/                # Utilities
│   │   └── utils.ts
│   ├── hooks/              # Custom hooks
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🎯 Key Features

### Payment System

#### Payment Options Dialog
```typescript
// Two payment options available:
1. Pay Now - Full payment (100%)
2. Pay at Hotel - Advance payment (10%)
```

Features:
- Clear payment breakdown
- Visual comparison
- Booking summary
- Instant confirmation badge

#### Payment Flow
```
1. User selects dates → Clicks "Book Now"
2. Payment Options Dialog opens
3. User selects payment option
4. Razorpay payment gateway opens
5. Payment success → Booking confirmed
6. Payment dismissed → Booking saved as pending
```

### Cancellation System

#### Cancel Booking Dialog
Features:
- Booking details display
- Automatic refund calculation
- Refund timeline information
- Optional cancellation reason
- Warning indicators

#### Refund Logic
```typescript
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

### Booking Management

#### My Bookings Page
Features:
- All bookings in one place
- Color-coded status badges:
  - ✓ Confirmed (Green)
  - ⏳ Pending (Amber)
  - ✗ Cancelled (Red)
- Payment status indicators
- Cancel booking button
- Advance payment display

### Admin Panel

#### Dashboard
- **Stat Cards**: Revenue, bookings count
- **Charts**:
  - Revenue trend (line chart)
  - Booking status (pie chart)
  - Hotel occupancy (bar chart)
- **Responsive**: Works on all devices

#### Hotel Management
- Add/Edit/Delete hotels
- Search and filter
- Image upload
- Grid layout with cards

#### Room Management
- Add/Edit/Delete rooms
- Multiple images support
- Filter by hotel and status
- Amenities management

#### Booking Tracking
- Filter by hotel, status, payment
- Date range selection
- Detailed booking information
- Export-ready layout

#### Payment Monitoring
- Summary cards (Total, Paid, Pending)
- Search transactions
- Filter by status, hotel, date
- Transaction history

## 🎨 UI Components

### shadcn/ui Components Used
- Dialog
- Button
- Input
- Label
- Select
- Textarea
- RadioGroup
- Card
- Badge
- Toast
- Table
- Tabs

### Custom Components
- `PaymentOptionsDialog` - Payment selection
- `CancelBookingDialog` - Cancellation confirmation
- `SearchBar` - Hotel search
- Admin components (Dashboard, Hotels, etc.)

## 🔐 Authentication

### User Authentication
```typescript
// Login flow
1. User enters credentials
2. Backend validates and returns JWT
3. Token stored in localStorage
4. Token sent with API requests
```

### Protected Routes
```typescript
// Admin routes require:
- Valid JWT token
- Admin role
```

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Features
- Hamburger menu
- Touch-friendly buttons
- Optimized layouts
- Swipeable tables

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

## 🏗️ Build

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Environment Variables
Set these in your hosting platform:
- `VITE_API_URL` - Backend API URL
- `VITE_RAZORPAY_KEY_ID` - Razorpay key

## 🎯 User Flows

### Booking Flow
```
Home → Search Hotels → Hotel Detail → 
Select Dates → Payment Options → 
Razorpay Payment → Booking Confirmed
```

### Cancellation Flow
```
My Bookings → Select Booking → 
Cancel Button → Confirm Cancellation → 
Refund Initiated
```

### Admin Flow
```
Login → Dashboard → 
Manage Hotels/Rooms/Bookings/Payments
```

## 💡 Best Practices

### Code Organization
- Components in `/components`
- Pages in `/pages`
- Utilities in `/lib`
- Types in TypeScript files

### State Management
- React hooks (useState, useEffect)
- Context API for global state
- Local storage for auth token

### API Calls
- Axios for HTTP requests
- Error handling with try-catch
- Loading states for UX

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API Connection Issues**
- Check `VITE_API_URL` in `.env`
- Ensure backend is running
- Check CORS settings

**Payment Issues**
- Verify Razorpay key in `.env`
- Check Razorpay test/live mode
- Review browser console for errors

## 📊 Performance

### Optimizations
- Code splitting with React.lazy
- Image optimization
- Lazy loading
- Memoization with useMemo/useCallback

## 🔧 Scripts

```json
{
  "dev": "vite",              // Development server
  "build": "vite build",      // Production build
  "preview": "vite preview",  // Preview build
  "lint": "eslint .",         // Lint code
  "test": "vitest"            // Run tests
}
```

## 📞 Support

For issues:
1. Check browser console for errors
2. Review network tab for API calls
3. Check environment variables
4. Contact development team

## ✨ Features Roadmap

- [ ] Email notifications
- [ ] PDF booking receipts
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] User reviews and ratings
- [ ] Loyalty program

---

**Version**: 2.0  
**Status**: Production Ready ✅  
**Built with**: React + TypeScript + Vite
