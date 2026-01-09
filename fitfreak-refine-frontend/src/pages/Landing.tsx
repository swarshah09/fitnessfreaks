import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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

const GlowingCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`relative group ${className}`}
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-500" />
    <div className="relative">{children}</div>
  </motion.div>
);

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
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingOrb className="w-96 h-96 bg-primary top-20 -left-48" delay={0} />
        <FloatingOrb className="w-80 h-80 bg-accent top-1/3 -right-40" delay={2} />
        <FloatingOrb className="w-64 h-64 bg-primary/50 bottom-20 left-1/4" delay={4} />
        <FloatingOrb className="w-72 h-72 bg-accent/50 bottom-1/4 right-1/4" delay={3} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(47,227,175,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,hsl(var(--background)))]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Navbar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-20 flex items-center justify-between px-6 py-5 md:px-12"
        >
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
              <div className="relative bg-gradient-to-br from-primary to-accent p-2.5 rounded-xl">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
              Fitness Freak
            </span>
          </motion.div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground">
              Login
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => navigate("/auth")} className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25">
                <Sparkles className="h-4 w-4" />
                Get Started
              </Button>
            </motion.div>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-5 py-2.5 text-sm text-primary mb-8 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-4 w-4" />
            </motion.div>
            <span>Your all-in-one fitness companion</span>
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl leading-[1.1]"
          >
            Track. Improve.{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
                Transform
              </span>
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <motion.path
                  d="M0 5 Q50 0 100 5 T200 5"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </motion.svg>
            </span>
            <br />
            <span className="text-muted-foreground/80">your fitness journey.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            An all-in-one fitness tracking platform to monitor workouts, calories, sleep, hydration, body stats, and stay socially motivated — <span className="text-foreground font-medium">all in one place.</span>
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")} 
                className="gap-3 text-lg px-8 py-7 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-2xl shadow-primary/30 rounded-2xl"
              >
                <ArrowRight className="h-5 w-5" />
                Get Started for Free
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-3 text-lg px-8 py-7 rounded-2xl border-2 hover:bg-muted/50 backdrop-blur-sm" 
                asChild
              >
                <a href="https://fitnessfreaks-bay.vercel.app/" target="_blank" rel="noopener noreferrer">
                  <Play className="h-5 w-5" />
                  View Demo
                </a>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-muted-foreground"
          >
            {[
              { icon: CheckCircle, text: "Free to use" },
              { icon: CheckCircle, text: "No credit card" },
              { icon: CheckCircle, text: "Easy setup" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <item.icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ 
              opacity: { delay: 1.2, duration: 0.5 },
              y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
              <motion.div className="w-1.5 h-3 bg-primary rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-6 md:px-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "500K+", label: "Workouts Logged" },
              { value: "1M+", label: "Calories Tracked" },
              { value: "4.9", label: "User Rating", icon: Star }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-2">
                    {stat.value}
                    {stat.icon && <stat.icon className="h-6 w-6 text-yellow-500 fill-yellow-500" />}
                  </div>
                  <div className="text-muted-foreground text-sm mt-2">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Problem → Solution Section */}
      <section className="relative py-24 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(239,68,68,0.05),transparent)]" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="relative max-w-7xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full bg-destructive/10 border border-destructive/20 px-5 py-2.5 text-sm text-destructive mb-6 backdrop-blur-sm"
            >
              <AlertCircle className="h-4 w-4" />
              Sound Familiar?
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-6 mb-4">
              Fitness tracking shouldn't be{" "}
              <span className="text-muted-foreground">complicated</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We've identified the pain points and built the perfect solution
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Problems */}
            <motion.div variants={slideInLeft} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-2xl" />
                  <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-destructive/20 to-red-600/20 border-2 border-destructive/30">
                    <X className="h-7 w-7 text-destructive" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-destructive">The Problem</h3>
                  <p className="text-sm text-muted-foreground">Common fitness tracking frustrations</p>
                </div>
              </motion.div>
              
              {[
                { text: "Using 5 different apps to track fitness", icon: Grid3x3 },
                { text: "No motivation to stay consistent", icon: TrendingDown },
                { text: "No clarity on progress & health stats", icon: Eye },
                { text: "No social accountability", icon: UserCheck }
              ].map((problem, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -30, scale: 0.95 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-destructive/20 to-red-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-destructive/5 via-destructive/3 to-transparent border-2 border-destructive/20 hover:border-destructive/40 transition-all duration-300 backdrop-blur-sm">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-destructive/20 blur-md rounded-xl" />
                      <div className="relative p-2.5 rounded-xl bg-destructive/10 border border-destructive/30">
                        <problem.icon className="h-5 w-5 text-destructive" />
                      </div>
                    </div>
                    <span className="text-foreground font-medium leading-relaxed pt-1">{problem.text}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Solutions */}
            <motion.div variants={slideInRight} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl" />
                  <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30">
                    <CheckCircle2 className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">The Solution</h3>
                  <p className="text-sm text-muted-foreground">How Fitness Freak helps</p>
                </div>
              </motion.div>
              
              {[
                { text: "One dashboard for everything", icon: LayoutDashboard },
                { text: "Daily habit tracking", icon: Calendar },
                { text: "Visual insights & BMI monitoring", icon: BarChart3 },
                { text: "Social feed + chat like Instagram", icon: Users }
              ].map((solution, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  viewport={{ once: true }}
                  whileHover={{ x: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 backdrop-blur-sm">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-primary/20 blur-md rounded-xl" />
                      <div className="relative p-2.5 rounded-xl bg-primary/10 border border-primary/30">
                        <solution.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <span className="text-foreground font-medium leading-relaxed pt-1">{solution.text}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            variants={fadeInUp}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative inline-block"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl blur-lg opacity-50" />
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border-2 border-primary/30 shadow-2xl">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Fitness Freak replaces chaos with clarity.
                  </p>
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <p className="text-muted-foreground text-sm mt-2">
                  One platform. All your fitness data. Zero confusion.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="relative py-24 px-6 md:px-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              Powerful Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Powerful features designed to help you reach your fitness goals faster.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <GlowingCard>
                  <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-6">
                      <div className={`inline-flex p-3.5 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </GlowingCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Social Features Highlight */}
      <section className="relative py-24 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="relative max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 border border-pink-500/20 px-4 py-2 text-sm text-pink-500 mb-4">
              <Users className="h-4 w-4" />
              What makes us stand out
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 flex items-center justify-center gap-3">
              Fitness is Better{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Together</span>
              <Flame className="h-8 w-8 text-orange-500" />
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={slideInLeft}>
              <GlowingCard>
                <Card className="overflow-hidden border-2 border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-purple-500/5 backdrop-blur-sm h-full">
                  <CardContent className="p-8">
                    <motion.div 
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 mb-6 shadow-lg shadow-pink-500/25"
                    >
                      <Camera className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Camera className="h-6 w-6 text-pink-500" />
                      Instagram-like Activity Feed
                    </h3>
                    <ul className="space-y-4 text-muted-foreground">
                      {["Share daily workouts", "Post fitness updates", "Stay accountable"].map((item, i) => (
                        <motion.li 
                          key={i}
                          className="flex items-center gap-3"
                          whileHover={{ x: 5 }}
                        >
                          <CheckCircle className="h-5 w-5 text-pink-500 shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </GlowingCard>
            </motion.div>

            <motion.div variants={slideInRight}>
              <GlowingCard>
                <Card className="overflow-hidden border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 backdrop-blur-sm h-full">
                  <CardContent className="p-8">
                    <motion.div 
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 shadow-lg shadow-blue-500/25"
                    >
                      <MessageCircle className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <MessageCircle className="h-6 w-6 text-blue-500" />
                      Peer Chat
                    </h3>
                    <ul className="space-y-4 text-muted-foreground">
                      {["Talk to friends", "Get motivation", "Build fitness communities"].map((item, i) => (
                        <motion.li 
                          key={i}
                          className="flex items-center gap-3"
                          whileHover={{ x: 5 }}
                        >
                          <CheckCircle className="h-5 w-5 text-blue-500 shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </GlowingCard>
            </motion.div>
          </div>

          <motion.p 
            variants={fadeInUp}
            className="text-center text-xl font-medium text-muted-foreground mt-12"
          >
            Fitness is easier when you don't do it alone.
          </motion.p>
        </motion.div>
      </section>

      {/* Dashboard Preview */}
      <section className="relative py-24 px-6 md:px-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm text-primary mb-4">
              <BarChart3 className="h-4 w-4" />
              Powerful Insights
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 mt-4 flex items-center justify-center gap-3 flex-wrap">
              <BarChart3 className="h-10 w-10 text-primary" />
              All Your Health Data in{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">One Dashboard</span>
            </h2>
            <p className="text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
              Get a complete picture of your health with beautiful visualizations and actionable insights.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Daily & Weekly Insights", icon: TrendingUp, gradient: "from-green-500 to-emerald-500" },
              { title: "Clear Progress Visualization", icon: BarChart3, gradient: "from-blue-500 to-cyan-500" },
              { title: "Actionable Health Metrics", icon: Target, gradient: "from-purple-500 to-pink-500" }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.gradient} mb-4`}>
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <p className="font-semibold text-lg">{item.title}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 px-6 md:px-12">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="relative max-w-5xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm text-primary mb-4">
              <Zap className="h-4 w-4" />
              Quick Setup
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">How It Works</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Get started in just 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5">
              <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-primary via-accent to-primary origin-left"
              />
            </div>
            
            {[
              { step: "1", icon: UserPlus, title: "Sign Up & Login", description: "Create your account securely in seconds.", gradient: "from-blue-500 to-cyan-500" },
              { step: "2", icon: ClipboardList, title: "Track Daily Activities", description: "Log workouts, food, sleep, water & more.", gradient: "from-primary to-accent" },
              { step: "3", icon: TrendingUp, title: "Analyze & Share", description: "See insights, calculate BMI, share with friends.", gradient: "from-purple-500 to-pink-500" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={scaleIn}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div 
                    className="relative z-10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-xl" />
                    <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg`}>
                      {item.step}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-xl bg-background flex items-center justify-center border-2 border-primary shadow-lg">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 md:px-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-3xl" />
            <Card className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-2 border-primary/20 rounded-3xl">
              <CardContent className="p-10 md:p-16 text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Heart className="h-16 w-16 text-primary mx-auto mb-8" />
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Your fitness journey deserves{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">better tracking.</span>
                </h2>
                <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-lg">
                  Join thousands of users who have transformed their health with Fitness Freak.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg" 
                      onClick={() => navigate("/auth")} 
                      className="gap-3 text-lg px-10 py-7 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-2xl shadow-primary/30 rounded-2xl"
                    >
                      <Rocket className="h-5 w-5" />
                      Start Tracking Now
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      onClick={() => navigate("/auth")} 
                      className="gap-3 text-lg px-10 py-7 rounded-2xl border-2 hover:bg-muted/50"
                    >
                      <Smartphone className="h-5 w-5" />
                      Join the Community
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative bg-muted/30 border-t border-border/50">
        <div className="absolute inset-0 bg-gradient-to-t from-muted/50 to-transparent" />
        
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
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-xl" />
                  <div className="relative bg-gradient-to-br from-primary to-accent p-2.5 rounded-xl">
                    <Activity className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Fitness Freak
                </span>
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
                      className={`p-2 rounded-lg bg-background border border-border/50 ${social.color} transition-colors`}
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
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
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
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
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
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
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
          <div className="pt-8 border-t border-border/50">
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
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Privacy
                </a>
                <a 
                  href="#terms" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Terms
                </a>
                <a 
                  href="https://github.com/swarshah09/fitnessfreaks.git" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
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
