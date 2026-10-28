# Smart Inventory & Invoice Generator Backend

A RESTful backend for managing products and inventory for small businesses, built with Java, Spring Boot, Spring Data JPA, and MySQL.

## Tech Stack

- **Language:** Java 21
- **Framework:** Spring Boot
- **Build Tool:** Maven
- **Database:** MySQL 8
- **Data Access:** Spring Data JPA / Hibernate
- **API Format:** REST / JSON
- **Development IDE:** Spring Tool Suite (STS)

## Features

### Implemented

- Spring Boot application setup
- MySQL database connectivity
- Product entity and repository
- Product service layer
- Product REST controller
- Product response DTO
- Initial product listing endpoint

### Planned

- Create, update, and delete products
- Product search and pagination
- Inventory quantity management
- Low-stock alerts
- Customer management
- Invoice generation and history
- GST invoice support
- Request validation and centralized error handling
- API documentation and automated tests

## Project Structure

```text
smart-inventory/
├── .mvn/
├── src/
│   ├── main/
│   │   ├── java/com/smartinventory/
│   │   │   ├── SmartInventoryApplication.java
│   │   │   ├── common/
│   │   │   │   ├── dto/
│   │   │   │   └── exception/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── repository/
│   │   │   └── service/
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

## Prerequisites

Install the following before running the application:

- Java Development Kit (JDK) 21
- MySQL 8
- Maven, or use the included Maven Wrapper
- Spring Tool Suite (STS), Eclipse, or another Java IDE

## Database Setup

1. Start your MySQL server.
2. Create the database:

```sql
CREATE DATABASE smart_inventory;
```

3. Configure your database connection using environment variables.

The application uses the following settings in `src/main/resources/application.properties`:

```properties
spring.application.name=smart-inventory

spring.datasource.url=jdbc:mysql://localhost:3306/smart_inventory
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false
```

Set the required environment variables before starting the application.

Example for Git Bash:

```bash
export DB_USERNAME=root
export DB_PASSWORD='your-local-mysql-password'
```

Replace the example password with your actual local MySQL password. Do not commit database credentials to GitHub.

> **Security note:** `spring.jpa.hibernate.ddl-auto=update` is useful during development. Use a controlled database migration strategy for production.

## Run the Application

### Using the Maven Wrapper

On Windows Command Prompt:

```bat
mvnw.cmd spring-boot:run
```

On Git Bash or Linux/macOS:

```bash
./mvnw spring-boot:run
```

### Using STS

1. Import the project as an existing Maven project if necessary.
2. Configure the database environment variables in the run configuration.
3. Open `SmartInventoryApplication.java`.
4. Select **Run As → Spring Boot App**.
5. Verify that the application starts on port `8080`.

## Product API

### Get All Products

Retrieves the product records available in the database.

- **Method:** `GET`
- **Endpoint:** `/api/v1/products`
- **Local URL:** `http://localhost:8080/api/v1/products`
- **Success status:** `200 OK`
- **Response format:** JSON

Example response:

```json
[
  {
    "id": 1,
    "name": "Wireless Mouse",
    "sku": "MOU-001",
    "description": "Wireless optical mouse",
    "price": 599.00,
    "quantity": 25,
    "createdAt": "2026-10-28T10:30:00"
  }
]
```

The response is illustrative. Actual results depend on the records in the database. If no products exist, the endpoint should return an empty JSON array:

```json
[]
```

### Test the Endpoint

1. Start the application.
2. Open a browser or Postman.
3. Send a GET request to:

```text
http://localhost:8080/api/v1/products
```

4. Verify the HTTP status and JSON response.

## Architecture

The backend follows a layered architecture:

```text
HTTP Request
    |
    v
ProductController
    |
    v
ProductService
    |
    v
ProductRepository
    |
    v
MySQL Database
```

The controller handles HTTP requests, the service contains application logic, the repository handles persistence, and the DTO defines the API response structure.

## Development Branches

The backend feature is developed on:

```text
feature/product-api
```

The existing GitHub repository is:

https://github.com/appu22/Smart-Inventory

Follow the existing repository's branching and review practices when integrating backend changes.

## Future Improvements

- Add request DTOs and validation for product creation and updates.
- Implement pagination, sorting, and search.
- Add inventory movement tracking and stock alerts.
- Implement customer and invoice management.
- Add automated unit and integration tests.
- Secure the API before production deployment.
- Add OpenAPI documentation for API consumers.

## License

Add a license appropriate to the project's intended distribution before publishing or redistributing the software.
