# Multistore Node.js Backend - AI Coding Agent Instructions

## Architecture Overview
This is a **multivendor e-commerce backend** with vendor registration, product management, and order processing. The app follows Express.js MVC pattern with MongoDB/Mongoose for data persistence.

**Key Components:**
- **Vendors**: Register, login with JWT auth, manage their products
- **Products**: CRUD operations, category-based filtering, popular/recommended flags
- **Orders**: Customer orders with vendor fulfillment, status tracking (processing → delivered/canceled)
- **Categories**: Hierarchical categories with subcategories

## Critical Project Patterns

### Router Mounting Pattern
All routes mount at `/api` prefix in `index.js`:
```javascript
app.use('/api', vendorRouter);  // /api/vendor/register, /api/vendor/login
app.use('/api', productRouter); // /api/add-product, /api/popular-products
app.use('/api', orderRouter);   // /api/orders, /api/vendor/orders/:vendorId
```

### Model-Route Co-location
**IMPORTANT**: Models are imported **inside route handlers** to avoid circular dependencies:
```javascript
// Inside route handler, not at file top
const Product = require('../models/product');
```

### Authentication Flow
- Vendor registration: bcrypt password hashing (salt rounds: 10)
- Login: JWT tokens with `vendorId`, `email`, `role` payload
- JWT secret: `process.env.JWT_SECRET || 'multistore_vendor_secret_key_2024'`
- Token expiry: 24 hours

### Order Status Management
Orders have **boolean flags**, not enum status:
```javascript
// Order states (all booleans)
processing: true,   // Default for new orders
delivered: false,
canceled: false
```

**Status Updates via PATCH routes:**
- `/api/vendor/orders/:orderId/processing` → `{processing: true, delivered: false}`
- `/api/vendor/orders/:orderId/delivered` → `{delivered: true, processing: false}`
- `/api/vendor/orders/:orderId/cancel` → `{canceled: true, processing: false, delivered: false}`

## Development Workflow

### Starting the Server
```bash
npm start        # Production (node index.js)
npm run dev      # Development (nodemon index.js)
```

### Database Connection
MongoDB Atlas connection string is **hardcoded** in `index.js` (line 17). Server starts only after successful DB connection.

### Route Debugging
Built-in request logging middleware captures all API calls:
```javascript
// Logs: METHOD /path - timestamp, headers, body
console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
```

### CORS Configuration
**Development-only** CORS setup allows all origins (`origin: true`) for Flutter web app compatibility.

## Key API Patterns

### Product Filtering
- **Popular products**: `{ popular: true }` query
- **Category products**: `{ category: category, popular: true }` (only popular items in categories)
- **Recommended products**: `{ recommended: true }` query

### Error Handling Standard
All routes follow this pattern:
```javascript
try {
  // Route logic
  res.status(200).json({ message: 'Success!', data });
} catch (error) {
  console.error('Error description:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: error.message 
  });
}
```

### Validation Pattern
Field validation before database operations:
```javascript
if (!requiredField1 || !requiredField2) {
  return res.status(400).json({
    message: 'Missing required fields',
    required: ['field1', 'field2']
  });
}
```

## File Structure Conventions
```
models/          # Mongoose schemas (vendor.js, product.js, order.js)
routes/          # Express routers (vendor.js, product.js, order.js)
index.js         # Main server file with all router mounting
```

## Integration Points
- **Flutter Frontend**: Expects JSON responses with `message` and data fields
- **MongoDB Atlas**: Connection string in `index.js` (consider environment variables for production)
- **Cloudinary**: Image URLs stored as strings in product `imageUrl` and `images` array fields

## Testing Quick Commands
```bash
# Test vendor registration
curl -X POST http://localhost:3000/api/vendor/register -H "Content-Type: application/json" -d '{"fullName":"Test","email":"test@test.com","password":"123456"}'

# Test product creation (requires vendorId from registration response)
curl -X POST http://localhost:3000/api/add-product -H "Content-Type: application/json" -d '{"productName":"Test Product","description":"Test","productPrice":100,"quantity":10,"imageUrl":"url","category":"Test","subCategory":"Test","vendorId":"VENDOR_ID","fullName":"Test Vendor"}'
```
