package com.cdac.realestate.repository;

import com.cdac.realestate.entity.ContactRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContactRequestRepository extends JpaRepository<ContactRequest, Long> {
    List<ContactRequest> findBySellerId(Long sellerId);

    List<ContactRequest> findByBuyerId(Long buyerId);

    List<ContactRequest> findByPropertyId(Long propertyId);
}
