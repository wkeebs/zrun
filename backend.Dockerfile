FROM eclipse-temurin:17-jdk-jammy as backend
WORKDIR /app
RUN apt-get update && apt-get install -y maven
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests
EXPOSE 8080
CMD ["java", "-jar", "target/zrun-backend-0.0.1-SNAPSHOT.jar"]