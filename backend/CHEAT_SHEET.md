# Backend Development Cheat Sheet

## ⚡ Quick Commands

```bash
# Install dependencies
pnpm install

# Start development server (dengan auto-reload)
pnpm dev

# Start production server
pnpm start

# Lihat available scripts
pnpm run
```

## 🔌 API Endpoints Quick Reference

### Authentication
```
POST   /api/auth/register    # Register user baru
POST   /api/auth/login       # Login
GET    /api/auth/me          # Get current user (perlu token)
POST   /api/auth/logout      # Logout
```

### Test Management
```
POST   /api/tests/submit                  # Submit test (21 answers)
GET    /api/tests/student/:student_id    # Get all tests
GET    /api/tests/detail/:test_id        # Get test detail
GET    /api/tests/statistics/:student_id # Get statistics
DELETE /api/tests/:test_id               # Delete test
```

### Health & Debug
```
GET    /api/health    # Health check
GET    /              # API info
```

## 📝 Request Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

### Submit Test
```bash
curl -X POST http://localhost:5000/api/tests/submit \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "answers": [0,1,2,0,1,1,0,2,1,0,1,2,0,1,0,1,2,0,1,0,1]
  }'
```

### Get Tests
```bash
curl http://localhost:5000/api/tests/student/1
```

### Get Test Detail (dengan token)
```bash
curl http://localhost:5000/api/tests/detail/test-abc12345 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🗂️ File Organization

```
src/
├── config/db.js              # Database connection
├── controllers/              # Business logic
│   ├── authController.js
│   └── testController.js
├── middleware/               # JWT, CORS, etc
│   └── authMiddleware.js
├── routes/                   # API endpoints
│   ├── authRoutes.js
│   └── testRoutes.js
├── services/                 # Utilities
│   └── fuzzyService.js       # Fuzzy logic calculation
├── app.js                    # Express config
└── server.js                 # Entry point
```

## 🔑 Important Functions

### Fuzzy Logic (services/fuzzyService.js)
```javascript
// Calculate depression score from 21 answers
calculateDepressionScore(answers) // Returns 0-42

// Get depression level
getDepressionLevel(score) // Returns level name

// Calculate fuzzy logic
calculateFuzzy(answers) // Returns { score, level, fuzzy_score }

// Get description
getDepressionDescription(level) // Returns description text
```

### Auth Middleware
```javascript
// Verify JWT token
verifyToken(req, res, next)

// Check user role
authorizeRole(...allowedRoles)(req, res, next)

// Error handler
errorHandler(err, req, res, next)
```

## 🔒 Authentication Flow

1. **Register**: POST /api/auth/register → Get token
2. **Login**: POST /api/auth/login → Get token
3. **Use Token**: Add header `Authorization: Bearer <token>`
4. **Verify**: Middleware validates token → Access granted
5. **Logout**: Remove token from client (localStorage)

## 📊 Depression Score Levels

| Score | Level | Recommendation |
|-------|-------|----------------|
| 0-9 | Normal | Good mental health |
| 10-13 | Ringan | Self-care & monitoring |
| 14-20 | Sedang | Consult professional |
| 21-27 | Parah | Seek immediate help |
| 28+ | Sangat Parah | Emergency help needed |

## 🐛 Common Errors & Solutions

### "Cannot find module 'express'"
```bash
# Solution: Install dependencies
pnpm install
```

### "ECONNREFUSED: MySQL"
```bash
# Solution: Start MySQL server
# Windows: net start MySQL80
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql
```

### "Access denied for user"
```bash
# Solution: Update DB credentials in .env
DB_USER=your_username
DB_PASSWORD=your_password
```

### "Token is invalid"
```bash
# Solution: 
# 1. Check JWT_SECRET is same in .env
# 2. Token not expired (24h)
# 3. Token format: Bearer <token>
```

### "CORS error"
```javascript
// Solution: Check app.js CORS config
// Add your frontend URL to whitelist:
origin: [
  'http://localhost:5173',
  'http://localhost:3000'
]
```

## 📚 Environment Variables

```env
DB_HOST=localhost              # MySQL host
DB_USER=root                   # MySQL user
DB_PASSWORD=password           # MySQL password
DB_NAME=depresi               # Database name
PORT=5000                      # Server port
NODE_ENV=development           # development/production
JWT_SECRET=secret-key          # JWT signing key
FRONTEND_URL=http://localhost:5173  # Frontend origin
```

## 🧪 Testing Workflow

```bash
# 1. Start server
pnpm dev

# 2. In another terminal, test endpoints
curl http://localhost:5000/api/health

# 3. Register user
# (see Request Examples above)

# 4. Login and save token
# (use token in Authorization header)

# 5. Submit test
# (21 answers, each 0-3)

# 6. View results
# (GET /api/tests/student/:id)
```

## 🎯 Development Tips

1. **Auto-reload**: Use `pnpm dev` for development
2. **Check logs**: Terminal shows all requests with timestamps
3. **DB queries**: Use mysql2/promise for async queries
4. **Error handling**: All errors caught and logged
5. **CORS ready**: No need to configure, already whitelisted for frontend

## 📦 Dependencies Quick Reference

```json
{
  "express": "Web framework",
  "mysql2": "MySQL driver with async",
  "jsonwebtoken": "JWT token handling",
  "bcryptjs": "Password hashing",
  "cors": "Cross-origin requests",
  "dotenv": "Environment variables",
  "uuid": "Unique IDs",
  "nodemon": "Auto-reload (dev only)"
}
```

## 🚀 Production Checklist

- [ ] NODE_ENV=production
- [ ] Strong JWT_SECRET (32+ chars)
- [ ] Secure DB_PASSWORD
- [ ] Disable debug logging
- [ ] Setup database backups
- [ ] Enable HTTPS/SSL
- [ ] Setup monitoring
- [ ] Configure firewall
- [ ] Regular security updates
- [ ] Database replicas if needed

## 📞 Support Resources

- Full API docs: `API_DOCUMENTATION.md`
- Setup guide: `BACKEND_SETUP.md`
- Integration guide: `INTEGRATION_GUIDE.md`
- Backend summary: `BACKEND_SUMMARY.md`

---

**Last Updated**: May 2, 2026
**Version**: 1.0.0
