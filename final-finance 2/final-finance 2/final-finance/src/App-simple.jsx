import { useEffect } from "react";
import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

export default function App() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, offset: 80 });
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
          <a href="#" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-white font-bold">
              f
            </span>
            <span className="text-lg font-semibold text-white">finGenie</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a
              href="#features"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              How it works
            </a>
            <a
              href="#faq"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              FAQ
            </a>
            <a
              href="#login"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Login
            </a>
            <a
              href="#signup"
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
            <div className="min-h-[70vh] grid grid-cols-1 lg:grid-cols-2 gap-8 content-center py-16">
              <div className="max-w-3xl" data-aos="fade-up">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                  AI-powered financial planning, made effortless
                </h1>
                <p className="mt-6 text-lg text-zinc-300">
                  finGenie helps you forecast cashflow, automate budgets, and
                  reach goals faster with smart, personalized insights.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3" id="cta">
                  <a
                    href="#signup"
                    className="inline-flex items-center justify-center rounded-md bg-brand-600 text-white px-6 py-3 font-semibold shadow hover:shadow-lg hover:bg-brand-500 transition-all"
                  >
                    Get started
                  </a>
                  <a
                    href="#login"
                    className="inline-flex items-center justify-center rounded-md border border-zinc-700 px-6 py-3 font-semibold text-white hover:border-zinc-600 hover:bg-zinc-900/40 transition-all"
                  >
                    Login
                  </a>
                </div>
              </div>
              <div className="lg:justify-self-end w-full" data-aos="fade-left">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xl h-[60vh]">
                  <Spline scene="https://prod.spline.design/UnDKQ-9IipiotHow/scene.splinecode" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Everything you need to plan with confidence
            </h2>
            <p className="mt-3 text-zinc-300">
              Powerful tools that stay easy to use.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                num: 1,
                title: "Cashflow forecasting",
                desc: "See your runway and future balances with AI-assisted projections.",
                delay: 0,
                icon: "📊",
              },
              {
                num: 2,
                title: "Automated budgeting",
                desc: "Smart envelopes that adapt to your habits and real-time income.",
                delay: 100,
                icon: "💰",
              },
              {
                num: 3,
                title: "Goal tracking",
                desc: "Set goals and let finGenie chart the best path to reach them.",
                delay: 200,
                icon: "🎯",
              },
              {
                num: 4,
                title: "Insights & alerts",
                desc: "Timely nudges so you act before issues become problems.",
                delay: 300,
                icon: "🔔",
              },
              {
                num: 5,
                title: "Bank connections",
                desc: "Securely connect accounts to keep everything up to date.",
                delay: 400,
                icon: "🏦",
              },
              {
                num: 6,
                title: "Privacy-first",
                desc: "Your data stays yours with strong encryption and controls.",
                delay: 500,
                icon: "🔒",
              },
            ].map((f) => (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: f.delay / 1000,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-brand-500/50 hover:bg-zinc-900/60 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                />

                <div className="relative z-10">
                  <motion.div
                    className="h-12 w-12 rounded-md bg-gradient-to-br from-brand-600 to-brand-700 text-white grid place-content-center font-bold text-lg mb-4"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {f.icon}
                  </motion.div>

                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
                    {f.title}
                  </h3>

                  <p className="text-zinc-300 mb-4 leading-relaxed">{f.desc}</p>

                  <motion.span
                    className="inline-flex items-center text-brand-400 group-hover:text-brand-300 font-medium"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    Learn more
                    <motion.span
                      className="ml-1"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              How finGenie works
            </h2>
            <p className="mt-3 text-zinc-300">
              Getting started is simple—three steps to clarity.
            </p>
          </div>
          <ol className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "1. Connect",
                desc: "Securely connect your accounts and set your financial goals.",
                delay: 0,
              },
              {
                step: "2. Plan",
                desc: "finGenie creates a tailored plan—cashflow, budgets, and milestones.",
                delay: 100,
              },
              {
                step: "3. Grow",
                desc: "Track progress with insights and make confident decisions.",
                delay: 200,
              },
            ].map((s) => (
              <li
                key={s.step}
                className="rounded-xl border border-zinc-800 p-6 bg-zinc-900/40"
                data-aos="zoom-in"
                data-aos-delay={s.delay}
              >
                <h3 className="text-xl font-semibold text-white">{s.step}</h3>
                <p className="mt-2 text-zinc-300">{s.desc}</p>
              </li>
            ))}
          </ol>
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

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Frequently asked questions
            </h2>
          </div>
          <div
            className="mt-10 grid gap-4"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {[
              {
                q: "Is my data secure?",
                a: "Yes. We use industry-standard encryption and never sell your data.",
              },
              {
                q: "Does finGenie work with my bank?",
                a: "We support most major banks and aggregators; coverage expands regularly.",
              },
              {
                q: "Can I try it for free?",
                a: "Yes, start with a free trial and upgrade anytime.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 text-zinc-200"
              >
                <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
                  {faq.q}
                  <span className="ml-4 text-zinc-400 group-open:rotate-180 transition-transform">
                    ⌄
                  </span>
                </summary>
                <p className="mt-3 text-zinc-300">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

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

