package com.cdac.realestate.dto;

import com.cdac.realestate.entity.Property.PropertyStatus;
import com.cdac.realestate.entity.Property.PropertyType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PropertyDTO {
    private Long id;
    private Long sellerId;
    private String sellerName;
    private String sellerEmail;
    private String sellerPhone;
    
    private String title;
    private PropertyType type;
    private Double price;
    private String area;
    
    private Integer beds;
    private Integer baths;
    private String bhk;
    
    private String description;
    private String address;
    private String city;
    private String images;
    
    private java.util.Map<String, Object> additionalDetails;
    
    private String rejectionReason;
    private PropertyStatus status;
    private LocalDateTime createdAt;
    
    private Double avgRating;
    private Integer reviewCount;
}
