import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import Lottie from "lottie-react";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import GoalPlanner from "./components/GoalPlanner";

function LandingPage() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 700, once: true, offset: 80 });

    // Load your Lottie animation from the JSON file
    fetch("/chatbot-data.json")
      .then((response) => {
        console.log("Fetching animation...", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Animation loaded successfully:", data);
        setAnimationData(data);
      })
      .catch((error) => {
        console.error("Error loading animation:", error);
        // Fallback to a simple animation
        const fallbackAnimation = {
          v: "5.7.3",
          fr: 30,
          ip: 0,
          op: 60,
          w: 100,
          h: 100,
          nm: "Fallback Animation",
          ddd: 0,
          assets: [],
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 4,
              nm: "Circle",
              sr: 1,
              ks: {
                o: { a: 0, k: 100 },
                r: {
                  a: 1,
                  k: [
                    {
                      i: { x: [0.667], y: [1] },
                      o: { x: [0.333], y: [0] },
                      t: 0,
                      s: [0],
                    },
                    { t: 60, s: [360] },
                  ],
                  ix: 10,
                },
                p: { a: 0, k: [50, 50, 0], ix: 2 },
                a: { a: 0, k: [0, 0, 0], ix: 1 },
                s: { a: 0, k: [100, 100, 100], ix: 6 },
              },
              ao: 0,
              shapes: [
                {
                  ty: "gr",
                  it: [
                    {
                      d: 1,
                      ty: "el",
                      s: { a: 0, k: [40, 40], ix: 2 },
                      p: { a: 0, k: [0, 0], ix: 3 },
                      nm: "Ellipse Path 1",
                      mn: "ADBE Vector Shape - Ellipse",
                      hd: false,
                    },
                    {
                      ty: "fl",
                      c: { a: 0, k: [0.2, 0.8, 1, 1], ix: 4 },
                      o: { a: 0, k: 100, ix: 5 },
                      r: 1,
                      bm: 0,
                      nm: "Fill 1",
                      mn: "ADBE Vector Graphic - Fill",
                      hd: false,
                    },
                  ],
                  nm: "Ellipse 1",
                  np: 2,
                  cix: 2,
                  bm: 0,
                  ix: 1,
                  mn: "ADBE Vector Group",
                  hd: false,
                },
              ],
              ip: 0,
              op: 60,
              st: 0,
              bm: 0,
            },
          ],
          markers: [],
        };
        setAnimationData(fallbackAnimation);
        console.log("Using fallback animation");
      });
  }, []);

  useEffect(() => {
    // Footer year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Parallax effect
    const layer = document.querySelector(".parallax-layer");
    if (!layer) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || 0;
          const translate = Math.min(40, y * 0.06);
          layer.style.transform = `translateY(${translate}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <img
              src="/fin-logo.jpg"
              alt="finGenie Logo"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
              finGenie
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a
              href="#features"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="/goal-planner"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Goal Planner
            </a>
            <a
              href="/login"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Login
            </a>
            <a
              href="/signup"
              className="inline-flex items-center rounded-md bg-brand-600 text-white px-4 py-2 font-medium shadow hover:shadow-md hover:bg-brand-500 active:bg-brand-700 transition-all"
            >
              Get started
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="parallax-wrap relative">
        <div className="parallax-layer">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="min-h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16">
              <div className="max-w-3xl flex flex-col justify-center h-full" data-aos="fade-up">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
                  AI-powered financial planning, made effortless
                </h1>
                <p className="mt-8 text-xl text-zinc-300 leading-relaxed">
                  finGenie helps you forecast cashflow, automate budgets, and
                  reach goals faster with smart, personalized insights.
                </p>
                <p className="mt-4 text-lg text-zinc-400 leading-relaxed">
                  Take control of your financial future with AI-powered insights, 
                  real-time tracking, and personalized recommendations tailored to your goals.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4" id="cta">
                  <a
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-lg bg-brand-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover:bg-brand-500 transition-all"
                  >
                    Get started
                  </a>
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-zinc-700 px-8 py-4 text-lg font-semibold text-white hover:border-brand-500 hover:bg-zinc-900/40 transition-all"
                  >
                    Login
                  </a>
                </div>
                
                {/* Feature highlights */}
                <div className="mt-12 grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-400">10K+</div>
                    <div className="text-sm text-zinc-400 mt-1">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-400">$2M+</div>
                    <div className="text-sm text-zinc-400 mt-1">Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-400">4.9★</div>
                    <div className="text-sm text-zinc-400 mt-1">Rating</div>
                  </div>
                </div>
              </div>
              <div className="lg:justify-self-end w-full" data-aos="fade-left">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xl h-[85vh]">
                  <Spline scene="https://prod.spline.design/UnDKQ-9IipiotHow/scene.splinecode" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Cards Section */}
      <section id="features" className="py-20 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="max-w-2xl text-center mx-auto mb-16"
            data-aos="fade-up"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Explore Our Financial Tools
            </h2>
            <p className="text-zinc-300 text-lg">
              Hover over the cards to discover detailed information about each
              feature
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                front: {
                  icon: "💳",
                  title: "Smart Budgeting",
                  subtitle: "AI-Powered Planning",
                  color: "from-blue-500 to-cyan-500",
                },
                back: {
                  title: "Smart Budgeting",
                  description:
                    "Our AI analyzes your spending patterns and creates personalized budgets that adapt to your lifestyle. Get real-time insights and automated adjustments.",
                  features: [
                    "Auto-categorization",
                    "Spending alerts",
                    "Goal tracking",
                    "Monthly reports",
                  ],
                  color: "from-blue-500 to-cyan-500",
                },
              },
              {
                id: 2,
                front: {
                  icon: "📈",
                  title: "Investment Hub",
                  subtitle: "Portfolio Management",
                  color: "from-green-500 to-emerald-500",
                },
                back: {
                  title: "Investment Hub",
                  description:
                    "Track and optimize your investment portfolio with advanced analytics. Get personalized recommendations based on your risk tolerance and goals.",
                  features: [
                    "Portfolio tracking",
                    "Risk analysis",
                    "Rebalancing alerts",
                    "Performance insights",
                  ],
                  color: "from-green-500 to-emerald-500",
                },
              },
              {
                id: 3,
                front: {
                  icon: "🎯",
                  title: "Goal Tracker",
                  subtitle: "Achieve Your Dreams",
                  color: "from-purple-500 to-pink-500",
                },
                back: {
                  title: "Goal Tracker",
                  description:
                    "Set financial goals and track your progress with smart milestones. Whether it's buying a home or planning retirement, we'll help you get there.",
                  features: [
                    "Goal setting",
                    "Progress tracking",
                    "Milestone alerts",
                    "Success planning",
                  ],
                  color: "from-purple-500 to-pink-500",
                },
              },
              {
                id: 4,
                front: {
                  icon: "🔔",
                  title: "Smart Alerts",
                  subtitle: "Stay Informed",
                  color: "from-orange-500 to-red-500",
                },
                back: {
                  title: "Smart Alerts",
                  description:
                    "Get timely notifications about your finances. From unusual spending to investment opportunities, never miss important financial moments.",
                  features: [
                    "Spending alerts",
                    "Bill reminders",
                    "Investment updates",
                    "Goal milestones",
                  ],
                  color: "from-orange-500 to-red-500",
                },
              },
              {
                id: 5,
                front: {
                  icon: "🤟",
                  title: "Sign Language Support",
                  subtitle: "Accessible for Everyone",
                  color: "from-indigo-500 to-blue-500",
                },
                back: {
                  title: "Sign Language Support",
                  description:
                    "Making financial planning accessible to the deaf and hard-of-hearing community with ASL video tutorials and sign language interface.",
                  features: [
                    "ASL video guides",
                    "Sign language UI",
                    "Accessibility features",
                    "Inclusive design",
                  ],
                  color: "from-indigo-500 to-blue-500",
                },
              },
              {
                id: 6,
                front: {
                  icon: "📊",
                  title: "Stock Market Analysis",
                  subtitle: "Real-time Insights",
                  color: "from-yellow-500 to-orange-500",
                },
                back: {
                  title: "Stock Market Analysis",
                  description:
                    "Get real-time stock market data, technical analysis, and AI-powered predictions to make informed investment decisions.",
                  features: [
                    "Real-time data",
                    "Technical analysis",
                    "AI predictions",
                    "Market alerts",
                  ],
                  color: "from-yellow-500 to-orange-500",
                },
              },
            ].map((card, index) => {
              return (
                <motion.div
                  key={card.id}
                  className="group perspective-1000"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                  style={{ perspective: "1000px" }}
                >
                  <motion.div
                    className="relative w-full h-80 transform-style-preserve-3d"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    {/* Front of card */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm p-6 flex flex-col justify-center items-center text-center shadow-2xl">
                      <motion.div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${card.front.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}
                        whileHover={{
                          rotate: 360,
                          scale: 1.1,
                          transition: { duration: 0.6 },
                        }}
                      >
                        {card.front.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {card.front.title}
                      </h3>
                      <p className="text-zinc-400 text-sm mb-4">
                        {card.front.subtitle}
                      </p>
                      <motion.div
                        className="w-8 h-0.5 bg-gradient-to-r from-transparent via-brand-500 to-transparent rounded-full"
                        whileHover={{ scaleX: 1.5 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    {/* Back of card */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl border border-zinc-700 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-sm p-6 shadow-2xl">
                      <div className="h-full flex flex-col">
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${card.back.color} flex items-center justify-center text-xl mb-3 shadow-lg`}
                        >
                          {card.front.icon}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          {card.back.title}
                        </h3>
                        <p className="text-zinc-300 text-xs mb-3 leading-relaxed flex-grow">
                          {card.back.description}
                        </p>
                        <div className="space-y-1">
                          {card.back.features.map((feature, idx) => (
                            <motion.div
                              key={idx}
                              className="flex items-center text-zinc-400 text-xs"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <div className="w-1 h-1 bg-brand-500 rounded-full mr-2" />
                              {feature}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              What people say
            </h2>
          </div>
          <div
            className="mt-12 grid gap-6 md:grid-cols-2"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <blockquote className="rounded-xl border border-zinc-800 p-6 bg-zinc-900/40 hover:shadow-md transition-shadow">
              <p className="text-white">
                "finGenie gave me clarity on my monthly cashflow in minutes."
              </p>
              <footer className="mt-3 text-sm text-zinc-400">
                Alex R. — Solo founder
              </footer>
            </blockquote>
            <blockquote className="rounded-xl border border-zinc-800 p-6 bg-zinc-900/40 hover:shadow-md transition-shadow">
              <p className="text-white">
                "The budgeting insights are spot-on. It's like having a CFO on
                call."
              </p>
              <footer className="mt-3 text-sm text-zinc-400">
                Priya K. — Freelancer
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Lottie Animation */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex items-center justify-center">
          {animationData ? (
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              style={{ width: 140, height: 140 }}
            />
          ) : (
            <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-spin flex items-center justify-center">
              <div className="w-14 h-14 bg-white rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-400">
            © <span id="year"></span> finGenie. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a
              href="#"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/goal-planner" element={<GoalPlanner />} />
      </Routes>
    </Router>
  );
}
