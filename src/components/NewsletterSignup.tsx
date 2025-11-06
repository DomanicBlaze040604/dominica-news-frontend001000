import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    // In production, send to backend API
    toast({
      title: "Subscribed!",
      description: "You'll receive our daily newsletter.",
    });

    setIsSubmitted(true);
    setEmail("");
    
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <Card className="bg-primary text-primary-foreground border-none shadow-2xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-foreground/10" />
      
      <CardContent className="relative p-8 md:p-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4">
            <Mail className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Stay Informed
            </h2>
            <p className="text-primary-foreground/90 text-lg">
              Get the latest news from Dominica delivered straight to your inbox
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-white/20"
            />
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="sm:w-auto hover-scale"
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Subscribed!
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>

          <p className="text-xs text-primary-foreground/70">
            Join 10,000+ readers. Unsubscribe anytime.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
