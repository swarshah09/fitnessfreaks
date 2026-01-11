import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import bigscreenBg from "@/assets/bigscreen_bg.mp4";
import mobileBackground from "@/assets/mobile_background.mp4";
import { 
  Activity, 
  Dumbbell, 
  Apple, 
  Moon, 
  Footprints, 
  Droplets, 
  Scale, 
  Camera, 
  MessageCircle,
  BarChart3,
  UserPlus,
  ClipboardList,
  TrendingUp,
  Github,
  Mail,
  Heart,
  Zap,
  Target,
  Users,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  Play,
  Star,
  Flame,
  Smartphone,
  Rocket,
  AlertCircle,
  X,
  CheckCircle2,
  LayoutDashboard,
  Calendar,
  Eye,
  UserCheck,
  Grid3x3,
  TrendingDown,
  Lightbulb,
  Shield,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  FileText,
  HelpCircle,
  BookOpen,
  ShieldCheck,
  Lock,
  ExternalLink
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } }
};

const FloatingOrb = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

// Removed GlowingCard for cleaner design

const Landing = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const features = [
    { icon: Activity, title: "Smart Fitness Tracking", description: "Track workouts, steps, calories, sleep, water & weight effortlessly.", gradient: "from-blue-500 to-cyan-500" },
    { icon: Dumbbell, title: "Workout Logging", description: "Log exercises, monitor performance, and stay consistent.", gradient: "from-orange-500 to-red-500" },
    { icon: Apple, title: "Calorie & Nutrition", description: "Powered by Edamam Nutrition API for accurate food data.", gradient: "from-green-500 to-emerald-500" },
    { icon: Moon, title: "Sleep Analysis", description: "Understand your sleep patterns and recovery quality.", gradient: "from-indigo-500 to-purple-500" },
    { icon: Footprints, title: "Steps & Activity", description: "Monitor daily movement and stay active.", gradient: "from-pink-500 to-rose-500" },
    { icon: Droplets, title: "Hydration Monitoring", description: "Never forget to drink water again.", gradient: "from-cyan-500 to-blue-500" },
    { icon: Scale, title: "Weight & BMI", description: "Track progress with auto BMI calculation.", gradient: "from-purple-500 to-violet-500" },
    { icon: Target, title: "Goal Setting", description: "Set and achieve personalized fitness targets.", gradient: "from-yellow-500 to-orange-500" }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section with Video Background - Rachel PT Style */}
      <section className="relative min-h-screen flex flex-col bg-background overflow-hidden">
        {/* Video Background - Responsive (Local video files) */}
        <div className="absolute inset-0 z-0">
          {/* Desktop Video */}
          <video
            className="hidden md:block absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={bigscreenBg} type="video/mp4" />
          </video>
          {/* Mobile Video */}
          <video
            className="block md:hidden absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={mobileBackground} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/70" />
        </div>

        {/* Navbar - Rachel PT Style */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12 lg:px-16"
        >
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.01 }}
          >
            <div className="relative bg-card px-4 py-2 rounded-full">
              <span className="text-lg font-semibold text-foreground">
                Fitness Freak
              </span>
            </div>
          </motion.div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Login
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Get Started
            </Button>
          </div>
        </motion.nav>

        {/* Hero Content - Professional PT style */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24 text-center"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1] mb-6 text-foreground"
          >
            Track. Improve. Transform your fitness journey.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          >
            Fitness Freak is an all-in-one fitness tracking platform to monitor workouts, calories, sleep, hydration, body stats, and stay socially motivated — all in one place.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")} 
              className="gap-2 text-base px-8 py-6 rounded-2xl"
            >
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base px-8 py-6 rounded-2xl"
              asChild
            >
              <a href="https://fitnessfreaks-bay.vercel.app/" target="_blank" rel="noopener noreferrer">
                <Play className="h-4 w-4" />
                View Demo
              </a>
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            {[
              { icon: CheckCircle, text: "Free to use" },
              { icon: CheckCircle, text: "No credit card" },
              { icon: CheckCircle, text: "Easy setup" }
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4 text-primary" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section - Rachel PT Style */}
      <section className="relative py-20 px-6 md:px-12 lg:px-16 bg-background">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "500K+", label: "Workouts Logged" },
              { value: "1M+", label: "Calories Tracked" },
              { value: "4.9", label: "User Rating", icon: Star }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                  {stat.value}
                  {stat.icon && <stat.icon className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Problem → Solution Section - Rachel PT Style */}
      <section className="relative py-24 px-6 md:px-12 lg:px-16 bg-background">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="relative max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              Fitness tracking shouldn't be{" "}
              <span className="text-muted-foreground">complicated</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We've identified the pain points and built the perfect solution
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Problems */}
            <motion.div variants={slideInLeft} className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20">
                  <X className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">The Problem</h3>
                </div>
              </div>
              
              {[
                { text: "Using 5 different apps to track fitness", icon: Grid3x3 },
                { text: "No motivation to stay consistent", icon: TrendingDown },
                { text: "No clarity on progress & health stats", icon: Eye },
                { text: "No social accountability", icon: UserCheck }
              ].map((problem, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-5 rounded-xl border border-border/50 bg-card/50"
                >
                  <div className="p-2 rounded-lg bg-destructive/5">
                    <problem.icon className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="text-foreground leading-relaxed pt-1">{problem.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Solutions */}
            <motion.div variants={slideInRight} className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">The Solution</h3>
                </div>
              </div>
              
              {[
                { text: "One dashboard for everything", icon: LayoutDashboard },
                { text: "Daily habit tracking", icon: Calendar },
                { text: "Visual insights & BMI monitoring", icon: BarChart3 },
                { text: "Social feed + chat like Instagram", icon: Users }
              ].map((solution, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-5 rounded-xl border border-border/50 bg-card/50"
                >
                  <div className="p-2 rounded-lg bg-primary/5">
                    <solution.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground leading-relaxed pt-1">{solution.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            variants={fadeInUp}
            className="text-center"
          >
            <div className="inline-block p-6 rounded-xl border border-border bg-card/50">
              <p className="text-xl md:text-2xl font-semibold text-foreground">
                Fitness Freak replaces chaos with clarity.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Cards - Rachel PT Style */}
      <section className="relative py-24 px-6 md:px-12 lg:px-16 bg-background">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Powerful features designed to help you reach your fitness goals faster.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="h-full border-border/50">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-lg bg-primary/10 mb-4`}>
                      <feature.icon className={`h-5 w-5 text-primary`} />
                    </div>
                    <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Social Features Highlight - Rachel PT Style */}
      <section className="relative py-24 px-6 md:px-12 lg:px-16 bg-background">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="relative max-w-5xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Fitness is Better Together
            </h2>
            <p className="text-muted-foreground text-lg">
              What makes us stand out
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={slideInLeft}>
              <Card className="h-full border-border/50">
                <CardContent className="p-8">
                  <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-6">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Instagram-like Activity Feed</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    {["Share daily workouts", "Post fitness updates", "Stay accountable"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={slideInRight}>
              <Card className="h-full border-border/50">
                <CardContent className="p-8">
                  <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-6">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Peer Chat</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    {["Talk to friends", "Get motivation", "Build fitness communities"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.p 
            variants={fadeInUp}
            className="text-center text-lg text-muted-foreground mt-12"
          >
            Fitness is easier when you don't do it alone.
          </motion.p>
        </motion.div>
      </section>

      {/* Dashboard Preview - Rachel PT Style */}
      <section className="relative py-24 px-6 md:px-12 lg:px-16 bg-background">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              All Your Health Data in One Dashboard
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Get a complete picture of your health with beautiful visualizations and actionable insights.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: "Daily & Weekly Insights", icon: TrendingUp },
              { title: "Clear Progress Visualization", icon: BarChart3 },
              { title: "Actionable Health Metrics", icon: Target }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -4 }}
              >
                <Card className="p-8 border-border/50">
                  <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-semibold">{item.title}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works - Rachel PT Style */}
      <section className="relative py-24 px-6 md:px-12 lg:px-16 bg-background">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="relative max-w-5xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Get started in just 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "1", icon: UserPlus, title: "Sign Up & Login", description: "Create your account securely in seconds." },
              { step: "2", icon: ClipboardList, title: "Track Daily Activities", description: "Log workouts, food, sleep, water & more." },
              { step: "3", icon: TrendingUp, title: "Analyze & Share", description: "See insights, calculate BMI, share with friends." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={scaleIn}
                className="text-center"
              >
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-primary-foreground text-2xl font-semibold mb-6">
                  {item.step}
                </div>
                <div className="inline-flex p-2.5 rounded-lg bg-primary/10 mb-4">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section - Rachel PT Style */}
      <section className="relative py-24 px-6 md:px-12 lg:px-16 bg-background">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Your fitness journey deserves better tracking.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
              Join thousands of users who have transformed their health with Fitness Freak.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")} 
                className="gap-2 text-base px-8 py-6 rounded-2xl"
              >
                Start Tracking Now
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/auth")}
                className="text-base px-8 py-6 rounded-2xl"
              >
                Join the Community
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer - Rachel PT Style */}
      <footer className="relative bg-background border-t border-border">
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12"
          >
            {/* Company Info */}
            <div className="lg:col-span-2">
              <motion.div 
                className="flex items-center gap-3 mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative bg-card px-4 py-2 rounded-full">
                  <span className="text-lg font-semibold text-foreground">
                    Fitness Freak
                  </span>
                </div>
              </motion.div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                Your all-in-one fitness tracking platform. Track workouts, monitor nutrition, analyze progress, and stay motivated with our comprehensive health management system.
              </p>
              
              {/* Social Media Links */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Follow us:</span>
                <div className="flex items-center gap-3">
                  {[
                    { icon: Twitter, href: "https://twitter.com", label: "Twitter", color: "hover:text-blue-400" },
                    { icon: Facebook, href: "https://facebook.com", label: "Facebook", color: "hover:text-blue-600" },
                    { icon: Instagram, href: "https://instagram.com", label: "Instagram", color: "hover:text-pink-500" },
                    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn", color: "hover:text-blue-700" },
                    { icon: Youtube, href: "https://youtube.com", label: "YouTube", color: "hover:text-red-600" }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground ${social.color} transition-colors`}
                    >
                      <social.icon className="h-4 w-4" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-5">Product</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { name: "Features", href: "#features" },
                  { name: "Pricing", href: "#pricing" },
                  { name: "Workouts", href: "/workouts" },
                  { name: "Nutrition", href: "/nutrition" },
                  { name: "Analytics", href: "/analytics" }
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                      onClick={(e) => {
                        if (link.href.startsWith("#")) {
                          e.preventDefault();
                          const element = document.querySelector(link.href);
                          element?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <span>{link.name}</span>
                      {link.href.startsWith("http") && <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-5">Company</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { name: "About Us", href: "#about" },
                  { name: "Blog", href: "#blog" },
                  { name: "Careers", href: "#careers" },
                  { name: "Contact", href: "mailto:swarshah09@example.com" },
                  { name: "Demo", href: "https://fitnessfreaks-bay.vercel.app/", external: true }
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                    >
                      <span>{link.name}</span>
                      {link.external && <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources & Legal */}
            <div>
              <h4 className="font-semibold text-foreground mb-5">Resources</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { name: "Documentation", href: "#docs", icon: BookOpen },
                  { name: "Help Center", href: "#help", icon: HelpCircle },
                  { name: "Privacy Policy", href: "#privacy", icon: ShieldCheck },
                  { name: "Terms of Service", href: "#terms", icon: FileText },
                  { name: "GitHub", href: "https://github.com/swarshah09/fitnessfreaks.git", icon: Github, external: true }
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                    >
                      {link.icon && <link.icon className="h-3.5 w-3.5" />}
                      <span>{link.name}</span>
                      {link.external && <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} Fitness Freak. All rights reserved.</p>
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Secure & Private</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <a 
                  href="#privacy" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Privacy
                </a>
                <a 
                  href="#terms" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Terms
                </a>
                <a 
                  href="https://github.com/swarshah09/fitnessfreaks.git" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <Github className="h-3.5 w-3.5" />
                  Source Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
