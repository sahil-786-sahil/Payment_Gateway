package com.Payment_Gateway2.Payment_Gateway2.service;

import com.Payment_Gateway2.Payment_Gateway2.Entity.PaymentOrder;
import com.Payment_Gateway2.Payment_Gateway2.repo.PaymentOrderRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final PaymentOrderRepository paymentRepo;

    @Value("${razorpay.key}")
    private String razorpayKey;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    public PaymentService(PaymentOrderRepository paymentRepo) {
        this.paymentRepo = paymentRepo;
    }

    public Order createOrder(PaymentOrder orderRequest) throws Exception {
        RazorpayClient client = new RazorpayClient(razorpayKey, razorpaySecret);

        JSONObject options = new JSONObject();
        options.put("amount", (int) (orderRequest.getAmount() * 100)); // in paise
        options.put("currency", "INR");
        options.put("receipt", "receipt_" + System.currentTimeMillis());

        Order razorOrder = client.orders.create(options);

        // Save the order in DB
        PaymentOrder paymentOrder = PaymentOrder.builder()
                .razorpayOrderId(razorOrder.get("id"))
                .name(orderRequest.getName())
                .email(orderRequest.getEmail())
                .phone(orderRequest.getPhone())
                .courseName(orderRequest.getCourseName())
                .amount(orderRequest.getAmount())
                .status("CREATED")
                .build();

        paymentRepo.save(paymentOrder);

        return razorOrder;
    }

    public void updateOrder(String razorpayOrderId, String paymentId, String status) {
        PaymentOrder existing = paymentRepo.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        existing.setRazorpayPaymentId(paymentId);
        existing.setStatus(status);
        paymentRepo.save(existing);
    }
}

