package com.cdac.realestate.controller;

import com.cdac.realestate.dto.AuthDtos.*;
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

        userRepository.save(user);

        // Send Welcome Email
        emailService.sendWelcomeEmail(user.getEmail(), user.getName());

        return ResponseEntity.ok("User registered successfully!");
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
