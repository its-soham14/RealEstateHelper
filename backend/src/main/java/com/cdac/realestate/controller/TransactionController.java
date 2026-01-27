package com.cdac.realestate.controller;

import com.cdac.realestate.entity.Transaction;
import com.cdac.realestate.security.UserDetailsImpl;
import com.cdac.realestate.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    TransactionService transactionService;

    @PostMapping("/book/{propertyId}")
    @PreAuthorize("hasAuthority('BUYER')")
    public Transaction bookProperty(@PathVariable Long propertyId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return transactionService.bookProperty(userDetails.getId(), propertyId);
    }

    @GetMapping("/buyer")
    @PreAuthorize("hasAuthority('BUYER')")
    public List<Transaction> getBuyerHistory(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return transactionService.getBuyerTransactions(userDetails.getId());
    }

    @GetMapping("/seller")
    @PreAuthorize("hasAuthority('SELLER')")
    public List<Transaction> getSellerHistory(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return transactionService.getSellerTransactions(userDetails.getId());
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Transaction> getAllHistory() {
        return transactionService.getAllTransactions();
    }
}
