# ZRun 🏃‍♂️💨

Training plan management application built with Next.js and Spring Boot.

## Features

- Create and manage training plans based on user goals
- Track progress and historical data
- Race location tracking with results integration
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

We welcome contributions to ZRun! Here's how you can help:

### Development Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

### Pull Request Guidelines

- Link any related issues in the pull request description
- Include screenshots for UI changes
- Update documentation if needed
- Add tests for new functionality
- Follow existing code style and conventions
- Keep pull requests focused on a single feature/fix

### Code Style

- Frontend: Follow the ESLint configuration
- Backend: Follow standard Java conventions and Spring Boot best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

Follow conventional commits format:

- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Test changes
- chore: Build process or auxiliary tool changes

Example: `feat: add strava activity sync`

### Setting Up Development Environment

See the Development Setup section above. If you encounter any issues, please check existing issues or create a new one.

## License

MIT License

Copyright (c) 2024 ZRun

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
