package com.createwad.wad_backend.service;

import com.createwad.wad_backend.domain.User;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import java.security.SecureRandom;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private SecureRandom random = new SecureRandom();

    // 비동기 처리를 제거
    public String sendVerificationCode(User user) throws Exception {  // 예외를 throw합니다.
        String verificationCode = generateVerificationCode();
        String messageContent = "Your verification code is: " + verificationCode;
        sendHtmlMessage(user.getEmail(), "Email Verification Code", messageContent);

        System.out.println("Verification email sent to " + user.getEmail()); // 로깅
        return verificationCode;
    }

    public void sendHtmlMessage(String to, String subject, String htmlBody) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom("wad@google.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        mailSender.send(message);

        System.out.println("Email sent successfully to " + to);
    }

    private String generateVerificationCode() {
        return String.format("%06d", random.nextInt(1000000));
    }
}
