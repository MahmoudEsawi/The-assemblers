# Assemblers API - .NET Web API Backend

A complete .NET 9 Web API backend for the Assemblers platform, providing RESTful endpoints for managing assemblers, services, bookings, reviews, and more.

## 🚀 Features

- **Complete CRUD Operations** for all entities
- **Entity Framework Core** with SQL Server
- **RESTful API Design** with proper HTTP methods
- **CORS Configuration** for Angular frontend integration
- **Swagger Documentation** for API testing
- **Database Seeding** with sample data
- **Proper Relationships** between entities

## 🏗️ Architecture

### Database Models
- **User**: Customer and assembler accounts
- **Assembler**: Extended user profiles for service providers
- **Category**: Service categories (Electronics, Furniture, etc.)
- **Service**: Services offered by assemblers
- **Booking**: Customer bookings for services
- **Review**: Customer reviews and ratings
- **DayAvailability**: Assembler availability schedules

### API Endpoints

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/email/{email}` - Get user by email
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

#### Assemblers
- `GET /api/assemblers` - Get all assemblers with related data
- `GET /api/assemblers/{id}` - Get assembler by ID
- `GET /api/assemblers/by-user/{userId}` - Get assembler by user ID
- `POST /api/assemblers` - Create new assembler
- `PUT /api/assemblers/{id}` - Update assembler
- `DELETE /api/assemblers/{id}` - Delete assembler

#### Services
- `GET /api/services` - Get all services with related data
- `GET /api/services/{id}` - Get service by ID
- `GET /api/services/by-category/{categoryId}` - Get services by category
- `GET /api/services/by-assembler/{assemblerId}` - Get services by assembler
- `POST /api/services` - Create new service
- `PUT /api/services/{id}` - Update service
- `DELETE /api/services/{id}` - Delete service

#### Bookings
- `GET /api/bookings` - Get all bookings with related data
- `GET /api/bookings/{id}` - Get booking by ID
- `GET /api/bookings/by-customer/{customerId}` - Get bookings by customer
- `GET /api/bookings/by-assembler/{assemblerId}` - Get bookings by assembler
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Delete booking

#### Reviews
- `GET /api/reviews` - Get all reviews with related data
- `GET /api/reviews/{id}` - Get review by ID
- `GET /api/reviews/by-assembler/{assemblerId}` - Get reviews by assembler
- `GET /api/reviews/by-customer/{customerId}` - Get reviews by customer
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/{id}` - Update review
- `DELETE /api/reviews/{id}` - Delete review

## 🛠️ Technology Stack

- **.NET 9** - Latest .NET framework
- **ASP.NET Core Web API** - RESTful API framework
- **Entity Framework Core 9** - ORM for database operations
- **SQL Server 2022** - Database (running in Docker)
- **Swagger/OpenAPI** - API documentation
- **Docker** - Containerized SQL Server

## 📋 Prerequisites

- .NET 9 SDK
- Docker Desktop
- SQL Server (via Docker)

## 🚀 Getting Started

### 1. Start SQL Server
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" -p 1433:1433 --name sqlserver --hostname sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

### 2. Run the API
```bash
cd AssemblersApi
dotnet run
```

The API will be available at:
- HTTP: `http://localhost:5161`
- HTTPS: `https://localhost:7116`
- Swagger UI: `https://localhost:7116/swagger`

### 3. Test the API
```bash
# Get all categories
curl -X GET "http://localhost:5161/api/categories"

# Get all users
curl -X GET "http://localhost:5161/api/users"
```

## 🗄️ Database Schema

The database includes the following tables with proper relationships:

- **Users** - Base user accounts
- **Assemblers** - Extended profiles for service providers
- **Categories** - Service categories
- **Services** - Services offered by assemblers
- **Bookings** - Customer bookings
- **Reviews** - Customer reviews and ratings
- **DayAvailabilities** - Assembler availability schedules

## 🔧 Configuration

### Connection String
The connection string is configured in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=AssemblersDb;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;"
  }
}
```

### CORS
CORS is configured to allow requests from the Angular frontend:
```csharp
policy.WithOrigins("http://localhost:4200")
      .AllowAnyHeader()
      .AllowAnyMethod();
```

## 📊 Sample Data

The database is seeded with:
- 5 service categories (Electronics, Furniture, Home Improvement, Computer Services, Appliance Repair)
- 1 test user (john@example.com)

## 🔄 Next Steps

1. **Authentication & Authorization** - Add JWT authentication
2. **Repository Pattern** - Implement repository pattern for better separation of concerns
3. **Validation** - Add proper input validation
4. **Error Handling** - Implement global error handling
5. **Logging** - Add structured logging
6. **Testing** - Add unit and integration tests
7. **Deployment** - Set up deployment to Azure/AWS

## 🧪 Testing

You can test the API using:
- **Swagger UI** at `https://localhost:7116/swagger`
- **Postman** or similar tools
- **curl** commands
- **Angular frontend** (when connected)

## 📝 Notes

- The API is configured for development environment
- CORS is enabled for Angular frontend integration
- Database migrations are included and applied automatically
- All endpoints return JSON responses
- Proper HTTP status codes are used
- Entity relationships are properly configured with foreign keys

## 🤝 Integration with Angular Frontend

The API is designed to work seamlessly with the Angular frontend:
- CORS is configured for `http://localhost:4200`
- All endpoints match the expected Angular service calls
- JSON responses are properly formatted
- Error handling is consistent

To connect your Angular frontend, update your service URLs to point to `http://localhost:5161/api/` instead of mock data.
