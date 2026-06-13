package com.cdac.realestate.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private Long id;
    private Long propertyId;
    private Long buyerId;
    private String buyerName;
    private String buyerProfilePicture;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
