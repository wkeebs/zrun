FROM eclipse-temurin:17-jdk-jammy as backend
WORKDIR /app

# Install maven
RUN apt-get update && apt-get install -y maven

# Copy only pom.xml first to leverage Docker cache
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy entire source
COPY src ./src

# Expose development ports
EXPOSE 8080 5005

# Use maven to run the application in development mode
CMD ["mvn", "spring-boot:run"]