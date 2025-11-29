// Twilio SMS Service for Hackathon OTP
// Uses Replit Twilio integration for secure credential management

import twilio from 'twilio';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  const response = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=twilio',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  );
  
  const data = await response.json();
  console.log('Twilio connector response items count:', data.items?.length);
  
  connectionSettings = data.items?.[0];
  
  if (connectionSettings) {
    console.log('Twilio settings keys:', Object.keys(connectionSettings.settings || {}));
    console.log('Account SID first 5 chars:', connectionSettings.settings?.account_sid?.substring(0, 5));
    console.log('API Key first 5 chars:', connectionSettings.settings?.api_key?.substring(0, 5));
    console.log('Has phone number:', !!connectionSettings.settings?.phone_number);
  }

  if (!connectionSettings || (!connectionSettings.settings.account_sid || !connectionSettings.settings.api_key || !connectionSettings.settings.api_key_secret)) {
    throw new Error('Twilio not connected');
  }
  return {
    accountSid: connectionSettings.settings.account_sid,
    apiKey: connectionSettings.settings.api_key,
    apiKeySecret: connectionSettings.settings.api_key_secret,
    phoneNumber: connectionSettings.settings.phone_number
  };
}

export async function getTwilioClient() {
  const { accountSid, apiKey, apiKeySecret } = await getCredentials();
  return twilio(apiKey, apiKeySecret, {
    accountSid
  });
}

export async function getAccountSid() {
  const { accountSid } = await getCredentials();
  return accountSid;
}

export async function getTwilioFromPhoneNumber() {
  const { phoneNumber } = await getCredentials();
  return phoneNumber;
}

export async function sendOtpSms(toPhoneNumber: string, otp: string): Promise<boolean> {
  try {
    const credentials = await getCredentials();
    
    if (!credentials.accountSid?.startsWith('AC')) {
      console.warn('Twilio Account SID must start with "AC". Current value appears incorrect.');
      console.warn('Please update the Twilio integration with valid credentials from your Twilio console.');
      return false;
    }
    
    if (!credentials.apiKey?.startsWith('SK')) {
      console.warn('Twilio API Key must start with "SK". Current value appears incorrect.');
      return false;
    }
    
    const client = await getTwilioClient();
    const fromNumber = await getTwilioFromPhoneNumber();
    
    if (!fromNumber) {
      console.error('No Twilio phone number configured');
      return false;
    }
    
    const formattedPhone = toPhoneNumber.startsWith('+91') 
      ? toPhoneNumber 
      : `+91${toPhoneNumber}`;
    
    await client.messages.create({
      body: `Your Bcalm Hackathon verification code is: ${otp}. Valid for 10 minutes.`,
      from: fromNumber,
      to: formattedPhone
    });
    
    console.log(`SMS sent successfully to ${formattedPhone}`);
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}

export async function isTwilioConfigured(): Promise<boolean> {
  try {
    await getCredentials();
    return true;
  } catch {
    return false;
  }
}
