# RateHub Authentication API Documentation

Base URL: `http://localhost:5000/api`

All JSON requests must have `Content-Type: application/json`.
Protected endpoints require `Authorization: Bearer <JWT_TOKEN>`.

---

## Endpoints

### 1. Register User
- **Method**: `POST`
- **URL**: `/auth/register`
- **Access**: Public
- **Description**: Registers a new normal user with required profile validations.
- **Request Body**:
```json
{
  "name": "Jane Customer Doe 12345",
  "email": "jane@example.com",
  "address": "123 Market Street, Suite 400, New York",
  "password": "Password123!"
}
```
- **Validation Rules**:
  - `name`: 20 to 60 characters
  - `email`: valid email format
  - `address`: max 400 characters
  - `password`: 8-16 characters, >= 1 uppercase letter, >= 1 special character
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Jane Customer Doe 12345",
      "email": "jane@example.com",
      "address": "123 Market Street, Suite 400, New York",
      "role": "NORMAL_USER",
      "createdAt": "2026-09-01T..."
    },
    "token": "jwt_token_string"
  }
}
```

---

### 2. Login User
- **Method**: `POST`
- **URL**: `/auth/login`
- **Access**: Public
- **Description**: Unified login endpoint for all user roles (SYSTEM_ADMIN, STORE_OWNER, NORMAL_USER).
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "UserPassword123!"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Regular Customer Jackson",
      "email": "user@example.com",
      "address": "45 North Avenue...",
      "role": "NORMAL_USER",
      "createdAt": "2026-09-01T...",
      "storeInfo": null
    },
    "token": "jwt_token_string"
  }
}
```

---

### 3. Logout User
- **Method**: `POST`
- **URL**: `/auth/logout`
- **Access**: Authenticated
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4. Get Current Profile
- **Method**: `GET`
- **URL**: `/auth/profile`
- **Access**: Authenticated
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Jonathan Storekeeper Miller",
    "email": "owner@brewnbloom.com",
    "address": "100 Market Street",
    "role": "STORE_OWNER",
    "createdAt": "2026-09-01T...",
    "storeInfo": {
      "stores": [
        {
          "id": "store-uuid",
          "name": "Brew & Bloom Specialty Cafe",
          "address": "100 Market Street",
          "ratingsCount": 1
        }
      ],
      "totalRatings": 1,
      "averageRating": "5.0"
    }
  }
}
```

---

### 5. Forgot Password
- **Method**: `POST`
- **URL**: `/auth/forgot-password`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "user@example.com"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "message": "Password reset token generated successfully.",
    "resetToken": "hex_token_string",
    "resetUrl": "/reset-password?token=hex_token_string"
  }
}
```

---

### 6. Reset Password
- **Method**: `POST`
- **URL**: `/auth/reset-password`
- **Access**: Public
- **Request Body**:
```json
{
  "token": "hex_token_string",
  "newPassword": "NewPassword123!"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Password has been reset successfully. Please log in with your new password."
}
```

---

### 7. Change Password
- **Method**: `POST`
- **URL**: `/auth/change-password`
- **Access**: Authenticated
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "currentPassword": "UserPassword123!",
  "newPassword": "NewPassword456!"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```
