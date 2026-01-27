package com.cdac.realestate.service;

import com.cdac.realestate.entity.User;
import com.cdac.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUserProfile(Long id, User userDetails) {
        User user = getUserById(id);

        if (userDetails.getName() != null)
            user.setName(userDetails.getName());
        if (userDetails.getPhone() != null)
            user.setPhone(userDetails.getPhone());
        if (userDetails.getAddress() != null)
            user.setAddress(userDetails.getAddress());
        if (userDetails.getCompanyName() != null)
            user.setCompanyName(userDetails.getCompanyName());
        // Email and Role usually not editable by user for security in MVP

        return userRepository.save(user);
    }
}
