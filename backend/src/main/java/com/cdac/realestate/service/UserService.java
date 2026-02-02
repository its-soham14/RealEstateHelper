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

    public User updateUserProfile(Long id, com.cdac.realestate.dto.UserUpdateDTO dto) {
        User user = getUserById(id);

        if (dto.getName() != null)
            user.setName(dto.getName());
        if (dto.getPhone() != null)
            user.setPhone(dto.getPhone());
        if (dto.getAddress() != null)
            user.setAddress(dto.getAddress());
        if (dto.getCompanyName() != null)
            user.setCompanyName(dto.getCompanyName());
        if (dto.getCity() != null)
            user.setCity(dto.getCity());
        if (dto.getState() != null)
            user.setState(dto.getState());
        if (dto.getZip() != null)
            user.setZip(dto.getZip());

        return userRepository.save(user);
    }
}
