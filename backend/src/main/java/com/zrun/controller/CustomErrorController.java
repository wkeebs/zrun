package com.zrun.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@Controller
@Slf4j
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object path = request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        
        HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = "An error occurred";
        
        if (status != null) {
            int statusCode = Integer.parseInt(status.toString());
            httpStatus = HttpStatus.valueOf(statusCode);
            
            switch (httpStatus) {
                case NOT_FOUND:
                    message = "Resource not found";
                    break;
                case FORBIDDEN:
                    message = "Access denied";
                    break;
                case UNAUTHORIZED:
                    message = "Unauthorized access";
                    break;
                default:
                    message = "Error processing request";
            }
        }
        
        log.error("Error processing request: {} - Status: {} - Path: {}", 
                  message, httpStatus, path);
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", httpStatus.value());
        errorResponse.put("error", httpStatus.getReasonPhrase());
        errorResponse.put("message", message);
        errorResponse.put("path", path);
        
        return new ResponseEntity<>(errorResponse, httpStatus);
    }
}