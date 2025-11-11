package com.Payment_Gateway2.Payment_Gateway2.Controller;
import com.Payment_Gateway2.Payment_Gateway2.Entity.PaymentOrder;
import com.Payment_Gateway2.Payment_Gateway2.service.PaymentService;
import com.razorpay.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentOrder orderRequest) {
        try {
            Order razorOrder = paymentService.createOrder(orderRequest);
            return ResponseEntity.ok(razorOrder.toJson());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/update-order")
    public ResponseEntity<?> updateOrder(
            @RequestParam String orderId,
            @RequestParam String paymentId,
            @RequestParam String status
    ) {
        try {
            paymentService.updateOrder(orderId, paymentId, status);
            return ResponseEntity.ok("Order updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed: " + e.getMessage());
        }
    }
}

