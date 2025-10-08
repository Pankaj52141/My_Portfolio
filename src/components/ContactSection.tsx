import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Download, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  // Use environment variable for API base URL
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const { toast } = useToast();

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "pankajjaiswal10101@gmail.com",
      href: "mailto:pankajjaiswal10101@gmail.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 X201-XXXXX",
      href: "tel:+910000000000"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "NIT Delhi",
      href: "#"
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/Pankaj52141",
      color: "hover:text-foreground"
    },
    {
      icon: Linkedin,
      label: "LinkedIn", 
      href: "https://linkedin.com/in/pankaj-jaiswal101",
      color: "hover:text-blue-400"
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://twitter.com/pankaj52141",
      color: "hover:text-blue-400"
    }
  ];


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
  const res = await fetch(`${apiBaseUrl}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        toast({ title: 'OTP sent!', description: 'Check your email for the OTP.' });
      } else {
        toast({ title: 'Failed to send OTP', description: data.error || 'Try again.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Could not send OTP.', variant: 'destructive' });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    try {
  const res = await fetch(`${apiBaseUrl}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      const data = await res.json();
      if (data.success) {
        setIsVerified(true);
        // Only set darklab_verified if the verified email matches the .env allowed email
        if (formData.email === import.meta.env.VITE_ALLOWED_EMAIL) {
          localStorage.setItem('darklab_verified', 'true');
        } else {
          localStorage.removeItem('darklab_verified');
        }
        toast({ title: 'OTP verified!', description: 'You can now send your message.' });
      } else {
        toast({ title: 'Invalid OTP', description: data.error || 'Try again.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Could not verify OTP.', variant: 'destructive' });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      toast({ title: 'Please verify your email with OTP first.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message
          }
        ]);
      if (error) throw error;
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you soon.",
        duration: 5000,
      });
  setFormData({ name: '', email: '', message: '' });
  setOtp('');
  setOtpSent(false);
  setIsVerified(false);
  localStorage.removeItem('darklab_verified');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again or contact me directly via email.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
            Get In <span className="gradient-text">Touch</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to bring your ideas to life? Let's discuss your next project 
            and create something amazing together.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="glass-card p-6">
              <h3 className="text-2xl font-bold mb-6 gradient-text">
                Contact Information
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.href}
                    className="flex items-center gap-4 p-3 rounded-lg glass-card-hover group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <info.icon className="w-5 h-5 text-primary-glow" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{info.label}</div>
                      <div className="font-medium text-foreground">{info.value}</div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card p-6">
              <h3 className="text-xl font-bold mb-6 text-foreground">
                Follow Me
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-lg glass-card-hover text-muted-foreground ${social.color} transition-colors`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="glass-card p-8"
          >
            <motion.h3 variants={itemVariants} className="text-2xl font-bold mb-6 gradient-text">
              Send a Message
            </motion.h3>
            
            <motion.form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="glass-card-hover border-white/10 bg-white/5 text-foreground placeholder:text-foreground focus:border-primary/50"
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="glass-card-hover border-white/10 bg-white/5 text-foreground placeholder:text-foreground focus:border-primary/50"
                    placeholder="your.email@example.com"
                    required
                    disabled={otpSent}
                    autoComplete="email"
                  />
                  <Button type="button" onClick={handleSendOtp} disabled={!formData.email || otpSent || otpLoading}>
                    {otpLoading ? 'Sending...' : otpSent ? 'Sent' : 'Send OTP'}
                  </Button>
                </div>
                {otpSent && !isVerified && (
                  <div className="mt-4 flex gap-2 items-center">
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      className="glass-card-hover border-white/10 bg-white/5 text-foreground placeholder:text-foreground focus:border-primary/50"
                      placeholder="Enter OTP"
                      required
                      autoComplete="one-time-code"
                    />
                    <Button type="button" onClick={handleVerifyOtp} disabled={!otp || isVerified || otpLoading}>
                      {otpLoading ? 'Verifying...' : isVerified ? 'Verified' : 'Verify OTP'}
                    </Button>
                  </div>
                )}
                {isVerified && (
                  <div className="mt-2 text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Verified</div>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="glass-card-hover border-white/10 bg-white/5 text-foreground placeholder:text-foreground focus:border-primary/50 min-h-[120px]"
                  placeholder="Tell me about your project..."
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button 
                  type="submit" 
                  className="btn-hero w-full text-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-foreground/30 border-t-foreground" />
                      <span className="relative z-10">Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      <span className="relative z-10 text-foreground">Send Message</span>
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            {/* Decorative elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-primary opacity-10"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;