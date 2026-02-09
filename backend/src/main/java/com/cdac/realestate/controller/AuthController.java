package com.cdac.realestate.controller;

import com.cdac.realestate.dto.AuthDtos.*;
import com.cdac.realestate.dto.OtpVerificationRequest;
import com.cdac.realestate.entity.User;
import com.cdac.realestate.repository.UserRepository;
import com.cdac.realestate.security.JwtUtils;
import com.cdac.realestate.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    com.cdac.realestate.service.EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        // Check if user is verified (Skip for ADMIN - strict requirement)
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);
        if (user != null && !user.isVerified() && user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.badRequest().body("Error: Email is not verified. Please verify your email first.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .findFirst().get().getAuthority();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getUsername(),
                role));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setRole(User.Role.valueOf(signUpRequest.getRole().toUpperCase()));
        user.setPhone(signUpRequest.getPhone());
        user.setCompanyName(signUpRequest.getCompanyName());
        user.setAddress(signUpRequest.getAddress());

        if (user.getRole() == User.Role.ADMIN) {
            user.setVerified(true);
            userRepository.save(user);
            return ResponseEntity.ok("User registered successfully!");
        }

        // Generate OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
        user.setVerified(false);

        userRepository.save(user);

        // Send OTP Email
        emailService.sendOtpEmail(user.getEmail(), user.getName(), otp);

        return ResponseEntity.ok("User registered successfully! Please check your email for OTP.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody OtpVerificationRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        if (user.isVerified()) {
            return ResponseEntity.badRequest().body("Error: User is already verified.");
        }

        if (user.getOtp() == null || !user.getOtp().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body("Error: Invalid OTP.");
        }

        if (user.getOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Error: OTP has expired.");
        }

        // Verify User
        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        // Auto-login (generate token) for convenience
        // But for now, we'll just indicate success
        return ResponseEntity.ok("Email verified successfully! You can now login.");
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(
            @RequestBody com.cdac.realestate.dto.AuthDtos.GoogleLoginRequest googleRequest) {
        try {
            // 1. Verify Token with Google
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + googleRequest.getToken();
            java.util.Map<String, Object> googleUser = restTemplate.getForObject(url, java.util.Map.class);

            if (googleUser == null || googleUser.get("email") == null) {
                return ResponseEntity.badRequest().body("Invalid Google Token");
            }

            String email = (String) googleUser.get("email");
            String name = (String) googleUser.get("name");
            // String picture = (String) googleUser.get("picture"); // Optional

            // 2. Check if user exists
            User user;
            if (userRepository.existsByEmail(email)) {
                user = userRepository.findByEmail(email).orElseThrow();
            } else {
                // 3. Auto-Register if new
                user = new User();
                user.setName(name != null ? name : "Google User");
                user.setEmail(email);
                user.setRole(User.Role.BUYER); // Default role
                user.setPassword(encoder.encode("GOOGLE_AUTH_DEFAULT_PASS_" + java.util.UUID.randomUUID())); // Random
                                                                                                             // pass

                // Placeholder dummy data for required fields
                user.setPhone("0000000000");
                user.setVerified(true); // Google users are auto-verified

                userRepository.save(user);

                // Send Welcome Email for Google Signup
                emailService.sendWelcomeEmail(user.getEmail(), user.getName());
            }

            // 4. Generate JWT
            String jwt = jwtUtils.generateTokenFromUser(user);

            return ResponseEntity.ok(new JwtResponse(jwt,
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().name()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Google Authentication Failed: " + e.getMessage());
        }
    }
}
