package com.cdac.realestate.service;

import com.cdac.realestate.entity.Property;
import com.cdac.realestate.entity.Transaction;
import com.cdac.realestate.entity.User;
import com.cdac.realestate.repository.PropertyRepository;
import com.cdac.realestate.repository.TransactionRepository;
import com.cdac.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    TransactionRepository transactionRepository;

    @Autowired
    PropertyRepository propertyRepository;

    @Autowired
    UserRepository userRepository;

    @Transactional
    public Transaction bookProperty(Long buyerId, Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (property.getStatus() == Property.PropertyStatus.SOLD) {
            throw new RuntimeException("Property is already SOLD");
        }

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        // Calculate 5% token amount
        double tokenAmount = property.getPrice() * 0.05;

        // Create Transaction
        Transaction transaction = new Transaction();
        transaction.setBuyer(buyer);
        transaction.setSeller(property.getSeller());
        transaction.setProperty(property);
        transaction.setAmount(tokenAmount);
        transaction.setTransactionId(UUID.randomUUID().toString()); // Mock Transaction ID

        transactionRepository.save(transaction);

        // Update Property Status
        property.setStatus(Property.PropertyStatus.SOLD);
        propertyRepository.save(property);

        return transaction;
    }

    public List<Transaction> getBuyerTransactions(Long buyerId) {
        return transactionRepository.findByBuyerId(buyerId);
    }

    public List<Transaction> getSellerTransactions(Long sellerId) {
        return transactionRepository.findBySellerId(sellerId);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
