package com.cdac.realestate.service;

import com.cdac.realestate.entity.Payment;
import com.cdac.realestate.entity.Property;
import com.cdac.realestate.entity.User;
import com.cdac.realestate.repository.PaymentRepository;
import com.cdac.realestate.repository.PropertyRepository;
import com.cdac.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PropertyRepository propertyRepository;

    public Payment processPayment(Long buyerId, Long propertyId, Double amount) {
        User buyer = userRepository.findById(buyerId).orElseThrow();
        Property property = propertyRepository.findById(propertyId).orElseThrow();

        Payment payment = new Payment();
        payment.setBuyer(buyer);
        payment.setProperty(property);
        payment.setAmount(amount);
        payment.setPaymentStatus(Payment.PaymentStatus.COMPLETED); // Mock success
        payment.setTransactionId(UUID.randomUUID().toString());

        return paymentRepository.save(payment);
    }
}
