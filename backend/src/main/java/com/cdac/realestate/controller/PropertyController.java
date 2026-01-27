package com.cdac.realestate.controller;

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

    // Public search (only approved)
    @GetMapping
    public List<Property> getAllProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Property.PropertyType type,
            @RequestParam(required = false) Integer beds) {
        return propertyService.getAllProperties(city, minPrice, maxPrice, type, beds);
    }

    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable Long id) {
        return propertyService.getPropertyById(id);
    }

    // Seller: Add Property
    @PostMapping
    @PreAuthorize("hasAuthority('SELLER')")
    public Property addProperty(@Valid @RequestBody Property property,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return propertyService.addProperty(property, userDetails.getId());
    }

    // Seller: Update Property
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('SELLER')")
    public Property updateProperty(@PathVariable Long id, @Valid @RequestBody Property property,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return propertyService.updateProperty(id, property, userDetails.getId());
    }

    // Seller: My Listings
    @GetMapping("/my-listings")
    @PreAuthorize("hasAuthority('SELLER')")
    public List<Property> getMyProperties(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return propertyService.getPropertiesBySeller(userDetails.getId());
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
    public List<Property> getPendingProperties() {
        return propertyService.getPendingProperties();
    }

    // Admin: Approve/Reject
    // Admin: Approve/Reject
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Property updateStatus(@PathVariable Long id,
            @RequestParam Property.PropertyStatus status,
            @RequestParam(required = false) String reason) {
        return propertyService.updateStatus(id, status, reason);
    }
}
