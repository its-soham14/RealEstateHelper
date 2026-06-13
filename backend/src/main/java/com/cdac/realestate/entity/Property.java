package com.cdac.realestate.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "properties")
@SQLDelete(sql = "UPDATE properties SET is_deleted = true WHERE id=?")
@SQLRestriction("is_deleted = false")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    @Column(nullable = false)
    private String title;

    @NotNull(message = "Property Type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyType type;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    @Column(nullable = false)
    private Double price;

    @NotBlank(message = "Area is required")
    @Column(nullable = false)
    private String area; // e.g., "1200 sqft" or "5 acres"

    // Specific to House
    @Min(value = 0, message = "Beds cannot be negative")
    private Integer beds;
    @Min(value = 0, message = "Baths cannot be negative")
    private Integer baths;
    private String bhk; // e.g., "2BHK"

    @Column(columnDefinition = "TEXT")
    @Size(max = 2000, message = "Description too long")
    private String description;

    @NotBlank(message = "Address is required")
    @Column(nullable = false)
    private String address;

    @NotBlank(message = "City is required")
    @Column(nullable = false)
    private String city;

    @Column(columnDefinition = "LONGTEXT")
    private String images; // JSON string or comma-separated URLs

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(columnDefinition = "JSON")
    private String additionalDetails;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_status", nullable = false)
    private PropertyStatus status = PropertyStatus.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum PropertyType {
        HOUSE, LAND, FARM, FARMLAND, APARTMENT, VILLA, COMMERCIAL, RESIDENTIAL_PLOT, PG_HOSTEL, OTHER
    }

    public enum PropertyStatus {
        PENDING, APPROVED, REJECTED, SOLD
    }
}
