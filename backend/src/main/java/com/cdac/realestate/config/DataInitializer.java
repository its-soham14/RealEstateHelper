package com.cdac.realestate.config;

import com.cdac.realestate.entity.User;
import com.cdac.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    com.cdac.realestate.repository.PropertyRepository propertyRepository;

    @Override
    public void run(String... args) throws Exception {
        // Admin
        if (!userRepository.existsByEmail("admin@test.com")) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@test.com");
            admin.setPassword(encoder.encode("admin123"));
            admin.setPhone("9999999999");
            admin.setAddress("Admin HQ");
            admin.setRole(User.Role.ADMIN);

            userRepository.save(admin);
            System.out.println("Seeded: admin@test.com");
        }

        // Seller
        User seller = null;
        if (!userRepository.existsByEmail("seller@test.com")) {
            seller = new User();
            seller.setName("John Seller");
            seller.setEmail("seller@test.com");
            seller.setPassword(encoder.encode("seller123"));
            seller.setPhone("9876543210");
            seller.setAddress("123 Seller St");
            seller.setCompanyName("Best Homes Ltd");
            seller.setRole(User.Role.SELLER);

            seller = userRepository.save(seller);
            System.out.println("Seeded: seller@test.com");
        } else {
            seller = userRepository.findByEmail("seller@test.com").orElse(null);
        }

        // Buyer
        User buyer = null;
        if (!userRepository.existsByEmail("buyer@test.com")) {
            buyer = new User();
            buyer.setName("Alice Buyer");
            buyer.setEmail("buyer@test.com");
            buyer.setPassword(encoder.encode("buyer123"));
            buyer.setPhone("8765432109");
            buyer.setAddress("456 Buyer Ln");
            buyer.setRole(User.Role.BUYER);

            buyer = userRepository.save(buyer);
            System.out.println("Seeded: buyer@test.com");
        } else {
            buyer = userRepository.findByEmail("buyer@test.com").orElse(null);
        }

        // Properties
        // Properties - Checked individually to ensure comprehensive data
        // Properties - Checked by TITLE to avoid duplicates and ensure correct status
        if (seller != null) {
            // 1. APPROVED Property
            if (!propertyRepository.existsByTitle("Luxury Villa in Mumbai")) {
                com.cdac.realestate.entity.Property p1 = new com.cdac.realestate.entity.Property();
                p1.setSeller(seller);
                p1.setTitle("Luxury Villa in Mumbai");
                p1.setType(com.cdac.realestate.entity.Property.PropertyType.HOUSE);
                p1.setPrice(25000000.0);
                p1.setArea("3500 sqft");
                p1.setBeds(4);
                p1.setBaths(4);
                p1.setBhk("4BHK");
                p1.setAddress("Juhu Beach Road");
                p1.setCity("Mumbai");
                p1.setDescription("Beautiful sea-facing villa with modern amenities.");
                p1.setStatus(com.cdac.realestate.entity.Property.PropertyStatus.APPROVED);
                p1.setImages(
                        "https://images.unsplash.com/photo-1600596542815-e3285e694c95?auto=format&fit=crop&w=800&q=80");
                propertyRepository.save(p1);
                System.out.println("Seeded: Luxury Villa (APPROVED)");
            }

            // 2. SOLD Property (for History)
            if (!propertyRepository.existsByTitle("Modern Applied Apartment")) {
                com.cdac.realestate.entity.Property p2 = new com.cdac.realestate.entity.Property();
                p2.setSeller(seller);
                p2.setTitle("Modern Applied Apartment");
                p2.setType(com.cdac.realestate.entity.Property.PropertyType.HOUSE);
                p2.setPrice(8500000.0);
                p2.setArea("1200 sqft");
                p2.setBeds(2);
                p2.setBaths(2);
                p2.setBhk("2BHK");
                p2.setAddress("Koramangala");
                p2.setCity("Bangalore");
                p2.setDescription("Centrally located apartment near tech parks.");
                p2.setStatus(com.cdac.realestate.entity.Property.PropertyStatus.SOLD);
                p2.setImages(
                        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80");
                propertyRepository.save(p2);
                System.out.println("Seeded: Modern Apartment (SOLD)");
            }

            // 3. PENDING Property (for Admin Approval)
            if (!propertyRepository.existsByTitle("Farm Land in Pune")) {
                com.cdac.realestate.entity.Property p3 = new com.cdac.realestate.entity.Property();
                p3.setSeller(seller);
                p3.setTitle("Farm Land in Pune");
                p3.setType(com.cdac.realestate.entity.Property.PropertyType.LAND);
                p3.setPrice(5000000.0);
                p3.setArea("2 Acres");
                p3.setAddress("Mulshi");
                p3.setCity("Pune");
                p3.setDescription("Fertile land suitable for organic farming.");
                p3.setStatus(com.cdac.realestate.entity.Property.PropertyStatus.PENDING);
                p3.setImages(
                        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80");
                propertyRepository.save(p3);
                System.out.println("Seeded: Farm Land (PENDING)");
            }
        }
    }
}
