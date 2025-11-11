package com.Payment_Gateway2.Payment_Gateway2.repo;

import com.Payment_Gateway2.Payment_Gateway2.Entity.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {
    Optional<PaymentOrder> findByRazorpayOrderId(String razorpayOrderId);
}

