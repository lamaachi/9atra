# 9Atra - Blood Donation Mobile Application 🩸

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React Native](https://img.shields.io/badge/React%20Native-Latest-blue.svg)](https://reactnative.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 About

**9Atra** is a mobile application dedicated to facilitating blood donation by connecting donors with donation centers and hospitals. Built with **React Native** for a smooth and intuitive user interface, and **Spring Boot** for the backend, 9Atra provides a simple and secure mobile experience for managing donor data and blood donation needs.

## ✨ Features

* **Donor Registration and Authentication**
  - Secure user registration and login
  - Profile management
  - Authentication token handling

* **Donation Center Localization**
  - Interactive map showing nearby blood donation centers
  - Real-time distance calculation
  - Center details and operating hours

* **Blood Need Alerts**
  - Push notifications based on blood type
  - Emergency alerts for urgent needs
  - Customizable notification preferences

* **Donation Tracking**
  - Personal donation history
  - Future donation reminders
  - Health eligibility tracking

* **Data Management**
  - RESTful API built with Spring Boot
  - Secure data handling
  - Real-time updates

## 🛠 Technical Stack

### Backend
- **Framework:** Spring Boot 2.7.0
- **Database:** MySQL 8.0
- **Security:** Spring Security with JWT
- **Documentation:** Swagger/OpenAPI
- **Testing:** JUnit, Mockito

### Frontend
- **Framework:** React Native (Expo)
- **State Management:** Redux
- **Maps:** React Native Maps
- **Notifications:** Firebase Cloud Messaging

## 🚀 Installation

### Prerequisites
- Java 11 or higher
- Maven 3.6+
- Node.js 14+
- MySQL 8.0

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/YourUsername/9Atra-Backend.git
cd 9Atra-Backend
```

2. Configure database in `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/9atra_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Build and run the application:
```bash
mvn clean install
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

## 📚 API Documentation

Once the backend is running, access the API documentation at:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- API Docs: `http://localhost:8080/v3/api-docs`

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Donation Centers
- `GET /api/centers` - List all centers
- `GET /api/centers/{id}` - Get center details
- `POST /api/centers` - Add new center (Admin)

### Donations
- `GET /api/donations/history` - Get user donation history
- `POST /api/donations` - Record new donation
- `GET /api/donations/eligibility` - Check donation eligibility

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

