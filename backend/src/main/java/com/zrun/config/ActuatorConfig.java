package com.zrun.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.boot.actuate.autoconfigure.endpoint.web.WebEndpointProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@Configuration
@EnableConfigurationProperties(WebEndpointProperties.class)
@PropertySource("classpath:application.yml")
public class ActuatorConfig {
    // The actuator endpoints will be configured via application.yml
    // This class enables the properties and ensures the configuration is loaded
}