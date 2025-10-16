# 🏠 The Assemblers - Professional Home Services Platform

A modern, full-stack web application connecting customers with professional home service providers. Built with Clean Architecture principles using .NET 9.0 Web API and Angular 18.

## 🌟 Features

### For Customers
- 🔍 **Browse Services**: Search and filter home services by category
- 👨‍🔧 **Find Assemblers**: View professional profiles with ratings and reviews
- 📅 **Book Services**: Easy calendar-based booking system
- ⭐ **Rate & Review**: Leave feedback for completed services
- 💬 **Real-time Chat**: Communicate with service providers
- 📱 **Mobile Responsive**: Works perfectly on all devices

### For Service Providers (Assemblers)
- 👤 **Professional Profiles**: Create detailed service provider profiles
- 📊 **Availability Management**: Set working hours and availability
- 📋 **Service Management**: Add and manage offered services
- 📅 **Booking Management**: View and manage customer bookings
- 💰 **Pricing Control**: Set competitive service prices
- 📈 **Performance Tracking**: Monitor ratings and reviews

### Platform Features
- 🏗️ **Clean Architecture**: Maintainable and scalable codebase
- 🔒 **Secure Authentication**: Safe user registration and login
- 📊 **Comprehensive Data**: Rich seed data for testing
- 🚀 **High Performance**: Optimized database queries and caching
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🔄 **Real-time Updates**: Live notifications and chat

## 🛠️ Technology Stack

### Backend
- **.NET 9.0** - Latest .NET framework
- **ASP.NET Core Web API** - RESTful API development
- **Entity Framework Core** - Object-relational mapping
- **SQL Server** - Relational database
- **Swagger/OpenAPI** - API documentation
- **Clean Architecture** - Maintainable code structure

### Frontend
- **Angular 18** - Modern web framework
- **TypeScript** - Type-safe JavaScript
- **SCSS** - Advanced CSS preprocessing
- **RxJS** - Reactive programming
- **Angular Material** - UI component library
- **Responsive Design** - Mobile-first approach

### Infrastructure
- **Azure SQL Database** - Cloud database hosting
- **Azure App Service** - Cloud application hosting
- **GitHub** - Version control and CI/CD
- **Docker** - Containerization support

## 🚀 Quick Start

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or [Azure SQL Database](https://azure.microsoft.com/en-us/products/azure-sql/)
- [Visual Studio Code](https://code.visualstudio.com/) or [JetBrains Rider](https://www.jetbrains.com/rider/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/the-assemblers.git
cd the-assemblers
```

### 2. Backend Setup
```bash
cd AssemblersApi
dotnet restore
dotnet ef database update
dotnet run
```

The API will be available at:
- **API**: http://localhost:5161
- **Swagger Documentation**: http://localhost:5161/swagger

### 3. Frontend Setup
```bash
cd /Users/airm2/the-assemblers1
npm install
ng serve
```

The frontend will be available at:
- **Application**: http://localhost:4200

### 4. Access the Application
Open your browser and navigate to http://localhost:4200 to start using the application.

## 📁 Project Structure

```
the-assemblers/
├── AssemblersApi/              # .NET Web API Backend
│   ├── Application/            # Application Layer
│   │   ├── DTOs/              # Data Transfer Objects
│   │   ├── Interfaces/        # Service Interfaces
│   │   └── Services/          # Application Services
│   ├── Domain/                # Domain Layer
│   │   ├── Entities/          # Domain Models
│   │   └── Interfaces/        # Repository Interfaces
│   ├── Infrastructure/        # Infrastructure Layer
│   │   └── Repositories/      # Data Access Implementations
│   ├── Data/                  # Data Access Layer
│   ├── Controllers/           # API Controllers
│   └── Program.cs             # Application Entry Point
├── src/                       # Angular Frontend
│   ├── app/
│   │   ├── core/             # Core Services & Models
│   │   ├── features/         # Feature Modules
│   │   ├── shared/           # Shared Components
│   │   └── assets/           # Static Assets
│   └── environments/         # Environment Configurations
├── docs/                      # Documentation
└── README.md                  # This file
```

## 🗄️ Database Schema

The application uses a comprehensive database schema with the following entities:

- **Users**: Customer and assembler accounts
- **Assemblers**: Service provider profiles
- **Categories**: Service categories
- **Services**: Offered services
- **Bookings**: Service appointments
- **Reviews**: Customer feedback
- **DayAvailabilities**: Provider schedules

### Key Features
- ✅ **Soft Delete**: Non-destructive data removal
- ✅ **Audit Trail**: Automatic timestamp tracking
- ✅ **Foreign Key Constraints**: Data integrity
- ✅ **Optimized Indexes**: Fast query performance
- ✅ **Seed Data**: Comprehensive test data

## 🔧 API Endpoints

### Core Resources
- **Users**: `/api/users` - User management
- **Assemblers**: `/api/assemblers` - Service provider profiles
- **Services**: `/api/services` - Available services
- **Bookings**: `/api/bookings` - Service appointments
- **Reviews**: `/api/reviews` - Customer feedback
- **Categories**: `/api/categories` - Service categories

### Key Features
- ✅ **RESTful Design**: Standard HTTP methods
- ✅ **Comprehensive CRUD**: Full data operations
- ✅ **Search & Filter**: Advanced querying
- ✅ **Pagination**: Efficient data loading
- ✅ **Error Handling**: Proper HTTP status codes
- ✅ **Validation**: Input validation and sanitization

## 🎨 User Interface

### Design Principles
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: WCAG 2.1 compliance
- **Performance**: Fast loading and smooth interactions
- **User Experience**: Intuitive navigation and workflows

### Key Components
- **Landing Page**: Service discovery and search
- **Service Listings**: Filtered service browsing
- **Provider Profiles**: Detailed assembler information
- **Booking System**: Calendar-based appointment scheduling
- **Review System**: Rating and feedback management
- **Chat Interface**: Real-time communication

## 🔒 Security Features

- **Password Hashing**: SHA256 secure password storage
- **CORS Protection**: Controlled cross-origin access
- **Input Validation**: Server-side data validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Output encoding and sanitization
- **HTTPS Support**: Secure data transmission

## 📊 Performance Optimizations

- **Database Indexing**: Optimized query performance
- **Lazy Loading**: Efficient data loading strategies
- **Caching**: Reduced database load
- **Compression**: Minimized data transfer
- **CDN Integration**: Fast asset delivery
- **Code Splitting**: Optimized bundle sizes

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: Service and repository testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: Migration and data integrity testing

### Frontend Testing
- **Component Tests**: Angular component testing
- **Service Tests**: API integration testing
- **E2E Tests**: End-to-end user workflow testing

## 🚀 Deployment

### Azure Deployment
The application is configured for Azure deployment:

1. **Azure SQL Database**: Cloud database hosting
2. **Azure App Service**: Web application hosting
3. **GitHub Actions**: Automated CI/CD pipeline
4. **Azure DevOps**: Deployment management

### Local Development
- **Docker Support**: Containerized development
- **Hot Reload**: Fast development iteration
- **Environment Configuration**: Flexible settings management

## 📈 Monitoring & Analytics

- **Application Insights**: Performance monitoring
- **Error Tracking**: Comprehensive error logging
- **Usage Analytics**: User behavior tracking
- **Performance Metrics**: Response time monitoring

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow Clean Architecture principles
- Write comprehensive tests
- Update documentation
- Follow coding standards
- Ensure mobile responsiveness

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Clean Architecture** principles by Robert C. Martin
- **Angular** team for the excellent framework
- **Microsoft** for .NET and Azure platform
- **Community** contributors and feedback

## 📞 Support

For support and questions:
- **Issues**: [GitHub Issues](https://github.com/your-username/the-assemblers/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/the-assemblers/discussions)
- **Email**: support@theassemblers.com

## 🔮 Roadmap

### Upcoming Features
- [ ] **Mobile App**: React Native or Flutter
- [ ] **Payment Integration**: Stripe/PayPal
- [ ] **Real-time Notifications**: Push notifications
- [ ] **Advanced Analytics**: Business intelligence
- [ ] **Multi-language Support**: Internationalization
- [ ] **AI Recommendations**: Smart service matching

### Technical Improvements
- [ ] **Microservices**: Service decomposition
- [ ] **Event Sourcing**: Advanced data patterns
- [ ] **GraphQL**: Flexible API queries
- [ ] **WebSocket**: Real-time communication
- [ ] **Machine Learning**: Predictive analytics

---

**Built with ❤️ using Clean Architecture principles**

*The Assemblers - Connecting customers with professional home service providers*