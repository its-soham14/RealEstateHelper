package com.cdac.realestate.dto;

import lombok.Data;

import jakarta.validation.constraints.*;

public class AuthDtos {

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    public static class GoogleLoginRequest {
        @NotBlank(message = "Token is required")
        private String token;
    }

    @Data
    public static class SignupRequest {
        @NotBlank(message = "Name is required")
        @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
        @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Name must contain only alphabets and spaces")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        @NotBlank(message = "Role is required")
        private String role; // BUYER, SELLER

        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^\\d{10}$", message = "Phone must be exactly 10 digits")
        private String phone;

        // Seller optional
        private String companyName;
        private String address;
    }

    @Data
    public static class JwtResponse {
        private String token;
        private Long id;
        private String name;
        private String email;
        private String role;

        public JwtResponse(String token, Long id, String name, String email, String role) {
            this.token = token;
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }
    }
}
