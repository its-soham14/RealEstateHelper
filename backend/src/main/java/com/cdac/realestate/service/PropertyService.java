package com.cdac.realestate.service;

import com.cdac.realestate.entity.Property;
import com.cdac.realestate.entity.User;
import com.cdac.realestate.repository.PropertyRepository;
import com.cdac.realestate.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class PropertyService {

    @Autowired
    PropertyRepository propertyRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @jakarta.annotation.PostConstruct
    public void fixDatabaseEnum() {
        try {
            jdbcTemplate.execute("ALTER TABLE properties MODIFY COLUMN type VARCHAR(255)");
            System.out.println("Successfully updated 'type' column to VARCHAR(255)");
        } catch (Exception e) {
            System.err.println("Failed to update 'type' column: " + e.getMessage());
        }
    }

    public Property addProperty(Property property, Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        property.setSeller(seller);
        property.setStatus(Property.PropertyStatus.PENDING); // Default pending
        return propertyRepository.save(property);
    }

    public org.springframework.data.domain.Page<Property> getAllProperties(String city, Double minPrice, Double maxPrice,
            Property.PropertyType type, Integer beds, org.springframework.data.domain.Pageable pageable) {

        Specification<Property> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // APPROVED and SOLD properties for public search
            predicates.add(cb.or(
                    cb.equal(root.get("status"), Property.PropertyStatus.APPROVED),
                    cb.equal(root.get("status"), Property.PropertyStatus.SOLD)));

            if (StringUtils.hasText(city)) {
                String searchStr = "%" + city.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("city")), searchStr),
                        cb.like(cb.lower(root.get("title")), searchStr),
                        cb.like(cb.lower(root.get("address")), searchStr)
                ));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            if (beds != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("beds"), beds));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return propertyRepository.findAll(spec, pageable);
    }

    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
    }

    public List<Property> getPropertiesBySeller(Long sellerId) {
        return propertyRepository.findBySellerId(sellerId);
    }

    public List<Property> getPendingProperties() {
        return propertyRepository.findByStatus(Property.PropertyStatus.PENDING);
    }

    public Property updateStatus(Long id, Property.PropertyStatus status, String reason) {
        Property property = getPropertyById(id);
        property.setStatus(status);
        if (status == Property.PropertyStatus.REJECTED && reason != null) {
            property.setRejectionReason(reason);
        } else if (status == Property.PropertyStatus.APPROVED) {
            property.setRejectionReason(null); // Clear reason if approved
        }
        return propertyRepository.save(property);
    }

    public Property updateProperty(Long id, Property propertyDetails, Long sellerId) {
        Property property = getPropertyById(id);

        if (!property.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized: You do not own this property");
        }

        property.setTitle(propertyDetails.getTitle());
        property.setDescription(propertyDetails.getDescription());
        property.setPrice(propertyDetails.getPrice());
        property.setAddress(propertyDetails.getAddress());
        property.setCity(propertyDetails.getCity());
        property.setType(propertyDetails.getType());
        property.setArea(propertyDetails.getArea());
        property.setBeds(propertyDetails.getBeds());
        property.setBaths(propertyDetails.getBaths());
        property.setBhk(propertyDetails.getBhk());
        property.setAdditionalDetails(propertyDetails.getAdditionalDetails());

        if (propertyDetails.getImages() != null && !propertyDetails.getImages().isEmpty()) {
            property.setImages(propertyDetails.getImages());
        }

        property.setStatus(Property.PropertyStatus.PENDING);

        return propertyRepository.save(property);
    }

    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }
}
