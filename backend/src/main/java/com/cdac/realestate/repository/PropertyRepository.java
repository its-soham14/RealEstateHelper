package com.cdac.realestate.repository;

import com.cdac.realestate.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {
    List<Property> findBySellerId(Long sellerId);

    List<Property> findByStatus(Property.PropertyStatus status);

    long countByStatus(Property.PropertyStatus status);

    boolean existsByTitle(String title);
}
