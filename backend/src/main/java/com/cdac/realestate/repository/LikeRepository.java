package com.cdac.realestate.repository;

import com.cdac.realestate.entity.PropertyLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<PropertyLike, Long> {
    List<PropertyLike> findByUserId(Long userId);

    List<PropertyLike> findByPropertySellerId(Long sellerId);

    boolean existsByUserIdAndPropertyId(Long userId, Long propertyId);

    void deleteByUserIdAndPropertyId(Long userId, Long propertyId);

    long countByPropertyId(Long propertyId);
}
