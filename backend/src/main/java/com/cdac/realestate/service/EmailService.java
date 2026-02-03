package com.cdac.realestate.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Async
    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("realestatehelperteam@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            javaMailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Error sending email to " + to + ": " + e.getMessage());
            // We suppress exception to not break the main flow (e.g. signup should succeed
            // even if email fails)
        }
    }

    @Async
    public void sendWelcomeEmail(String to, String name) {
        String subject = "Welcome to RealEstateHelper!";
        String text = "Dear " + name + ",\n\n" +
                "Welcome to RealEstateHelper! We are excited to have you on board.\n\n" +
                "You can now explore properties, contact sellers, or list your own properties (if you are a seller).\n\n"
                +
                "Best Regards,\n" +
                "RealEstateHelper Team";
        sendSimpleMessage(to, subject, text);
    }

    @Async
    public void sendPropertyAddedEmail(String to, String name, String propertyTitle) {
        String subject = "Property Listed Successfully - Pending Approval";
        String text = "Dear " + name + ",\n\n" +
                "Your property '" + propertyTitle + "' has been successfully submitted.\n" +
                "It is currently 'PENDING' approval from our admin team. You will be notified once it is approved or rejected.\n\n"
                +
                "Best Regards,\n" +
                "RealEstateHelper Team";
        sendSimpleMessage(to, subject, text);
    }

    @Async
    public void sendPropertyStatusEmail(String to, String name, String propertyTitle, String status, String reason) {
        String subject = "Property Status Update: " + propertyTitle;
        String text = "Dear " + name + ",\n\n" +
                "Your property '" + propertyTitle + "' status has been updated to: " + status + ".\n\n";

        if ("REJECTED".equals(status)) {
            text += "Reason for Rejection: " + (reason != null ? reason : "Not specified") + "\n\n" +
                    "Please edit your property details and resubmit for approval.\n\n";
        } else if ("APPROVED".equals(status)) {
            text += "Your property is now live on our platform!\n\n";
        }

        text += "Best Regards,\n" +
                "RealEstateHelper Team";
        sendSimpleMessage(to, subject, text);
    }
}
