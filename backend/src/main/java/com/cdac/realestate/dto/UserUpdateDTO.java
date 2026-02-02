package com.cdac.realestate.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateDTO {
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Name must contain only alphabets and spaces")
    private String name;

    @Pattern(regexp = "^\\d{10}$", message = "Phone must be exactly 10 digits")
    private String phone;

    private String companyName;

    // Address Validations as requested
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Address must contain only alphabets and spaces")
    private String address;

    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "City must contain only alphabets and spaces")
    private String city;

    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "State must contain only alphabets and spaces")
    private String state;

    @Pattern(regexp = "^\\d{6}$", message = "Zip must be 6 digits")
    private String zip;
}
