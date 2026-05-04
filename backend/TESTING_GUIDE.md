# Backend API Testing Guide

Panduan lengkap untuk testing semua endpoint backend menggunakan curl atau Postman.

## 📌 Prerequisites

- Backend running: `pnpm dev` di folder backend
- Backend URL: `http://localhost:5000`
- Database: `depresi` sudah setup dengan tabel

## 🧪 Testing Flow

Ikuti testing secara berurutan untuk mendapatkan token yang diperlukan untuk endpoint berikutnya.

---

## 1️⃣ Health Check

**Test apakah server running**

```bash
curl http://localhost:5000/api/health
```

**Response (Expected):**
```json
{
  "message": "Server is running",
  "timestamp": "2024-05-02T10:30:00.000Z"
}
```

**Status**: ✅ Server running
**Next**: Proceed ke registration

---

## 2️⃣ Register New User

**Register sebagai student**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@example.com",
    "password": "password123",
    "role": "student"
  }'
```

**Response (Expected):**
```json
{
  "message": "Registrasi berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "student1@example.com",
    "role": "student"
  }
}
```

**⚠️ Save token dari response!** (Anda akan membutuhkannya untuk request berikutnya)

```bash
# Save untuk digunakan di curl berikutnya
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
STUDENT_ID=1
```

**Atau di Postman:**
1. Copy token dari response
2. Ke tab Authorization
3. Select "Bearer Token"
4. Paste token

---

## 3️⃣ Login (Alternative)

**Jika ingin test login sebagai ganti register**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@example.com",
    "password": "password123"
  }'
```

**Response (Expected):**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "student1@example.com",
    "role": "student"
  }
}
```

---

## 4️⃣ Get Current User

**Verify token dengan mengambil current user**

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Replace `$TOKEN` dengan token dari step 2 atau 3**

**Response (Expected):**
```json
{
  "user": {
    "id": 1,
    "email": "student1@example.com",
    "role": "student"
  }
}
```

**Status**: ✅ Token valid
**Next**: Submit test

---

## 5️⃣ Submit DASS-21 Test

**Submit 21 jawaban untuk student**

```bash
curl -X POST http://localhost:5000/api/tests/submit \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "answers": [0, 1, 2, 0, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1, 0, 1, 2, 0, 1, 0, 1]
  }'
```

**Catatan:**
- `student_id`: Harus cocok dengan user yang login
- `answers`: Array dengan exactly 21 elemen
- Setiap elemen: 0, 1, 2, atau 3
- Jangan gunakan string, harus number!

**Response (Expected):**
```json
{
  "message": "Test berhasil disimpan",
  "testResult": {
    "test_id": "test-a1b2c3d4",
    "student_id": 1,
    "score": 16,
    "level": "Sedang",
    "fuzzy_score": 1.50,
    "description": "Anda mengalami gejala depresi sedang. Disarankan untuk berkonsultasi dengan profesional kesehatan mental.",
    "timestamp": "2024-05-02T10:30:00.000Z"
  }
}
```

**⚠️ Save test_id dari response!**
```bash
TEST_ID="test-a1b2c3d4"
```

**Status**: ✅ Test saved to database
**Next**: View test results

---

## 6️⃣ Get All Tests for Student

**Ambil semua test yang pernah dilakukan student**

```bash
curl http://localhost:5000/api/tests/student/1
```

**Response (Expected):**
```json
{
  "message": "Test results berhasil diambil",
  "count": 1,
  "results": [
    {
      "test_id": "test-a1b2c3d4",
      "student_id": 1,
      "date": "2024-05-02 10:30:00",
      "score": 16,
      "level": "Sedang",
      "fuzzy_score": 1.50,
      "answers": [0, 1, 2, 0, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1, 0, 1, 2, 0, 1, 0, 1]
    }
  ]
}
```

---

## 7️⃣ Get Test Detail

**Ambil detail satu test dengan test_id**

```bash
curl http://localhost:5000/api/tests/detail/test-a1b2c3d4
```

**Response (Expected):**
```json
{
  "message": "Test detail berhasil diambil",
  "result": {
    "test_id": "test-a1b2c3d4",
    "student_id": 1,
    "date": "2024-05-02 10:30:00",
    "score": 16,
    "level": "Sedang",
    "fuzzy_score": 1.50,
    "answers": [0, 1, 2, 0, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1, 0, 1, 2, 0, 1, 0, 1],
    "description": "Anda mengalami gejala depresi sedang..."
  }
}
```

---

## 8️⃣ Get Test Statistics

**Ambil statistik semua test untuk student**

```bash
curl http://localhost:5000/api/tests/statistics/1
```

**Response (Expected):**
```json
{
  "message": "Statistik test berhasil diambil",
  "statistics": {
    "total_tests": 1,
    "avg_score": 16.00,
    "min_score": 16,
    "max_score": 16,
    "normal_count": 0,
    "mild_count": 0,
    "moderate_count": 1,
    "severe_count": 0,
    "extremely_severe_count": 0
  }
}
```

---

## 9️⃣ Delete Test

**Hapus satu test**

```bash
curl -X DELETE http://localhost:5000/api/tests/test-a1b2c3d4
```

**Response (Expected):**
```json
{
  "message": "Test berhasil dihapus"
}
```

**Status**: ✅ Test deleted
**Next**: Verify dengan get all tests (seharusnya count jadi 0)

---

## 🔟 Logout

**Logout user (client-side operation)**

```bash
curl -X POST http://localhost:5000/api/auth/logout
```

**Response (Expected):**
```json
{
  "message": "Logout berhasil. Hapus token dari localStorage di frontend."
}
```

**Status**: ✅ Complete

---

## 🧬 Test Scenarios

### Scenario 1: Complete User Journey
```
1. Register → 2. Get Me → 3. Submit Test → 4. Get Results → 5. Logout
```

### Scenario 2: Multiple Tests
```
1. Login → 2. Submit Test (Normal) → 3. Submit Test (Sedang) → 4. Get Statistics
```

### Scenario 3: Admin View
```
1. Login as admin → 2. Get student tests → 3. View statistics → 4. Delete test
```

---

## 🐛 Error Responses

### 400 - Bad Request
```json
{
  "message": "Email dan password harus diisi"
}
```
**Cause**: Missing required fields

### 404 - Not Found
```json
{
  "message": "Email tidak terdaftar"
}
```
**Cause**: User doesn't exist

### 409 - Conflict
```json
{
  "message": "Email sudah terdaftar"
}
```
**Cause**: Email already registered

### 401 - Unauthorized
```json
{
  "message": "Token tidak ditemukan"
}
```
**Cause**: Missing Authorization header

### 500 - Server Error
```json
{
  "message": "Terjadi kesalahan saat ...",
  "error": "Detail error message"
}
```
**Cause**: Server-side error

---

## 🛠️ Testing dengan Postman

### Import Collection

Buat collection baru di Postman dengan requests berikut:

```
Depression Detection API
├── Auth
│   ├── Register
│   ├── Login
│   ├── Get Me
│   └── Logout
└── Tests
    ├── Submit Test
    ├── Get All Tests
    ├── Get Test Detail
    ├── Get Statistics
    └── Delete Test
```

### Setup Environment Variables

Buat environment dengan variables:
```
base_url = http://localhost:5000
token = (akan di-set dari response register/login)
student_id = 1
test_id = (akan di-set dari response submit test)
```

### Use Pre-request Script

Di Postman tab "Pre-request Script" untuk auto-set variables:
```javascript
// Save token dari register/login response
if (pm.response.code === 201 || pm.response.code === 200) {
  var jsonData = pm.response.json();
  if (jsonData.token) {
    pm.environment.set("token", jsonData.token);
  }
  if (jsonData.testResult) {
    pm.environment.set("test_id", jsonData.testResult.test_id);
  }
}
```

---

## 🧪 Bash Script untuk Automated Testing

**Simpan sebagai `test-backend.sh`:**

```bash
#!/bin/bash

API="http://localhost:5000/api"
EMAIL="test$(date +%s)@example.com"
PASSWORD="password123"
ROLE="student"

echo "🧪 Testing Depression Detection API"
echo "===================================="

# 1. Health Check
echo -e "\n1️⃣ Health Check..."
curl -s $API/health | jq '.'

# 2. Register
echo -e "\n2️⃣ Register..."
REGISTER=$(curl -s -X POST $API/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"role\": \"$ROLE\"
  }")

echo $REGISTER | jq '.'
TOKEN=$(echo $REGISTER | jq -r '.token')
STUDENT_ID=$(echo $REGISTER | jq -r '.user.id')

echo "Token: $TOKEN"
echo "Student ID: $STUDENT_ID"

# 3. Get Current User
echo -e "\n3️⃣ Get Current User..."
curl -s $API/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 4. Submit Test
echo -e "\n4️⃣ Submit Test..."
TEST=$(curl -s -X POST $API/tests/submit \
  -H "Content-Type: application/json" \
  -d "{
    \"student_id\": $STUDENT_ID,
    \"answers\": [0,1,2,0,1,1,0,2,1,0,1,2,0,1,0,1,2,0,1,0,1]
  }")

echo $TEST | jq '.'
TEST_ID=$(echo $TEST | jq -r '.testResult.test_id')

echo "Test ID: $TEST_ID"

# 5. Get All Tests
echo -e "\n5️⃣ Get All Tests..."
curl -s $API/tests/student/$STUDENT_ID | jq '.'

# 6. Get Test Detail
echo -e "\n6️⃣ Get Test Detail..."
curl -s $API/tests/detail/$TEST_ID | jq '.'

# 7. Get Statistics
echo -e "\n7️⃣ Get Statistics..."
curl -s $API/tests/statistics/$STUDENT_ID | jq '.'

# 8. Delete Test
echo -e "\n8️⃣ Delete Test..."
curl -s -X DELETE $API/tests/$TEST_ID | jq '.'

# 9. Verify Deletion
echo -e "\n9️⃣ Verify Deletion..."
curl -s $API/tests/student/$STUDENT_ID | jq '.'

echo -e "\n✅ Testing Complete!"
```

**Jalankan:**
```bash
bash test-backend.sh
```

---

## 🔍 Expected Score Ranges

Test dengan berbagai combinations untuk mendapatkan different levels:

### Normal (0-9)
```json
{
  "answers": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}
```
Result: Score 0, Level "Normal"

### Ringan (10-13)
```json
{
  "answers": [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}
```
Result: Score 4, Level "Ringan" (kurang akurat, need lebih banyak)

### Sedang (14-20)
```json
{
  "answers": [0, 1, 2, 0, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1, 0, 1, 2, 0, 1, 0, 1]
}
```
Result: Score 16, Level "Sedang"

### Berat (21-27)
```json
{
  "answers": [2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1]
}
```
Result: Score 40, Level "Berat"

### Sangat Berat (28+)
```json
{
  "answers": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
}
```
Result: Score 42, Level "Sangat Berat"

---

## 📊 Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK - Request succeeded | GET endpoint success |
| 201 | Created - Resource created | Register/Submit success |
| 400 | Bad Request - Invalid input | Missing fields |
| 401 | Unauthorized - No/invalid token | Token missing |
| 403 | Forbidden - Access denied | Wrong role |
| 404 | Not Found - Resource doesn't exist | Test ID invalid |
| 409 | Conflict - Resource exists | Email already registered |
| 500 | Server Error - Backend issue | Database error |

---

## 💡 Tips & Tricks

### Using Environment Variables in curl
```bash
# Set variables
TOKEN="your_token"
STUDENT_ID=1
TEST_ID="test-xyz"

# Use in curl
curl $API/tests/student/$STUDENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Pretty Print JSON Response
```bash
# Install jq first: apt-get install jq
curl http://localhost:5000/api/health | jq '.'

# Or use python
curl http://localhost:5000/api/health | python -m json.tool
```

### Save Response to File
```bash
curl -s http://localhost:5000/api/health -o response.json
cat response.json | jq '.'
```

### Test Multiple Endpoints Sequentially
```bash
# Create all.sh with multiple curl commands
# then run: bash all.sh
```

---

## 🎯 Testing Checklist

- [ ] Health check returns 200
- [ ] Register creates new user
- [ ] Login returns valid token
- [ ] Get Me works with token
- [ ] Submit test with 21 answers
- [ ] Test saved correctly in database
- [ ] Get all tests returns array
- [ ] Get test detail returns full data
- [ ] Statistics calculated correctly
- [ ] Delete test works
- [ ] Invalid token returns 401
- [ ] Invalid email returns 404
- [ ] Duplicate email returns 409

---

## 📞 Troubleshooting Testing

### "Connection refused"
- Backend not running
- Run: `pnpm dev` in backend folder
- Check port 5000 is listening

### "Invalid JSON"
- Ensure answers is array, not string
- Each answer must be number, not string
- Total 21 answers required

### "Token invalid"
- Token expired after 24 hours
- Copy-paste token correctly
- Include "Bearer " prefix

### "Database error"
- MySQL not running
- Database depresi doesn't exist
- Wrong DB credentials in .env

---

**Last Updated**: May 2, 2026
**Backend Version**: 1.0.0
**Status**: Ready for Testing ✅
