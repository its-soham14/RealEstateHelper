package com.cdac.realestate.controller;

import com.cdac.realestate.entity.Payment;
import com.cdac.realestate.security.UserDetailsImpl;
import com.cdac.realestate.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasAuthority('BUYER')")
    public Payment makePayment(@RequestParam Long propertyId,
            @RequestParam Double amount,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return paymentService.processPayment(userDetails.getId(), propertyId, amount);
    }
}
