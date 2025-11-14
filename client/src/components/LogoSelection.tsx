import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logo1 from "@assets/generated_images/Minimalist_Bcalm_wordmark_logo_615a0e8b.png";
import logo2 from "@assets/generated_images/AI_brain_icon_Bcalm_logo_880c95a8.png";
import logo3 from "@assets/generated_images/Geometric_tech_badge_logo_7f09eac2.png";
import logo4 from "@assets/generated_images/Calm_wave_symbol_logo_110709ec.png";
import logo5 from "@assets/generated_images/Circuit_network_node_logo_3907f447.png";

const logoOptions = [
  {
    id: 1,
    name: "Modern Minimalist Wordmark",
    image: logo1,
    description: "Clean, professional typography with subtle violet accent"
  },
  {
    id: 2,
    name: "AI Brain Icon + Wordmark",
    image: logo2,
    description: "Abstract neural network symbol paired with text"
  },
  {
    id: 3,
    name: "Geometric Tech Badge",
    image: logo3,
    description: "Modern geometric shapes suggesting AI/technology"
  },
  {
    id: 4,
    name: "Calm Wave Symbol",
    image: logo4,
    description: "Flowing design element playing on the 'calm' in Bcalm"
  },
  {
    id: 5,
    name: "Circuit/Node Network",
    image: logo5,
    description: "Tech-forward design with connected nodes suggesting AI"
  }
];

interface LogoSelectionProps {
  onSelectLogo: (logoId: number) => void;
}

export default function LogoSelection({ onSelectLogo }: LogoSelectionProps) {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Bcalm Logo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your favorite logo design from the options below. Each uses your brand colors (violet and navy).
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {logoOptions.map((logo) => (
            <Card key={logo.id} className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg text-center">Option {logo.id}</CardTitle>
                <p className="text-sm text-muted-foreground text-center font-semibold">
                  {logo.name}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white rounded-md p-6 border">
                  <img 
                    src={logo.image} 
                    alt={logo.name}
                    className="w-full h-auto"
                    data-testid={`img-logo-${logo.id}`}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {logo.description}
                </p>
                <Button
                  onClick={() => onSelectLogo(logo.id)}
                  className="w-full"
                  data-testid={`button-select-logo-${logo.id}`}
                >
                  Choose This Logo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
