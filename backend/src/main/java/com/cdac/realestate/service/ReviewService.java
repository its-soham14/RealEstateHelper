package com.cdac.realestate.service;

import com.cdac.realestate.dto.ReviewDTO;
import com.cdac.realestate.dto.ReviewRequest;
import com.cdac.realestate.entity.Property;
import com.cdac.realestate.entity.Review;
import com.cdac.realestate.entity.User;
import com.cdac.realestate.repository.PropertyRepository;
import com.cdac.realestate.repository.ReviewRepository;
import com.cdac.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    ReviewRepository reviewRepository;

    @Autowired
    PropertyRepository propertyRepository;

    @Autowired
    UserRepository userRepository;

    public ReviewDTO addReview(Long propertyId, Long buyerId, ReviewRequest request) {
        if (reviewRepository.existsByPropertyIdAndBuyerId(propertyId, buyerId)) {
            throw new RuntimeException("You have already reviewed this property.");
        }

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        if (!buyer.getRole().name().equals("BUYER")) {
            throw new RuntimeException("Only buyers can leave reviews.");
        }

        Review review = new Review();
        review.setProperty(property);
        review.setBuyer(buyer);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);
        return convertToDTO(savedReview);
    }

    public List<ReviewDTO> getReviewsForProperty(Long propertyId) {
        return reviewRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setPropertyId(review.getProperty().getId());
        dto.setBuyerId(review.getBuyer().getId());
        dto.setBuyerName(review.getBuyer().getName());
        dto.setBuyerProfilePicture(review.getBuyer().getProfilePicture());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}
