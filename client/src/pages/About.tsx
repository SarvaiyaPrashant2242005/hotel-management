import { motion } from "framer-motion";
import { FaHotel, FaUsers, FaGlobe, FaHeart } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  const stats = [
    { icon: FaHotel, number: "500+", label: "Partner Hotels" },
    { icon: FaUsers, number: "10K+", label: "Happy Guests" },
    { icon: FaGlobe, number: "50+", label: "Countries" },
    { icon: FaHeart, number: "4.9", label: "Average Rating" },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Experience Lead",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
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
            About StayEase
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            We're on a mission to make hotel booking simple, enjoyable, and accessible to everyone around the world.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-8 text-center shadow-soft hover:shadow-hover transition-all"
            >
              <stat.icon className="text-5xl text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-foreground mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-8 text-center">Our Story</h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2020, StayEase was born from a simple idea: booking hotels should be as easy and enjoyable as the trips themselves. Our founders, seasoned travelers frustrated with complicated booking processes, set out to create a platform that puts the joy back into travel planning.
                </p>
                <p>
                  Today, we partner with over 500 hotels across 50 countries, from boutique hideaways to luxury resorts. Our carefully curated selection ensures that every property meets our high standards for quality, comfort, and value.
                </p>
                <p>
                  What sets us apart is our commitment to transparency, exceptional customer service, and our passion for making every journey memorable. We believe that finding the perfect place to stay should be the exciting first step of your adventure, not a tedious chore.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 text-center">Meet Our Team</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            The passionate people behind StayEase
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Trust", description: "We build lasting relationships through transparency and reliability" },
                { title: "Excellence", description: "We're committed to delivering exceptional experiences every time" },
                { title: "Innovation", description: "We continuously improve to make travel booking effortless" },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                  <p className="text-primary-foreground/80">{value.description}</p>
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

export default About;
