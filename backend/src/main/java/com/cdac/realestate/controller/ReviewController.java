package com.cdac.realestate.controller;

import com.cdac.realestate.dto.ReviewDTO;
import com.cdac.realestate.dto.ReviewRequest;
import com.cdac.realestate.security.UserDetailsImpl;
import com.cdac.realestate.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    ReviewService reviewService;

    @PostMapping("/property/{propertyId}")
    @PreAuthorize("hasAuthority('BUYER')")
    public ResponseEntity<?> addReview(
            @PathVariable Long propertyId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            ReviewDTO review = reviewService.addReview(propertyId, userDetails.getId(), request);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsForProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(reviewService.getReviewsForProperty(propertyId));
    }
}
