# Use a base image with JDK 17 (or your version)
FROM eclipse-temurin:17-jdk

# Create and set working directory
WORKDIR /app

# Copy the Spring Boot JAR file into the image
COPY target/Bulls_Trading-0.0.1-SNAPSHOT.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]