package com.cdac.realestate.dto;

import com.cdac.realestate.entity.Property;
import com.cdac.realestate.entity.Review;
import com.cdac.realestate.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PropertyMapper {

    @Autowired
    private ReviewRepository reviewRepository;

    public PropertyDTO toDto(Property property) {
        if (property == null) return null;

        PropertyDTO dto = new PropertyDTO();
        dto.setId(property.getId());
        
        if (property.getSeller() != null) {
            dto.setSellerId(property.getSeller().getId());
            dto.setSellerName(property.getSeller().getName());
            dto.setSellerEmail(property.getSeller().getEmail());
            dto.setSellerPhone(property.getSeller().getPhone());
        }

        dto.setTitle(property.getTitle());
        dto.setType(property.getType());
        dto.setPrice(property.getPrice());
        dto.setArea(property.getArea());
        
        dto.setBeds(property.getBeds());
        dto.setBaths(property.getBaths());
        dto.setBhk(property.getBhk());
        
        dto.setDescription(property.getDescription());
        dto.setAddress(property.getAddress());
        dto.setCity(property.getCity());
        dto.setImages(property.getImages());
        
        dto.setRejectionReason(property.getRejectionReason());
        dto.setStatus(property.getStatus());
        dto.setCreatedAt(property.getCreatedAt());

        if (property.getAdditionalDetails() != null && !property.getAdditionalDetails().isEmpty()) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                java.util.Map<String, Object> detailsMap = mapper.readValue(property.getAdditionalDetails(), new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, Object>>() {});
                dto.setAdditionalDetails(detailsMap);
            } catch (Exception e) {
                System.err.println("Failed to parse additional details: " + e.getMessage());
            }
        }

        // Calculate Average Rating
        if (property.getId() != null) {
            List<Review> reviews = reviewRepository.findByPropertyIdOrderByCreatedAtDesc(property.getId());
            if (!reviews.isEmpty()) {
                double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
                dto.setAvgRating(Math.round(avg * 10.0) / 10.0);
                dto.setReviewCount(reviews.size());
            } else {
                dto.setAvgRating(0.0);
                dto.setReviewCount(0);
            }
        }

        return dto;
    }

    public List<PropertyDTO> toDtoList(List<Property> properties) {
        return properties.stream().map(this::toDto).collect(Collectors.toList());
    }
}
