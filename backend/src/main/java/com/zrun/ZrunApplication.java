package com.zrun;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.zrun")
public class ZrunApplication {

    public static void main(String[] args) {
        SpringApplication.run(ZrunApplication.class, args);
    }

}
