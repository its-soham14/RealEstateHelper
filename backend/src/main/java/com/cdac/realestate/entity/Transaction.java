package com.cdac.realestate.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "payment_by_id", nullable = false)
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "payment_to_id", nullable = false)
    private User seller;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(nullable = false)
    private Double amount; // The 5% token amount

    @Column(nullable = false, unique = true)
    private String transactionId; // Random UUID or from Gateway

    @Column(name = "payment_date", updatable = false)
    private LocalDateTime paymentDate;

    @PrePersist
    protected void onCreate() {
        paymentDate = LocalDateTime.now();
    }
}
