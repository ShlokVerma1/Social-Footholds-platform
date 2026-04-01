# Social Footholds - Creator Services Platform

A comprehensive platform for content creators to access professional services including video promotion, music promotion, channel SEO optimization, video editing, shorts creation, and web/blog services.

## 🚀 Features

### For Creators
- **User Registration & Authentication** - Secure email/password authentication
- **Service Ordering** - Access to 6 professional services:
  - Video Promotion (dynamic pricing based on views)
  - Music Promotion (Spotify & Apple Music)
  - Channel SEO Optimization (3/6/9/12 month plans)
  - Video Editing
  - Shorts Creation
  - Web Page & Blogs
- **Order Management** - Track all orders and their status
- **Payment System** - Integrated payment flow (PayPal/Stripe ready)

### For Admins
- **Dashboard Analytics** - Track users, orders, enquiries, and revenue
- **User Management** - View and manage all registered creators
- **Order Management** - Update order status and track progress
- **Enquiry Management** - Handle customer enquiries
- **Blog Management** - Create, edit, and publish blog posts
- **Service Management** - Update service pricing and details

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database
- **Motor** - Async MongoDB driver
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing

### Frontend
- **React 19** - Latest React version
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library

## 📦 Project Structure

```
/app/
├── backend/
│   ├── server.py           # Main FastAPI application
│   ├── init_admin.py       # Admin user creation script
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── pages/         # All page components
│   │   │   ├── creator/   # Creator portal pages
│   │   │   └── admin/     # Admin dashboard pages
│   │   ├── components/    # Shared components
│   │   ├── api.js        # API client
│   │   ├── AuthContext.js # Authentication context
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   ├── package.json      # Node dependencies
│   └── .env             # Environment variables
└── README.md
```

## 🔐 Default Credentials

### Admin Access
- **URL**: https://foothold-promotions.preview.emergentagent.com/admin
- **Email**: admin@socialfootholds.com
- **Password**: admin123

**⚠️ Important**: Change the admin password after first login!

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new creator account
- `POST /api/auth/login` - Login (creator or admin)
- `GET /api/auth/me` - Get current user

### Services
- `GET /api/services` - List all services
- `GET /api/services/{id}` - Get service details
- `PUT /api/services/{id}` - Update service (admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - List orders (filtered by user role)
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}/status` - Update order status (admin only)

### Pricing
- `POST /api/pricing/calculate` - Calculate service cost

### Payment
- `POST /api/payment/simulate` - Simulate payment (for testing)

### Enquiries
- `POST /api/enquiries` - Submit enquiry
- `GET /api/enquiries` - List enquiries (admin only)
- `PUT /api/enquiries/{id}/status` - Update enquiry status (admin only)

### Blogs
- `GET /api/blogs` - List published blogs
- `GET /api/blogs/{id}` - Get blog details
- `POST /api/blogs` - Create blog (admin only)
- `PUT /api/blogs/{id}` - Update blog (admin only)
- `DELETE /api/blogs/{id}` - Delete blog (admin only)

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - List all users

## 🎨 Service Pricing

Current placeholder pricing (updateable via admin dashboard):

1. **Video Promotion**: $10 per 1,000 views
2. **Music Promotion**: $299 per project
3. **Channel SEO Optimization**: $499/month
4. **Video Editing**: $150 per project
5. **Shorts Creation**: $50 per short
6. **Web Page & Blogs**: $599 per project

## 💳 Payment Integration

The platform is ready for PayPal and Stripe integration. Currently uses a simulated payment system for testing purposes.

### To Integrate Real Payments:

**PayPal:**
1. Get PayPal Client ID and Secret
2. Add to backend/.env
3. Update payment APIs in server.py

**Stripe:**
1. Get Stripe API keys
2. Install Stripe SDK: `pip install stripe`
3. Implement Stripe payment flow

## 🚦 Running the Application

All services are managed by Supervisor:

```bash
# Restart all services
sudo supervisorctl restart all

# Check status
sudo supervisorctl status

# Restart individual services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

## 📊 Database Collections

- **users** - User accounts (creators & admins)
- **services** - Service definitions and pricing
- **orders** - Service orders from creators
- **enquiries** - Contact form submissions
- **blogs** - Blog posts

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Role-based access control (creator/admin)
- CORS configuration
- Input validation with Pydantic

## 🌟 Key Features

### Dynamic Pricing Calculator
Video promotion and Channel SEO services have dynamic pricing based on:
- Video Promotion: Number of target views
- Channel SEO: Subscription duration (3/6/9/12 months)

### Order Tracking
Creators can track their orders with real-time status updates:
- Pending → Processing → Completed
- Payment status tracking

### Admin Dashboard
Comprehensive admin interface with:
- Real-time statistics
- User growth tracking
- Revenue monitoring
- Order management
- Blog publishing system

## 📝 Blog System

Admins can create and manage blog posts with:
- Rich text content
- Excerpt for listings
- Published/Draft status
- Author attribution
- Timestamp tracking

## 🎯 Future Enhancements

- [ ] Real PayPal & Stripe payment integration
- [ ] Email notifications (order confirmations, status updates)
- [ ] File upload for video/music files
- [ ] Creator portfolio section
- [ ] Review & rating system
- [ ] Advanced analytics dashboard
- [ ] Referral program
- [ ] Multi-language support

## 🧪 Testing

The application is fully functional and ready for testing:

1. **Public Pages**: Landing page, blog listing
2. **Creator Flow**: Register → Login → Browse Services → Create Order → Payment
3. **Admin Flow**: Admin login → Dashboard → Manage orders/users/blogs

## 📞 Support

For any issues or questions:
- Check the admin dashboard for system status
- Review API logs: `/var/log/supervisor/backend.*.log`
- Frontend logs: `/var/log/supervisor/frontend.err.log`

---

**Built with ❤️ for the creator economy**
Empowering 25,000+ creators worldwide to reach 1B+ audiences
