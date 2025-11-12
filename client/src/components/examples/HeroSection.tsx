import HeroSection from '../HeroSection';

export default function HeroSectionExample() {
  return (
    <HeroSection 
      onJoinWaitlist={() => console.log('Join waitlist clicked')} 
      onScheduleCall={() => console.log('Schedule call clicked')} 
    />
  );
}
