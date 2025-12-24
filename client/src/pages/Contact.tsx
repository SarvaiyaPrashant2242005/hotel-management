import { useState, useRef, FormEvent } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  // EmailJS Configuration from environment variables
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formRef.current) return;

    // Validate EmailJS credentials
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast({
        title: "Configuration Required",
        description: "Please configure EmailJS credentials in .env file",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      // Reset form
      formRef.current.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        title: "Failed to Send",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const contactInfo = [
    {
      icon: FaEnvelope,
      title: "Email",
      content: "support@WonderPathe.com",
      link: "mailto:support@WonderPathe.com",
    },
    {
      icon: FaPhone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Address",
      content: "123 Travel Street, San Francisco, CA 94102",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 shadow-soft"
          >
            <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="user_name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <Input
                  id="user_name"
                  name="user_name"
                  type="text"
                  placeholder="Your name"
                  className="border-border bg-background"
                  required
                />
              </div>
              <div>
                <label htmlFor="user_email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="user_email"
                  name="user_email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="border-border bg-background"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                  className="border-border bg-background"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us more..."
                  rows={6}
                  className="border-border bg-background resize-none"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-soft"
            >
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.title}
                    href={info.link}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-primary/5 transition-colors group"
                  >
                    <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <info.icon className="text-xl text-primary group-hover:text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
                      <p className="text-muted-foreground">{info.content}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl overflow-hidden shadow-soft h-64"
            >
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <FaMapMarkerAlt className="text-6xl text-primary/40" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Quick Answers</h2>
            <p className="text-muted-foreground mb-12 text-lg">
              Before contacting us, check out our frequently asked questions
            </p>
            <div className="space-y-4 text-left">
              {[
                { q: "What is your cancellation policy?", a: "Free cancellation up to 24 hours before check-in for most properties." },
                { q: "How do I modify my booking?", a: "Log in to your account and navigate to 'My Bookings' to make changes." },
                { q: "Do you offer customer support?", a: "Yes! We're available 24/7 via email, phone, and live chat." },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-6 shadow-soft"
                >
                  <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
