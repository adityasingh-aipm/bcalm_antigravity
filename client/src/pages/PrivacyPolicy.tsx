import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Back Link */}
      <div className="bg-secondary/50 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link to="/" className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-privacy-title">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-8" data-testid="text-privacy-updated">Last Updated: November 26, 2025</p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Bcalm ("we," "us," "our," or "Company") operates the website bcalm.org (the "Website") and provides AI Product Management courses and educational services (the "Services"). This Privacy Policy explains how we collect, use, disclose, and otherwise handle your information when you use our Website and Services.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We are committed to protecting your privacy and ensuring you have a positive experience. Please read this Privacy Policy carefully to understand our privacy practices.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
          
          <h3 className="text-lg font-semibold mb-3 mt-6">2.1 Information You Provide Directly</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Account Information:</strong> Name, email address, phone number, educational background, professional experience</li>
            <li><strong>Course Registration:</strong> Course enrollment details, payment information, learning progress</li>
            <li><strong>Communication:</strong> Messages sent via WhatsApp, email, contact forms, support tickets</li>
            <li><strong>Profile Data:</strong> Educational qualifications, career goals, product management experience level</li>
            <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely)</li>
            <li><strong>Feedback:</strong> Course reviews, testimonials, survey responses</li>
          </ul>

          <h3 className="text-lg font-semibold mb-3 mt-6">2.2 Information Collected Automatically</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Device Information:</strong> Device type, operating system, browser type, IP address</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, downloads, course modules accessed</li>
            <li><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</li>
            <li><strong>Location Data:</strong> Approximate location based on IP address</li>
          </ul>

          <h3 className="text-lg font-semibold mb-3 mt-6">2.3 Information from Third Parties</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li><strong>Payment Processors:</strong> Transaction confirmations and billing status</li>
            <li><strong>Google Sheets Integration:</strong> Your course data synced with your approved Google Sheets</li>
            <li><strong>Social Media:</strong> Profile information if you link your social media account</li>
            <li><strong>WhatsApp Integration:</strong> Your WhatsApp messages and metadata for customer support</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">We use collected information for:</p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2">
            <li>Course Delivery: Providing access to course content, assignments, and educational materials</li>
            <li>Communication: Sending course updates, notifications, administrative messages</li>
            <li>Account Management: Creating and managing your account, verifying your identity</li>
            <li>Payment Processing: Processing tuition payments and issuing invoices</li>
            <li>Learning Analytics: Tracking course progress, understanding learning patterns</li>
            <li>Customer Support: Responding to your queries, providing technical assistance</li>
            <li>Marketing: Sending promotional emails, course announcements (with your consent)</li>
            <li>Content Improvement: Analyzing feedback, conducting surveys, improving Services</li>
            <li>Legal Compliance: Complying with applicable laws and regulations</li>
            <li>Fraud Prevention: Detecting and preventing fraudulent activities</li>
          </ol>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Legal Basis for Processing</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">We process your information based on:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li><strong>Contract Performance:</strong> Processing necessary to provide Services you've subscribed to</li>
            <li><strong>Legitimate Interests:</strong> Improving Services, preventing fraud, security, analytics</li>
            <li><strong>Consent:</strong> Marketing communications, cookies, data integrations</li>
            <li><strong>Legal Obligation:</strong> Compliance with applicable laws and regulations</li>
            <li><strong>Vital Interests:</strong> Protecting health, safety, and rights of individuals</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Data Sharing and Disclosure</h2>
          
          <h3 className="text-lg font-semibold mb-3 mt-6">5.1 We Do NOT Sell Your Data</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We do not sell, trade, or rent your personal information to third parties for marketing purposes.
          </p>

          <h3 className="text-lg font-semibold mb-3 mt-6">5.2 Information We Share</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">We may share your information with:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li><strong>Service Providers:</strong> Payment processors, email platforms, WhatsApp, Google Sheets</li>
            <li><strong>Legal Requirements:</strong> When required by law, court orders, or government requests</li>
            <li><strong>Protection of Rights:</strong> To enforce our Terms of Service, protect rights and property</li>
            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
            <li><strong>Aggregated Data:</strong> De-identified, aggregated data for analytics and research</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li><strong>Active Course Data:</strong> Retained while enrolled and for 1 year after completion</li>
            <li><strong>Account Information:</strong> Retained while your account is active</li>
            <li><strong>Payment Records:</strong> Retained for 7 years (for tax and legal compliance)</li>
            <li><strong>Communications:</strong> Retained for 1 year unless legal requirements require longer</li>
            <li><strong>Deleted Data:</strong> Securely deleted; backup copies may exist for 30 days</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            You can request data deletion at any time (subject to legal retention obligations).
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Your Privacy Rights</h2>
          
          <h3 className="text-lg font-semibold mb-3 mt-6">7.1 India - DPDP Act Rights</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            If you're a resident of India, you have rights under the Digital Personal Data Protection Act, 2023:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
            <li><strong>Right to Correction:</strong> Request correction of inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your data (subject to exceptions)</li>
            <li><strong>Right to Data Portability:</strong> Request your data in a structured format</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing</li>
          </ul>

          <h3 className="text-lg font-semibold mb-3 mt-6">7.2 EU/EEA - GDPR Rights</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            If you're a resident of the EU/EEA, you have rights under GDPR:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li>Right of Access to personal data</li>
            <li>Right to Rectification of inaccurate data</li>
            <li>Right to Erasure ("Right to be forgotten")</li>
            <li>Right to Restrict Processing</li>
            <li>Right to Data Portability</li>
            <li>Right to Object to processing</li>
            <li>Right not to be Subject to Automated Decision-making</li>
          </ul>

          <h3 className="text-lg font-semibold mb-3 mt-6">7.3 US/California - CCPA Rights</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            If you're a California resident, you have CCPA rights:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Right to Know:</strong> What personal information is collected and used</li>
            <li><strong>Right to Delete:</strong> Request deletion of your personal data</li>
            <li><strong>Right to Opt-Out:</strong> Opt out of data sales (we don't sell data)</li>
            <li><strong>Right to Non-Discrimination:</strong> Non-discriminatory treatment for exercising CCPA rights</li>
          </ul>

          <h3 className="text-lg font-semibold mb-3 mt-6">7.4 Exercising Your Rights</h3>
          <p className="text-muted-foreground leading-relaxed">
            To exercise any of these rights, email us at <strong>privacy@bcalm.org</strong> with your name, email, and clear description of your request. We'll respond within 15-30 days.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Cookies and Tracking Technologies</h2>
          
          <h3 className="text-lg font-semibold mb-3 mt-6">8.1 Types of Cookies We Use</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Essential Cookies:</strong> Required for website functionality, login, security</li>
            <li><strong>Analytics Cookies:</strong> Track website usage patterns (Google Analytics)</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            <li><strong>Marketing Cookies:</strong> Used for personalized content and ads</li>
          </ul>

          <h3 className="text-lg font-semibold mb-3 mt-6">8.2 Cookie Management</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Disable cookies via browser settings (may affect functionality)</li>
            <li>We use Google Analytics for usage insights (anonymized)</li>
            <li>Opt out of Google Analytics via Google's opt-out extension</li>
          </ul>
        </section>

        {/* Section 9 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">9. Security</h2>
          
          <h3 className="text-lg font-semibold mb-3 mt-6">9.1 Security Measures</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Encryption:</strong> HTTPS/TLS encryption for data in transit</li>
            <li><strong>Access Controls:</strong> Role-based access to data, password protection</li>
            <li><strong>Data Segregation:</strong> Separate storage for sensitive information</li>
            <li><strong>Regular Audits:</strong> Security reviews and vulnerability assessments</li>
            <li><strong>Staff Training:</strong> Privacy and security awareness for employees</li>
          </ul>

          <h3 className="text-lg font-semibold mb-3 mt-6">9.2 Data Breaches</h3>
          <p className="text-muted-foreground leading-relaxed">
            In case of unauthorized access or data breach, we will notify affected individuals within legally required timeframes and provide guidance on protective measures.
          </p>
        </section>

        {/* Section 10 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">10. International Data Transfers</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you're outside India, your data may be transferred to and processed in India, where Bcalm is based. By using our Services, you consent to such transfers. We ensure appropriate safeguards through Standard Contractual Clauses and privacy agreements.
          </p>
        </section>

        {/* Section 11 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">11. Children's Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Bcalm Services are not intended for children under 18. We do not knowingly collect information from children. If we become aware of data collection from a minor, we will delete it and notify parents/guardians.
          </p>
        </section>

        {/* Section 12 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">12. Marketing and Communications</h2>
          
          <h3 className="text-lg font-semibold mb-3 mt-6">12.1 Email Marketing</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We send course updates, announcements, and promotional content. You can unsubscribe via the link in emails, manage preferences in your account, or email us to opt out.
          </p>

          <h3 className="text-lg font-semibold mb-3 mt-6">12.2 WhatsApp Communications</h3>
          <p className="text-muted-foreground leading-relaxed">
            We use WhatsApp for course notifications and support. You can opt out by messaging "STOP" or contacting us to stop messaging.
          </p>
        </section>

        {/* Section 13 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">13. Third-Party Links</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our Website may contain links to third-party websites. We are not responsible for their privacy practices. Please review their privacy policies.
          </p>
        </section>

        {/* Section 14 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">14. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            For privacy questions, concerns, or to exercise your rights, contact us:
          </p>
          <div className="bg-secondary/50 p-4 rounded-md border border-border">
            <p className="text-foreground"><strong>Email:</strong> privacy@bcalm.org</p>
          </div>
        </section>

        {/* Footer */}
        <section className="mt-12 pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm">
            This Privacy Policy is effective as of November 26, 2025.
          </p>
        </section>
      </div>
    </div>
  );
}
