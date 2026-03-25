package org.interswitch.app.LifeLink.service;

import org.interswitch.app.LifeLink.model.Payment;
import org.interswitch.app.LifeLink.repository.PaymentRepository;
import org.interswitch.app.LifeLink.request.PaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public String createPaymentWebhook(PaymentRequest paymentRequest) {
        Payment payment = new Payment();
        payment.setData(paymentRequest.getData());
        payment.setUuid(paymentRequest.getUuid());
        payment.setEvent(paymentRequest.getEvent());
        payment.setTimestamp(paymentRequest.getTimestamp());
        payment.setAccountName(paymentRequest.getData().getMerchantCustomerName());

        paymentRepository.save(payment);
        return "Payment info received";
    }
    public static String generateHmac(String secretKey, PaymentRequest message) throws Exception {

        Mac mac = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HmacSHA512");

        mac.init(secretKeySpec);
        byte[] rawHmac = mac.doFinal(message.toString().getBytes());

        StringBuilder hex = new StringBuilder();
        for (byte b : rawHmac) {
            hex.append(String.format("%02x", b));
        }

        return hex.toString();
    }
}
