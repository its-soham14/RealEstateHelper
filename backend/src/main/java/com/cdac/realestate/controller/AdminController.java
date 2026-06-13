package com.cdac.realestate.controller;

import com.cdac.realestate.entity.User; 
import com.cdac.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;
    
    @Autowired
    private com.cdac.realestate.repository.PropertyRepository propertyRepository;

    @DeleteMapping("/users/{id}")
    @org.springframework.transaction.annotation.Transactional
    public org.springframework.http.ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            // Find all properties owned by the seller
            java.util.List<com.cdac.realestate.entity.Property> properties = propertyRepository.findBySellerId(id);
            java.util.List<Long> propertyIds = properties.stream().map(com.cdac.realestate.entity.Property::getId).collect(java.util.stream.Collectors.toList());

            if (!propertyIds.isEmpty()) {
                String idsStr = propertyIds.stream().map(String::valueOf).collect(java.util.stream.Collectors.joining(","));
                
                // Delete child rows referencing properties owned by this user
                jdbcTemplate.update("DELETE FROM contact_requests WHERE property_id IN (" + idsStr + ")");
                jdbcTemplate.update("DELETE FROM payments WHERE property_id IN (" + idsStr + ")");
                jdbcTemplate.update("DELETE FROM property_likes WHERE property_id IN (" + idsStr + ")");
                jdbcTemplate.update("DELETE FROM reviews WHERE property_id IN (" + idsStr + ")");
                jdbcTemplate.update("DELETE FROM transactions WHERE property_id IN (" + idsStr + ")");
            }

            // Delete properties owned by this user (hard delete)
            jdbcTemplate.update("DELETE FROM properties WHERE seller_id = ?", id);

            // Delete user's own child rows
            jdbcTemplate.update("DELETE FROM contact_requests WHERE buyer_id = ? OR seller_id = ?", id, id);
            jdbcTemplate.update("DELETE FROM payments WHERE buyer_id = ?", id);
            jdbcTemplate.update("DELETE FROM property_likes WHERE user_id = ?", id);
            jdbcTemplate.update("DELETE FROM reviews WHERE buyer_id = ?", id);
            jdbcTemplate.update("DELETE FROM transactions WHERE payment_by_id = ? OR payment_to_id = ?", id, id);

            // Delete the user
            userRepository.deleteById(id);
            return org.springframework.http.ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return org.springframework.http.ResponseEntity.internalServerError().body("Failed to delete user: " + e.getMessage());
        }
    }
}
