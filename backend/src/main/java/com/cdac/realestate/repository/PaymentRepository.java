package com.cdac.realestate.repository;

import com.cdac.realestate.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBuyerId(Long buyerId);
}
