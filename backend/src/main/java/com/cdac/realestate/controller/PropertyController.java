package com.cdac.realestate.controller;

import com.cdac.realestate.dto.PropertyDTO;
import com.cdac.realestate.dto.PropertyMapper;
import com.cdac.realestate.entity.Property;
import com.cdac.realestate.security.UserDetailsImpl;
import com.cdac.realestate.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    PropertyService propertyService;
    
    @Autowired
    PropertyMapper propertyMapper;

    // Public search (only approved)
    @GetMapping
    public org.springframework.data.domain.Page<PropertyDTO> getAllProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Property.PropertyType type,
            @RequestParam(required = false) Integer beds,
            org.springframework.data.domain.Pageable pageable) {
        return propertyService.getAllProperties(city, minPrice, maxPrice, type, beds, pageable)
                .map(propertyMapper::toDto);
    }

    @GetMapping("/{id}")
    public PropertyDTO getPropertyById(@PathVariable Long id) {
        return propertyMapper.toDto(propertyService.getPropertyById(id));
    }

    @Autowired
    com.cdac.realestate.service.FileStorageService fileStorageService;

    @Autowired
    com.cdac.realestate.service.EmailService emailService;

    // Seller: Add Property with Image
    @PostMapping(consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasAuthority('SELLER')")
    public PropertyDTO addProperty(
            @RequestPart("property") @Valid Property property,
            @RequestPart(value = "image", required = false) org.springframework.web.multipart.MultipartFile image,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        if (image != null && !image.isEmpty()) {
            String filename = fileStorageService.store(image);
            property.setImages(filename);
        }

        Property savedProperty = propertyService.addProperty(property, userDetails.getId());

        // Send Email
        emailService.sendPropertyAddedEmail(userDetails.getUsername(), userDetails.getName(), savedProperty.getTitle());

        return propertyMapper.toDto(savedProperty);
    }

    // Seller: Update Property
    @PutMapping(value = "/{id}", consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasAuthority('SELLER')")
    public PropertyDTO updateProperty(@PathVariable Long id,
            @RequestPart("property") @Valid Property property,
            @RequestPart(value = "image", required = false) org.springframework.web.multipart.MultipartFile image,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        if (image != null && !image.isEmpty()) {
            String filename = fileStorageService.store(image);
            property.setImages(filename);
        }

        return propertyMapper.toDto(propertyService.updateProperty(id, property, userDetails.getId()));
    }

    // Seller: My Listings
    @GetMapping("/my-listings")
    @PreAuthorize("hasAuthority('SELLER')")
    public List<PropertyDTO> getMyProperties(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return propertyMapper.toDtoList(propertyService.getPropertiesBySeller(userDetails.getId()));
    }

    // Seller: Delete Listing
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SELLER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok("Property deleted successfully");
    }

    // Admin: Get Pending
    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<PropertyDTO> getPendingProperties() {
        return propertyMapper.toDtoList(propertyService.getPendingProperties());
    }

    // Admin: Approve/Reject
    // Admin: Approve/Reject
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public PropertyDTO updateStatus(@PathVariable Long id,
            @RequestParam Property.PropertyStatus status,
            @RequestParam(required = false) String reason) {
        Property updatedProperty = propertyService.updateStatus(id, status, reason);

        // Send Status Email
        if (updatedProperty.getSeller() != null) {
            emailService.sendPropertyStatusEmail(
                    updatedProperty.getSeller().getEmail(),
                    updatedProperty.getSeller().getName(),
                    updatedProperty.getTitle(),
                    status.name(),
                    reason);
        }

        return propertyMapper.toDto(updatedProperty);
    }
}
