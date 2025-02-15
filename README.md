# ZRun

Training plan management application built with Next.js and Spring Boot.

## Features

- Create and manage training plans based on user goals
- Track progress and historical data
- Race results tracking with location integration
- User profile progression
- Strava integration

## Tech Stack

### Frontend
- Next.js with TypeScript
- Tailwind CSS for styling
- Server-side rendering capabilities
- Type-safe API integration

### Backend
- Spring Boot (Java 17)
- MongoDB for flexible data storage
- Spring Security for authentication
- RESTful API design

## Development Setup

### Prerequisites
- Docker and Docker Compose
- Node.js 18+
- Java 17 (JDK)
- Maven
- Git

### Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd zrun
```

2. Start the development environment:
```bash
docker-compose up --build
```

This will start:
- MongoDB on port 27017
- Spring Boot backend on port 8080
- Next.js frontend on port 3000

### Development Workflow

The development environment is configured for hot-reloading:
- Frontend changes will automatically refresh
- Backend changes will trigger a Spring Boot restart
- Database data persists between restarts

### Project Structure

```
zrun/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/      # Next.js App Router
│   │   └── components/
│   └── public/
├── backend/          # Spring Boot application
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   └── pom.xml
└── docker-compose.yml
```

## Contributing

[To be added: Contribution guidelines]

## License

[To be added: License information]