package com.cdac.realestate.controller;

import com.cdac.realestate.entity.User;
import com.cdac.realestate.security.UserDetailsImpl;
import com.cdac.realestate.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserService userService;

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
}
