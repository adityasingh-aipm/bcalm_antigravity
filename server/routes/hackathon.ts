import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { insertHackathonRegistrationSchema } from "@shared/schema";
import { sendOtpSms, isTwilioConfigured } from "../services/twilio";

const router = Router();

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/register", async (req: Request, res: Response) => {
  try {
    const validationResult = insertHackathonRegistrationSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validationResult.error.errors 
      });
    }

    const { fullName, phone, email, companyOrCollege, utmSource, utmMedium, utmCampaign } = req.body;

    const existingByPhone = await storage.getHackathonRegistrationByPhone(phone);
    if (existingByPhone && existingByPhone.isVerified) {
      return res.status(400).json({ error: "This phone number is already registered" });
    }

    const existingByEmail = await storage.getHackathonRegistrationByEmail(email);
    if (existingByEmail && existingByEmail.isVerified) {
      return res.status(400).json({ error: "This email is already registered" });
    }

    let registration;
    
    if (existingByPhone && !existingByPhone.isVerified) {
      registration = existingByPhone;
    } else if (existingByEmail && !existingByEmail.isVerified) {
      registration = existingByEmail;
    } else {
      registration = await storage.createHackathonRegistration({
        fullName,
        phone,
        email,
        companyOrCollege,
        utmSource,
        utmMedium,
        utmCampaign,
      });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await storage.updateHackathonOtp(registration.id, otp, expiresAt);

    const twilioConfigured = await isTwilioConfigured();
    if (twilioConfigured) {
      const smsSent = await sendOtpSms(phone, otp);
      if (!smsSent) {
        console.warn("SMS failed to send, OTP still stored in database");
      }
    }

    res.json({ 
      id: registration.id, 
      message: "OTP sent successfully"
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/verify", async (req: Request, res: Response) => {
  try {
    const { registrationId, otp } = req.body;

    if (!registrationId || !otp) {
      return res.status(400).json({ error: "Registration ID and OTP are required" });
    }

    const registration = await storage.getHackathonRegistrationById(registrationId);

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    if (!registration.otpCode || !registration.otpExpiresAt) {
      return res.status(400).json({ error: "No OTP found. Please request a new one." });
    }

    if (new Date() > registration.otpExpiresAt) {
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    if (registration.otpCode !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    await storage.verifyHackathonRegistration(registrationId);

    res.json({ success: true, message: "Registration verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
});

router.post("/resend-otp", async (req: Request, res: Response) => {
  try {
    const { registrationId } = req.body;

    if (!registrationId) {
      return res.status(400).json({ error: "Registration ID is required" });
    }

    const registration = await storage.getHackathonRegistrationById(registrationId);

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await storage.updateHackathonOtp(registrationId, otp, expiresAt);

    const twilioConfigured = await isTwilioConfigured();
    if (twilioConfigured) {
      const smsSent = await sendOtpSms(registration.phone, otp);
      if (!smsSent) {
        console.warn("SMS failed to send on resend, OTP still stored in database");
      }
    }

    res.json({ 
      success: true, 
      message: "OTP resent successfully"
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ error: "Failed to resend OTP" });
  }
});

export default router;
