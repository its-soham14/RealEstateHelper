package com.cdac.realestate.controller;

import com.cdac.realestate.entity.ContactRequest;
import com.cdac.realestate.security.UserDetailsImpl;
import com.cdac.realestate.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    ContactService contactService;

    // Buyer: Contact Seller
    @PostMapping("/{propertyId}")
    @PreAuthorize("hasAuthority('BUYER')")
    public ContactRequest contactSeller(@PathVariable Long propertyId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return contactService.createRequest(userDetails.getId(), propertyId);
    }

    // Seller: Get Leads
    @GetMapping("/seller")
    @PreAuthorize("hasAuthority('SELLER')")
    public List<ContactRequest> getSellerLeads(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return contactService.getRequestsBySeller(userDetails.getId());
    }

    // Buyer: Get My Requests
    @GetMapping("/buyer")
    @PreAuthorize("hasAuthority('BUYER')")
    public List<ContactRequest> getBuyerRequests(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return contactService.getRequestsByBuyer(userDetails.getId());
    }

    // Seller: Update Status
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('SELLER')")
    public ContactRequest updateStatus(@PathVariable Long id, @RequestParam ContactRequest.RequestStatus status) {
        return contactService.updateStatus(id, status);
    }
}
