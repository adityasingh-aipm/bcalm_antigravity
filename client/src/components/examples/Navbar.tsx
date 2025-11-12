import Navbar from '../Navbar';

export default function NavbarExample() {
  return (
    <div className="h-screen">
      <Navbar 
        onJoinWaitlist={() => console.log('Nav Join waitlist clicked')} 
        onScheduleCall={() => console.log('Nav Schedule call clicked')} 
      />
      <div className="pt-20 p-8">
        <p className="text-muted-foreground">Scroll down to see the navbar change</p>
        <div className="h-[200vh]"></div>
      </div>
    </div>
  );
}
