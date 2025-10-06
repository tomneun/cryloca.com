
# Cryloca.com - No Limit Center

Best Stuff Only Crypto Can Buy - A decentralized anonymous marketplace for digital goods.

## Features

- **Anonymous Sessions**: Pseudonym-based authentication without personal data
- **Digital Marketplace**: Buy and sell digital products (e-books, music, software, images)
- **Tor Integration Ready**: Designed to run as a Tor Hidden Service
- **Monero Payments**: Cryptocurrency payment integration
- **No Registration**: No email, password, or personal information required
- **LocalStorage Persistence**: Session and cart data stored locally
- **Dark Theme**: Privacy-focused UI design

## Frontend Structure

- **React + TypeScript**: Modern frontend framework
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Custom Hooks**: Session, cart, and product management
- **Responsive Design**: Mobile and desktop compatible

## Pages

- `/` - Landing page and pseudonym creation
- `/my-shop` - Personal shop dashboard
- `/shop/:pseudonym` - Public shop view
- `/shop/:pseudonym/product/:id` - Product details
- `/checkout` - Shopping cart and payment
- `/chat/:withPseudonym` - Anonymous messaging (optional)

## Backend Integration Points

The frontend is ready for backend integration with the following API endpoints:

### Authentication
- Session management via localStorage (ready for backend session validation)

### Products
- `GET /api/products` - List all public products
- `POST /api/products` - Create new product (with file upload)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/:id` - Get product details

### Shops
- `GET /api/shops` - List all shops
- `GET /api/shops/:pseudonym` - Get shop details and products

### Orders/Checkout
- `POST /api/checkout/create` - Create order and generate Monero address
- `POST /api/checkout/confirm` - Confirm payment with transaction hash
- `GET /download/:orderId/:token` - Download purchased content

### Chat (Optional)
- `POST /api/chat/send` - Send encrypted message
- `GET /api/chat/fetch` - Retrieve messages

## Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Backend Requirements

To make this a fully functional marketplace, you'll need to implement:

1. **Node.js/Express Backend**
   - SQLite database for products, orders, shops
   - File upload handling (Multer)
   - Monero wallet integration
   - Session management

2. **Tor Hidden Service Setup**
   - Configure torrc for hidden service
   - Run backend on localhost:3000
   - Generate .onion address

3. **Database Schema**
   ```sql
   shops(pseudonym TEXT PRIMARY KEY, description TEXT, createdAt TEXT)
   products(id TEXT PRIMARY KEY, pseudonym TEXT, title TEXT, description TEXT, price REAL, currency TEXT, images TEXT, stock INTEGER, category TEXT, visibility INTEGER, createdAt TEXT, updatedAt TEXT)
   orders(id TEXT PRIMARY KEY, pseudonym_buyer TEXT, pseudonym_seller TEXT, productId TEXT, quantity INTEGER, price REAL, currency TEXT, paymentAddress TEXT, txHash TEXT, status TEXT, createdAt TEXT, updatedAt TEXT)
   chats(id TEXT PRIMARY KEY, fromPseudonym TEXT, toPseudonym TEXT, ciphertext TEXT, createdAt TEXT)
   ```

4. **Monero Integration**
   - monero-wallet-rpc for payment processing
   - Address generation and transaction verification
   - Download token generation after payment confirmation

## Deployment

This frontend can be deployed as static files served by your Node.js backend or any web server configured to work with Tor Hidden Services.

## Security Notes

- All external dependencies removed for Tor compatibility
- No CDN requests - everything served locally
- Pseudonym-based sessions for anonymity
- Designed for end-to-end encryption where needed
- No logging of sensitive user data

## License

MIT License - See LICENSE file for details
