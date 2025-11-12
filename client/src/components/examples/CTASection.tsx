import CTASection from '../CTASection';

export default function CTASectionExample() {
  return (
    <CTASection 
      onJoinWaitlist={() => console.log('CTA Join waitlist clicked')} 
      onScheduleCall={() => console.log('CTA Schedule call clicked')} 
    />
  );
}
