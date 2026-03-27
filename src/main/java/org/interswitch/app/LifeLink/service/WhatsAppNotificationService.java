package org.interswitch.app.LifeLink.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class WhatsAppNotificationService {

    // Get these from your Twilio Console
    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.whatsapp.number}")
    private String fromWhatsAppNumber; // Usually "whatsapp:+14155238886" for sandbox

    public void sendCaseLink(String toPhone, String patientName, String caseId) {
        Twilio.init(accountSid, authToken);

        String link = "https://lifelink.onrender.com/pay/" + caseId;
        String messageBody = String.format(
                "🚨 *LifeLink Emergency Alert*\n\n" +
                        "An emergency case has been opened for *%s*.\n" +
                        "Please contribute to reach the 60%% bridge threshold here: %s",
                patientName, link);


        Message.creator(
                        new PhoneNumber("whatsapp:+" + toPhone), // Must be in E.164 format (e.g. 23481...)
                        new PhoneNumber(fromWhatsAppNumber),
                        messageBody)
                .create();
    }

    public void sendBridgeUnlockAlert(String toPhone) {
        Twilio.init(accountSid, authToken);

        String messageBody = "⚡ *Bridge Credit Unlocked!*\n\n" +
                "Your community has raised 60%. You can now apply for the 40% Bridge Loan " +
                "to start treatment immediately. Check your dashboard.";

        Message.creator(
                        new PhoneNumber("whatsapp:+" + toPhone),
                        new PhoneNumber(fromWhatsAppNumber),
                        messageBody)
                .create();
    }
}