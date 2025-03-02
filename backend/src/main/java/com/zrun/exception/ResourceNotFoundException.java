package com.zrun.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a requested resource is not found.
 * This exception is automatically translated to a 404 HTTP response.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Creates a new ResourceNotFoundException with the specified message.
     *
     * @param message the detail message
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * Creates a new ResourceNotFoundException with the specified message and cause.
     *
     * @param message the detail message
     * @param cause the cause
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    /**
     * Creates a new ResourceNotFoundException for a specific resource type and identifier.
     *
     * @param resourceName name of the resource (e.g., "User", "Training Plan")
     * @param fieldName name of the field (e.g., "id", "email")
     * @param fieldValue value of the field
     * @return a new ResourceNotFoundException with a formatted message
     */
    public static ResourceNotFoundException forResource(
            String resourceName, String fieldName, Object fieldValue) {
        return new ResourceNotFoundException(
                String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
    }
}