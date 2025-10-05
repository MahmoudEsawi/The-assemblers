# 📚 The Assemblers API Documentation

## Overview

The Assemblers API is a RESTful web service built with .NET 9.0 that provides endpoints for managing home services, assemblers, bookings, and user interactions. The API follows Clean Architecture principles and provides comprehensive CRUD operations for all entities.

## Base URL

```
http://localhost:5161/api
```

## Authentication

Currently, the API uses simple email/password authentication. Future versions will implement JWT-based authentication.

## Response Format

All API responses are in JSON format with the following structure:

### Success Response
```json
{
  "data": { ... },
  "message": "Success",
  "statusCode": 200
}
```

### Error Response
```json
{
  "error": "Error message",
  "statusCode": 400
}
```

## Data Models

### User
```json
{
  "id": 1,
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "profileImage": "",
  "role": "Customer",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Assembler
```json
{
  "id": 1,
  "userId": 3,
  "user": { ... },
  "specialization": "Furniture Assembly",
  "description": "Expert in IKEA and other furniture assembly",
  "location": "New York, NY",
  "coverImage": "",
  "averageRating": 4.8,
  "isVerified": true,
  "services": [ ... ],
  "availability": [ ... ],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Service
```json
{
  "id": 1,
  "categoryId": 1,
  "assemblerId": 1,
  "category": { ... },
  "assembler": { ... },
  "name": "IKEA Furniture Assembly",
  "description": "Professional IKEA furniture assembly service",
  "price": 25.00,
  "imageUrl": "/assets/services/furniture.jpg",
  "averageRating": 4.8,
  "reviewCount": 15,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Booking
```json
{
  "id": 1,
  "customerId": 1,
  "assemblerId": 1,
  "serviceId": 1,
  "customer": { ... },
  "assembler": { ... },
  "service": { ... },
  "date": "2024-10-10T10:00:00Z",
  "startTime": "10:00:00",
  "endTime": "12:00:00",
  "notes": "Need help assembling gaming PC",
  "status": "Pending",
  "totalPrice": 50.00,
  "createdAt": "2024-10-01T00:00:00Z"
}
```

### Review
```json
{
  "id": 1,
  "customerId": 1,
  "assemblerId": 1,
  "bookingId": 1,
  "customer": { ... },
  "assembler": { ... },
  "booking": { ... },
  "rating": 5,
  "comment": "Excellent service! Mike was professional and completed the job quickly.",
  "createdAt": "2024-10-10T00:00:00Z"
}
```

### Category
```json
{
  "id": 1,
  "name": "Furniture Assembly",
  "description": "Professional furniture assembly services",
  "image": "/assets/services/furniture.jpg",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### DayAvailability
```json
{
  "id": 1,
  "assemblerId": 1,
  "dayOfWeek": 1,
  "start": "09:00:00",
  "end": "17:00:00",
  "available": true
}
```

## API Endpoints

### Users

#### Get All Users
```http
GET /api/users
```

**Response**: Array of User objects

#### Get User by ID
```http
GET /api/users/{id}
```

**Parameters**:
- `id` (int): User ID

**Response**: User object

#### Create User
```http
POST /api/users
```

**Request Body**:
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "123 Main St",
  "role": "Customer"
}
```

**Response**: Created User object

#### User Login
```http
POST /api/users/login
```

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**: User object or 401 Unauthorized

#### Check Email Exists
```http
GET /api/users/email-exists/{email}
```

**Parameters**:
- `email` (string): Email address

**Response**: Boolean

### Assemblers

#### Get All Assemblers
```http
GET /api/assemblers
```

**Response**: Array of Assembler objects with related data

#### Get Assembler by ID
```http
GET /api/assemblers/{id}
```

**Parameters**:
- `id` (int): Assembler ID

**Response**: Assembler object with related data

#### Create Assembler
```http
POST /api/assemblers
```

**Request Body**:
```json
{
  "userId": 3,
  "specialization": "Furniture Assembly",
  "description": "Expert in IKEA and other furniture assembly",
  "location": "New York, NY",
  "coverImage": ""
}
```

**Response**: Created Assembler object

#### Get Assembler by User ID
```http
GET /api/assemblers/by-user/{userId}
```

**Parameters**:
- `userId` (int): User ID

**Response**: Assembler object

#### Get Assemblers by Specialization
```http
GET /api/assemblers/specialization/{specialization}
```

**Parameters**:
- `specialization` (string): Specialization keyword

**Response**: Array of Assembler objects

#### Get Available Assemblers
```http
GET /api/assemblers/available?date={date}&startTime={startTime}&endTime={endTime}
```

**Parameters**:
- `date` (datetime): Booking date
- `startTime` (timespan): Start time
- `endTime` (timespan): End time

**Response**: Array of available Assembler objects

### Services

#### Get All Services
```http
GET /api/services
```

**Response**: Array of Service objects with related data

#### Get Service by ID
```http
GET /api/services/{id}
```

**Parameters**:
- `id` (int): Service ID

**Response**: Service object with related data

#### Create Service
```http
POST /api/services
```

**Request Body**:
```json
{
  "categoryId": 1,
  "assemblerId": 1,
  "name": "IKEA Furniture Assembly",
  "description": "Professional IKEA furniture assembly service",
  "price": 25.00,
  "imageUrl": "/assets/services/furniture.jpg"
}
```

**Response**: Created Service object

#### Get Services by Category
```http
GET /api/services/category/{categoryId}
```

**Parameters**:
- `categoryId` (int): Category ID

**Response**: Array of Service objects

#### Get Services by Assembler
```http
GET /api/services/assembler/{assemblerId}
```

**Parameters**:
- `assemblerId` (int): Assembler ID

**Response**: Array of Service objects

#### Search Services
```http
GET /api/services/search?q={query}
```

**Parameters**:
- `q` (string): Search query

**Response**: Array of matching Service objects

### Bookings

#### Get All Bookings
```http
GET /api/bookings
```

**Response**: Array of Booking objects with related data

#### Get Booking by ID
```http
GET /api/bookings/{id}
```

**Parameters**:
- `id` (int): Booking ID

**Response**: Booking object with related data

#### Create Booking
```http
POST /api/bookings
```

**Request Body**:
```json
{
  "customerId": 1,
  "assemblerId": 1,
  "serviceId": 1,
  "date": "2024-10-10T10:00:00Z",
  "startTime": "10:00:00",
  "endTime": "12:00:00",
  "notes": "Need help assembling gaming PC"
}
```

**Response**: Created Booking object

#### Update Booking Status
```http
PUT /api/bookings/{id}/status
```

**Parameters**:
- `id` (int): Booking ID

**Request Body**:
```json
{
  "status": "Confirmed"
}
```

**Response**: Updated Booking object

#### Get Bookings by Customer
```http
GET /api/bookings/customer/{customerId}
```

**Parameters**:
- `customerId` (int): Customer ID

**Response**: Array of Booking objects

#### Get Bookings by Assembler
```http
GET /api/bookings/assembler/{assemblerId}
```

**Parameters**:
- `assemblerId` (int): Assembler ID

**Response**: Array of Booking objects

#### Check Availability
```http
GET /api/bookings/availability?assemblerId={assemblerId}&date={date}&startTime={startTime}&endTime={endTime}
```

**Parameters**:
- `assemblerId` (int): Assembler ID
- `date` (datetime): Booking date
- `startTime` (timespan): Start time
- `endTime` (timespan): End time

**Response**: Boolean indicating availability

### Reviews

#### Get All Reviews
```http
GET /api/reviews
```

**Response**: Array of Review objects with related data

#### Get Review by ID
```http
GET /api/reviews/{id}
```

**Parameters**:
- `id` (int): Review ID

**Response**: Review object with related data

#### Create Review
```http
POST /api/reviews
```

**Request Body**:
```json
{
  "customerId": 1,
  "assemblerId": 1,
  "bookingId": 1,
  "rating": 5,
  "comment": "Excellent service!"
}
```

**Response**: Created Review object

#### Get Reviews by Assembler
```http
GET /api/reviews/assembler/{assemblerId}
```

**Parameters**:
- `assemblerId` (int): Assembler ID

**Response**: Array of Review objects

#### Get Average Rating
```http
GET /api/reviews/assembler/{assemblerId}/average-rating
```

**Parameters**:
- `assemblerId` (int): Assembler ID

**Response**: Decimal average rating

### Categories

#### Get All Categories
```http
GET /api/categories
```

**Response**: Array of Category objects

#### Get Category by ID
```http
GET /api/categories/{id}
```

**Parameters**:
- `id` (int): Category ID

**Response**: Category object

#### Create Category
```http
POST /api/categories
```

**Request Body**:
```json
{
  "name": "Furniture Assembly",
  "description": "Professional furniture assembly services",
  "image": "/assets/services/furniture.jpg"
}
```

**Response**: Created Category object

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

Currently, no rate limiting is implemented. Future versions will include rate limiting for API protection.

## CORS

The API supports CORS for the following origins:
- `http://localhost:4200` (Angular development)
- `http://localhost:49868` (Angular alternative port)

## Swagger Documentation

Interactive API documentation is available at:
```
http://localhost:5161/swagger
```

## Examples

### Complete Booking Flow

1. **Get Available Services**
```http
GET /api/services
```

2. **Get Assemblers for a Service**
```http
GET /api/services/assembler/1
```

3. **Check Availability**
```http
GET /api/bookings/availability?assemblerId=1&date=2024-10-10&startTime=10:00:00&endTime=12:00:00
```

4. **Create Booking**
```http
POST /api/bookings
{
  "customerId": 1,
  "assemblerId": 1,
  "serviceId": 1,
  "date": "2024-10-10T10:00:00Z",
  "startTime": "10:00:00",
  "endTime": "12:00:00",
  "notes": "Need help assembling gaming PC"
}
```

5. **Update Booking Status**
```http
PUT /api/bookings/1/status
{
  "status": "Confirmed"
}
```

6. **Create Review**
```http
POST /api/reviews
{
  "customerId": 1,
  "assemblerId": 1,
  "bookingId": 1,
  "rating": 5,
  "comment": "Excellent service!"
}
```

## Testing

### Using cURL

```bash
# Get all services
curl -X GET "http://localhost:5161/api/services"

# Create a new user
curl -X POST "http://localhost:5161/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "address": "123 Test St",
    "role": "Customer"
  }'

# Login
curl -X POST "http://localhost:5161/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Using Postman

Import the API collection from the Swagger documentation at `http://localhost:5161/swagger`.

## Support

For API support and questions:
- **Issues**: [GitHub Issues](https://github.com/your-username/the-assemblers/issues)
- **Documentation**: [Swagger UI](http://localhost:5161/swagger)
- **Email**: api-support@theassemblers.com

---

*This API documentation is automatically generated and updated with each release.*
