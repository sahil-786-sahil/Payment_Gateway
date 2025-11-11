package com.Payment_Gateway2.Payment_Gateway2.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "payment_orders")
public class PaymentOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String razorpayOrderId;
    private String razorpayPaymentId;

    private String name;
    private String email;
    private String phone;
    private String courseName;
    private Double amount;
    private String status;  // CREATED, SUCCESS, FAILED
}
