package com.cdac.realestate.service;

import com.cdac.realestate.entity.Property;
import com.cdac.realestate.entity.PropertyLike;
import com.cdac.realestate.entity.User;
import com.cdac.realestate.repository.LikeRepository;
import com.cdac.realestate.repository.PropertyRepository;
import com.cdac.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LikeService {

    @Autowired
    LikeRepository likeRepository;

    @Autowired
    PropertyRepository propertyRepository;

    @Autowired
    UserRepository userRepository;

    @Transactional
    public boolean toggleLike(Long userId, Long propertyId) {
        if (likeRepository.existsByUserIdAndPropertyId(userId, propertyId)) {
            likeRepository.deleteByUserIdAndPropertyId(userId, propertyId);
            return false; // Unliked
        } else {
            User user = userRepository.findById(userId).orElseThrow();
            Property property = propertyRepository.findById(propertyId).orElseThrow();

            PropertyLike like = new PropertyLike();
            like.setUser(user);
            like.setProperty(property);
            likeRepository.save(like);
            return true; // Liked
        }
    }

    public List<Property> getUserWishlist(Long userId) {
        return likeRepository.findByUserId(userId).stream()
                .map(PropertyLike::getProperty)
                .collect(Collectors.toList());
    }

    public List<PropertyLike> getSellerLikes(Long sellerId) {
        return likeRepository.findByPropertySellerId(sellerId);
    }

    public boolean isLiked(Long userId, Long propertyId) {
        return likeRepository.existsByUserIdAndPropertyId(userId, propertyId);
    }
}
