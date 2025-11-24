# Admin Panel User Guide

## Overview
The Hotel Management Admin Panel is a modern, user-friendly interface designed to help hotel administrators manage their properties, rooms, bookings, and payments efficiently.

## Features

### 🎨 Modern Design
- **Gradient Backgrounds**: Beautiful gradient color schemes throughout
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic dark mode compatibility
- **Smooth Animations**: Polished transitions and hover effects
- **Intuitive Navigation**: Easy-to-use sidebar with clear icons and descriptions

### 📊 Dashboard
The dashboard provides a comprehensive overview of your hotel business:

#### Key Metrics
- **Total Revenue**: Track all paid bookings revenue
- **Confirmed Bookings**: See active confirmed reservations
- **Pending Bookings**: Monitor bookings awaiting confirmation
- **Total Bookings**: Overall booking count

#### Visual Analytics
- **Revenue Trend Chart**: Line chart showing monthly revenue patterns
- **Bookings by Status**: Pie chart displaying booking status distribution
- **Hotel Occupancy**: Bar chart comparing bookings across different hotels

### 🏨 Hotels Management
Manage all your hotel properties with ease:

#### Features
- **Add New Hotels**: Simple form to add hotel details
- **Edit Hotels**: Update hotel information anytime
- **Delete Hotels**: Remove hotels (with confirmation)
- **Search & Filter**: Quick search by name, city, state, or country
- **Visual Cards**: Beautiful hotel cards with images

#### Hotel Information
- Hotel name and description
- Full address (street, city, state, country)
- Contact number
- Hotel images
- Active status indicator

### 🛏️ Rooms Management
Complete room inventory control:

#### Features
- **Add Rooms**: Create new room listings with detailed information
- **Edit Rooms**: Update room details and pricing
- **Delete Rooms**: Remove rooms from inventory
- **Filter Options**: Filter by hotel and room status
- **Image Upload**: Support for multiple room images

#### Room Details
- Room number and type (Single, Double, Suite, Deluxe)
- Pricing and capacity
- Room status (Available, Occupied, Maintenance)
- Amenities list
- Room specifications (size, view, bed type, bathrooms)
- Meal plans
- Taxes and fees

### 📅 Bookings Management
Track and manage all reservations:

#### Features
- **Hotel Filter**: View bookings by specific hotel or all hotels
- **Status Filter**: Filter by confirmed, pending, or cancelled
- **Payment Filter**: Filter by paid, pending, or failed payments
- **Date Range**: Filter bookings by check-in date range
- **Detailed View**: See guest info, room details, and payment status

#### Booking Information
- Guest name and email
- Hotel and room details
- Check-in and check-out dates
- Booking status with color-coded badges
- Payment status with color-coded badges
- Total amount

### 💳 Payments Management
Monitor all financial transactions:

#### Features
- **Summary Cards**: Quick view of total, paid, and pending amounts
- **Search**: Find transactions by user or hotel
- **Multiple Filters**: Filter by status, hotel, and date range
- **Transaction History**: Complete payment records

#### Payment Information
- Transaction date
- User email
- Hotel name
- Payment method (Razorpay)
- Payment status with color-coded badges
- Amount in INR

## User Interface Elements

### Color Coding
- **Blue/Indigo**: Primary actions and active states
- **Green**: Confirmed/Paid status
- **Yellow/Orange**: Pending status
- **Red**: Cancelled/Failed status
- **Purple**: Additional information

### Navigation
- **Sidebar**: Sticky navigation with icons and descriptions
- **Quick Stats**: Real-time statistics in sidebar
- **Breadcrumbs**: Clear page hierarchy
- **Mobile Menu**: Hamburger menu for mobile devices

### Forms & Dialogs
- **Modal Dialogs**: Clean, focused forms for adding/editing
- **Field Validation**: Required fields marked with *
- **Image Preview**: See uploaded images before saving
- **Loading States**: Clear feedback during operations

## Best Practices

### Hotel Management
1. Always add high-quality images for better presentation
2. Keep descriptions clear and concise
3. Ensure contact information is up-to-date
4. Use consistent naming conventions

### Room Management
1. Upload multiple room images for better visibility
2. Keep amenities list updated
3. Set competitive pricing
4. Update room status regularly

### Booking Management
1. Review pending bookings daily
2. Follow up on failed payments
3. Monitor cancellation patterns
4. Keep track of check-in/check-out dates

### Payment Management
1. Reconcile payments regularly
2. Monitor pending payments
3. Track refunds for cancelled bookings
4. Generate reports for accounting

## Keyboard Shortcuts
- **Esc**: Close open dialogs
- **Tab**: Navigate through form fields
- **Enter**: Submit forms (when focused)

## Mobile Experience
The admin panel is fully responsive:
- Touch-friendly buttons and controls
- Optimized layouts for small screens
- Swipe-friendly tables
- Mobile-optimized forms

## Security Features
- **Authentication Required**: All admin routes protected
- **Role-Based Access**: Only admin users can access
- **Secure Logout**: Clear session data on logout
- **Token-Based Auth**: JWT authentication

## Tips for Efficiency
1. Use search and filters to find information quickly
2. Bookmark frequently used pages
3. Keep browser window maximized for best experience
4. Use keyboard navigation when possible
5. Regularly check dashboard for insights

## Troubleshooting

### Can't see hotels/rooms
- Ensure you're logged in as admin
- Check if hotels are assigned to your account
- Refresh the page

### Images not loading
- Verify image URLs are correct
- Check internet connection
- Try re-uploading images

### Filters not working
- Clear all filters and try again
- Refresh the page
- Check date format (YYYY-MM-DD)

## Support
For technical support or feature requests, contact your system administrator.

---

**Version**: 2.0  
**Last Updated**: 2024  
**Built with**: React, TypeScript, Tailwind CSS, shadcn/ui
