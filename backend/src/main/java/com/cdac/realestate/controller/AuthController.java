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

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

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

    // ── Pending registrations: held in memory, NOT in DB until OTP verified ─
    private static final ConcurrentHashMap<String, PendingUser> pendingUsers = new ConcurrentHashMap<>();

    private static class PendingUser {
        SignupRequest request;
        String encodedPassword;
        String otp;
        LocalDateTime otpExpiry;

        PendingUser(SignupRequest request, String encodedPassword, String otp) {
            this.request = request;
            this.encodedPassword = encodedPassword;
            this.otp = otp;
            this.otpExpiry = LocalDateTime.now().plusMinutes(10);
        }
    }

    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    // ── LOGIN ─────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);
        // Removed email verification block to allow unverified legacy users to login and verify from profile
        if (user == null) {
            return ResponseEntity.badRequest().body("Error: User not found.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream().findFirst().get().getAuthority();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getUsername(),
                role,
                userDetails.isVerified()));
    }

    // ── STEP 1: Signup → store temporarily → send OTP (no DB write yet) ──
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        String email = signUpRequest.getEmail();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Error: Email is already registered!");
        }

        if ("ADMIN".equalsIgnoreCase(signUpRequest.getRole())) {
            return ResponseEntity.badRequest().body("Error: Admin registration is not allowed via public endpoint.");
        }

        String otp = generateOtp();
        String encodedPassword = encoder.encode(signUpRequest.getPassword());

        // Only store in memory — database NOT touched yet
        pendingUsers.put(email, new PendingUser(signUpRequest, encodedPassword, otp));

        emailService.sendOtpEmail(email, signUpRequest.getName(), otp);
        System.out.println("[DEV] OTP for " + email + " : " + otp);

        return ResponseEntity.ok("OTP sent to " + email + ". Please check your inbox.");
    }

    // ── RESEND OTP ────────────────────────────────────────────────
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Error: Email is required.");
        }

        PendingUser pending = pendingUsers.get(email);
        if (pending == null) {
            return ResponseEntity.badRequest().body("Error: No pending registration. Please sign up first.");
        }

        String newOtp = generateOtp();
        pending.otp = newOtp;
        pending.otpExpiry = LocalDateTime.now().plusMinutes(10);
        pendingUsers.put(email, pending);

        emailService.sendOtpEmail(email, pending.request.getName(), newOtp);
        System.out.println("[DEV] Resent OTP for " + email + " : " + newOtp);

        return ResponseEntity.ok("New OTP sent to " + email);
    }

    // ── STEP 2: Verify OTP → NOW save user to database ────────────
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody OtpVerificationRequest request) {
        String email = request.getEmail();

        // Already verified in DB?
        User existingUser = userRepository.findByEmail(email).orElse(null);
        if (existingUser != null && existingUser.isVerified()) {
            return ResponseEntity.badRequest().body("Error: User is already verified.");
        }

        PendingUser pending = pendingUsers.get(email);
        if (pending == null) {
            return ResponseEntity.badRequest().body("Error: No pending registration found. Please sign up again.");
        }

        if (pending.otp == null || !pending.otp.equals(request.getOtp())) {
            return ResponseEntity.badRequest().body("Error: Invalid OTP. Please check your email or resend.");
        }

        if (pending.otpExpiry.isBefore(LocalDateTime.now())) {
            pendingUsers.remove(email);
            return ResponseEntity.badRequest().body("Error: OTP has expired. Please request a new one.");
        }

        // ✅ OTP verified — persist user to database NOW
        SignupRequest req = pending.request;
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(pending.encodedPassword);
        user.setRole(User.Role.valueOf(req.getRole().toUpperCase()));
        user.setPhone(req.getPhone());
        user.setCompanyName(req.getCompanyName());
        user.setAddress(req.getAddress());
        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);
        pendingUsers.remove(email);

        emailService.sendWelcomeEmail(email, user.getName());

        return ResponseEntity.ok("Email verified successfully! You can now login.");
    }
    // ── FORGOT PASSWORD ───────────────────────────────────────────
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // Return ok even if user not found to prevent email enumeration attacks
            return ResponseEntity.ok("If that email is registered, a reset OTP has been sent.");
        }

        if (user.getRole() == User.Role.ADMIN) {
            return ResponseEntity.badRequest().body("Error: Admin password reset is not allowed via public endpoint.");
        }

        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        emailService.sendPasswordResetOtpEmail(email, user.getName(), otp);
        System.out.println("[DEV] Password Reset OTP for " + email + " : " + otp);

        return ResponseEntity.ok("If that email is registered, a reset OTP has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        String email = request.getEmail();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("Error: Invalid request.");
        }

        if (user.getOtp() == null || !user.getOtp().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body("Error: Invalid OTP.");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Error: OTP has expired. Please request a new one.");
        }

        // OTP is valid, update password and verify email
        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setVerified(true);
        userRepository.save(user);

        return ResponseEntity.ok("Password has been reset successfully. You can now login.");
    }

    // ── GOOGLE LOGIN ──────────────────────────────────────────────
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(
            @RequestBody com.cdac.realestate.dto.AuthDtos.GoogleLoginRequest googleRequest) {
        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + googleRequest.getToken();
            java.util.Map<String, Object> googleUser = restTemplate.getForObject(url, java.util.Map.class);

            if (googleUser == null || googleUser.get("email") == null) {
                return ResponseEntity.badRequest().body("Invalid Google Token");
            }

            String email = (String) googleUser.get("email");
            String name = (String) googleUser.get("name");

            User user;
            if (userRepository.existsByEmail(email)) {
                user = userRepository.findByEmail(email).orElseThrow();
                if (!user.isVerified()) {
                    user.setVerified(true);
                    userRepository.save(user);
                }
            } else {
                user = new User();
                user.setName(name != null ? name : "Google User");
                user.setEmail(email);
                user.setRole(User.Role.BUYER);
                user.setPassword(encoder.encode("GOOGLE_AUTH_DEFAULT_PASS_" + java.util.UUID.randomUUID()));
                user.setPhone("0000000000");
                user.setVerified(true);
                userRepository.save(user);
                emailService.sendWelcomeEmail(user.getEmail(), user.getName());
            }

            String jwt = jwtUtils.generateTokenFromUser(user);

            return ResponseEntity.ok(new JwtResponse(jwt,
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().name(),
                    user.isVerified()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Google Authentication Failed: " + e.getMessage());
        }
    }

    // ── PROFILE EMAIL VERIFICATION ────────────────────────────────
    @PostMapping("/send-verification-otp")
    public ResponseEntity<?> sendProfileVerificationOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("Error: User not found.");
        }
        if (user.isVerified()) {
            return ResponseEntity.badRequest().body("Error: Email is already verified.");
        }

        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        emailService.sendOtpEmail(email, user.getName(), otp);
        System.out.println("[DEV] Profile Verification OTP for " + email + " : " + otp);

        return ResponseEntity.ok("Verification OTP sent to " + email);
    }

    @PostMapping("/verify-profile-otp")
    public ResponseEntity<?> verifyProfileOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("Error: User not found.");
        }
        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            return ResponseEntity.badRequest().body("Error: Invalid OTP.");
        }
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Error: OTP has expired.");
        }

        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Email verified successfully!");
    }
}
