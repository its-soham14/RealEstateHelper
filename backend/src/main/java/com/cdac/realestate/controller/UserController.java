package com.cdac.realestate.controller;

import com.cdac.realestate.entity.User;
import com.cdac.realestate.security.UserDetailsImpl;
import com.cdac.realestate.service.UserService;
import com.cdac.realestate.repository.UserRepository;
import com.cdac.realestate.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    FileStorageService fileStorageService;

    // Get My Profile
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public User getMyProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return userService.getUserById(userDetails.getId());
    }

    // Update My Profile
    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public User updateMyProfile(@Valid @RequestBody com.cdac.realestate.dto.UserUpdateDTO userDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return userService.updateUserProfile(userDetails.getId(), userDto);
    }

    // Get Specific User (For Admin/Public Seller Profile)
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        // In a real app, maybe limit sensitive fields like password/email for public
        // view
        return userService.getUserById(id);
    }

    // Upload Profile Picture
    @PostMapping(value = "/profile/picture", consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadProfilePicture(
            @RequestPart("image") MultipartFile image,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        if (image == null || image.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: No image provided.");
        }

        try {
            String filename = fileStorageService.store(image);
            User user = userRepository.findById(userDetails.getId()).orElseThrow();
            user.setProfilePicture(filename);
            userRepository.save(user);
            return ResponseEntity.ok(java.util.Collections.singletonMap("profilePicture", filename));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading image: " + e.getMessage());
        }
    }
}
