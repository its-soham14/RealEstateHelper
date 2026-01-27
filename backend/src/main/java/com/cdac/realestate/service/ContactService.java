package com.cdac.realestate.service;

import com.cdac.realestate.entity.ContactRequest;
import com.cdac.realestate.entity.Property;
import com.cdac.realestate.entity.User;
import com.cdac.realestate.repository.ContactRequestRepository;
import com.cdac.realestate.repository.PropertyRepository;
import com.cdac.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    @Autowired
    ContactRequestRepository contactRequestRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PropertyRepository propertyRepository;

    public ContactRequest createRequest(Long buyerId, Long propertyId) {
        User buyer = userRepository.findById(buyerId).orElseThrow();
        Property property = propertyRepository.findById(propertyId).orElseThrow();
        User seller = property.getSeller();

        ContactRequest request = new ContactRequest();
        request.setBuyer(buyer);
        request.setSeller(seller);
        request.setProperty(property);
        request.setStatus(ContactRequest.RequestStatus.PENDING);

        return contactRequestRepository.save(request);
    }

    public List<ContactRequest> getRequestsBySeller(Long sellerId) {
        return contactRequestRepository.findBySellerId(sellerId);
    }

    public List<ContactRequest> getRequestsByBuyer(Long buyerId) {
        return contactRequestRepository.findByBuyerId(buyerId);
    }

    public ContactRequest updateStatus(Long id, ContactRequest.RequestStatus status) {
        ContactRequest request = contactRequestRepository.findById(id).orElseThrow();
        request.setStatus(status);
        return contactRequestRepository.save(request);
    }
}
