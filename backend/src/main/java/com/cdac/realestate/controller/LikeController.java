package com.cdac.realestate.controller;

import com.cdac.realestate.entity.Property;
import com.cdac.realestate.entity.PropertyLike;
import com.cdac.realestate.security.UserDetailsImpl;
import com.cdac.realestate.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    LikeService likeService;

    // Toggle Like
    @PostMapping("/{propertyId}")
    @PreAuthorize("hasAuthority('BUYER')")
    public boolean toggleLike(@PathVariable Long propertyId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return likeService.toggleLike(userDetails.getId(), propertyId);
    }

    // Check if liked
    @GetMapping("/{propertyId}/check")
    @PreAuthorize("isAuthenticated()")
    public boolean isLiked(@PathVariable Long propertyId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return likeService.isLiked(userDetails.getId(), propertyId);
    }

    // Buyer: Get My Wishlist
    @GetMapping("/wishlist")
    @PreAuthorize("hasAuthority('BUYER')")
    public List<Property> getMyWishlist(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return likeService.getUserWishlist(userDetails.getId());
    }

    // Seller: Get Interested Buyers (Likes on my properties)
    @GetMapping("/seller-dashboard")
    @PreAuthorize("hasAuthority('SELLER')")
    public List<PropertyLike> getSellerInterests(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return likeService.getSellerLikes(userDetails.getId());
    }
}
