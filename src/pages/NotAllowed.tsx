import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, AlertTriangle, ArrowLeft, Eye, Fingerprint } from "lucide-react";

const NotAllowed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen glass-card text-foreground relative overflow-hidden flex flex-col items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/10 blur-xl floating" />
        <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-secondary/10 blur-xl floating-delayed" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 rounded-full bg-accent/10 blur-xl floating" />
        <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full bg-primary/10 blur-xl floating-delayed" />
      </div>

      {/* Main content */}
      <div className="p-12 max-w-4xl mx-auto text-center relative z-10 w-full">
        {/* Security shield icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl scale-150" />
          <div className="relative w-24 h-24 mx-auto bg-destructive/20 rounded-full flex items-center justify-center border border-destructive/30">
            <Shield className="w-12 h-12 text-destructive" />
          </div>
        </div>

        {/* Main heading with enhanced styling */}
        <h1 className="text-6xl font-bold gradient-text mb-4 text-shadow-glow">
          ACCESS DENIED
        </h1>
        
        {/* Subheading */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-destructive" />
          <span className="text-xl font-semibold text-destructive">RESTRICTED AREA</span>
          <Lock className="w-5 h-5 text-destructive" />
        </div>

        {/* Warning message */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-8">
          <AlertTriangle className="w-6 h-6 text-destructive mt-1 flex-shrink-0" />
          <div className="text-left">
            <p className="text-lg font-medium text-destructive mb-2">Authorization Required</p>
            <p className="text-foreground/80">
              You are not authorized to view the <span className="text-primary font-semibold">Dark Lab</span>. 
              This area contains sensitive information and requires proper authentication credentials.
            </p>
          </div>
        </div>

        {/* Profile image with enhanced styling */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-110" />
          <img 
            src="/pankaj.png" 
            alt="Security Avatar" 
            className="relative w-32 h-32 mx-auto rounded-full shadow-lg border-4 border-primary/30 floating"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center border-2 border-background">
            <Eye className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Security features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
            <Fingerprint className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Biometric Scan</p>
            <p className="text-xs text-muted-foreground">Required</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
            <Shield className="w-8 h-8 text-secondary mx-auto mb-2" />
            <p className="text-sm font-medium">Security Clearance</p>
            <p className="text-xs text-muted-foreground">Level 5+</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
            <Lock className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-sm font-medium">Access Token</p>
            <p className="text-xs text-muted-foreground">Encrypted</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center items-center">
          <Button 
            onClick={() => navigate('/')} 
            className="btn-hero flex items-center gap-2 min-w-48"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Portfolio
          </Button>
        </div>

        {/* Footer message */}
        <p className="text-sm text-muted-foreground mt-8 italic">
          "Security is not a product, but a process" - Bruce Schneier
        </p>
      </div>

      {/* Floating security indicators */}
      <div className="absolute top-10 left-10 text-destructive/60 floating">
        <Lock className="w-6 h-6" />
      </div>
      <div className="absolute top-16 right-16 text-primary/60 floating-delayed">
        <Shield className="w-8 h-8" />
      </div>
      <div className="absolute bottom-16 left-16 text-secondary/60 floating">
        <AlertTriangle className="w-7 h-7" />
      </div>
    </div>
  );
};

export default NotAllowed;
