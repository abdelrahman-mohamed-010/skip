'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { logUserEvent } from "@/lib/logger";
import Link from "next/link";

export default function FamilyGreenCardLandingPage() {
  // State management
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [exitPopupShown, setExitPopupShown] = useState(false);
  const [showFloatingCountdown, setShowFloatingCountdown] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [showReferralMessage, setShowReferralMessage] = useState(false);
  const [recentSignups, setRecentSignups] = useState(23);
  const [exitTimer, setExitTimer] = useState(600);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [activeItems, setActiveItems] = useState<number[]>([]);

  const familyMembers = ['Wife', 'Husband', 'Father', 'Mother', 'Brother', 'Sister', 'Child', 'Fiancé(e)'];

  // Effects
  useEffect(() => {
    // Show floating countdown after 3 seconds
    const timer = setTimeout(() => setShowFloatingCountdown(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Track if exit popup was dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('greencard-exit-popup-dismissed');
    if (dismissed === 'true') {
      setExitPopupShown(false);
    }
  }, []);

  // Family members animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % familyMembers.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [familyMembers.length]);

  // Exit intent detection
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleMouseLeave = (e: MouseEvent) => {
      if (
        e.clientY <= 0 &&
        !exitPopupShown &&
        localStorage.getItem('greencard-exit-popup-dismissed') !== 'true'
      ) {
        setExitPopupShown(true);
      }
    };

    const handleScroll = () => {
      if (
        window.innerWidth <= 768 &&
        window.scrollY < lastScrollY &&
        window.scrollY < 100 &&
        !exitPopupShown &&
        localStorage.getItem('greencard-exit-popup-dismissed') !== 'true'
      ) {
        setExitPopupShown(true);
      }
      lastScrollY = window.scrollY;
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [exitPopupShown]);

  // Countdown timer (client-only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const END_DATE = Date.now() + 3 * 24 * 60 * 60 * 1000;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = END_DATE - now;
      if (distance > 0) {
        return {
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);
    setCountdown(calculateTimeLeft());
    return () => clearInterval(timer);
  }, []);

  // Exit popup timer
  useEffect(() => {
    if (exitPopupShown) {
      const timer = setInterval(() => {
        setExitTimer((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [exitPopupShown]);

  // Social proof updates (client-only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const signupCounts = [23, 19, 31, 27, 22, 25, 29];
    const interval = setInterval(() => {
      const randomCount = signupCounts[Math.floor(Math.random() * signupCounts.length)];
      setRecentSignups(randomCount);
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 6) {
        formattedValue = formattedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      } else if (formattedValue.length >= 3) {
        formattedValue = formattedValue.replace(/(\d{3})(\d{3})/, '($1) $2');
      }
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  function getUTMParams() {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
      utm_term: params.get("utm_term") || "",
    };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowReferralMessage(true);
      setFormSubmitted(true);
      setShowFloatingCountdown(false);
      
      alert('🎉 Welcome to the waitlist! You will receive early access and a discounted price when we launch!');
      
      // Log signup event to Grafana
      const utmParams = getUTMParams();
      logUserEvent("form_submit", {
        formId: "family-based-greencard-signup1",
        source: "family-based-greencard-signup1-page",
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        ...utmParams,
      });
      
      setFormData({ firstName: '', lastName: '', email: '', phone: '' });
      
      setTimeout(() => {
        setShowReferralMessage(false);
      }, 30000);
    }, 2000);
  };

  const toggleFAQ = (index: number) => {
    setActiveItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const scrollToForm = () => {
    const formElement = document.querySelector('.family-gc-signup-form');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  const closeExitPopup = () => {
    setExitPopupShown(false);
    localStorage.setItem('greencard-exit-popup-dismissed', 'true');
  };

  const handleExitPopupSubmit = () => {
    closeExitPopup();
    scrollToForm();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const faqItems = [
    {
      question: "What makes SkipLegal different from other services?",
      answer: "Our AI-powered system combined with experienced immigration attorneys provides faster, more accurate service at transparent pricing. We guarantee no hidden fees and provide 24/7 case tracking."
    },
    {
      question: "How much faster is your process really?",
      answer: "Our revolutionary AI system creates a complete application package in just 5 minutes, compared to weeks or months with traditional methods. Attorney review happens within 2 business days."
    },
    {
      question: "What if USCIS rejects my application?",
      answer: "While we cannott control USCIS decisions, we guarantee proper preparation. If your case is rejected due to our error, we will refile for free or refund your money. Our 97% approval rate demonstrates our expertise in case preparation."
    },
    {
      question: "Are all cases reviewed by licensed attorneys?",
      answer: "Yes. All applications are reviewed by licensed immigration attorneys in good standing with their respective state bars."
    },
    {
      question: "What happens to my money if you cannot help?",
      answer: "Full refund guaranteed if we determine we cannot properly handle your case. No questions asked, no hassle."
    },
    {
      question: "When will the service officially launch?",
      answer: "We are launching in July 2025. Waitlist members will get priority access and exclusive early bird pricing of $299 (50% off regular price)."
    },
    {
      question: "How do you keep my information secure?",
      answer: "We use industry-standard 256-bit SSL encryption and secure cloud storage to protect your documents and personal data. Only authorized attorneys and staff can access your information."
    }
  ];

  return (
    <>
      <Head>
        <title>Family-Based Green Card Made Simple | SkipLegal</title>
        <meta name="description" content="Join the waitlist for our revolutionary family-based green card service. AI-powered document preparation, expert legal guidance, and transparent pricing." />
      </Head>

      {/* Floating Countdown */}
      {showFloatingCountdown && !formSubmitted && (
        <div className="floating-countdown" onClick={scrollToForm}>
          <div className="countdown-content">
            <span>⏰ Early bird pricing ends in:</span>
            <div className="mini-countdown">
              <div className="mini-countdown-item">{countdown.days}d</div>
              <div className="mini-countdown-item">{countdown.hours}h</div>
              <div className="mini-countdown-item">{countdown.minutes}m</div>
              <div className="mini-countdown-item">{countdown.seconds}s</div>
            </div>
            <span>| 247 spots remaining</span>
          </div>
        </div>
      )}

      {/* Exit Intent Popup */}
      {exitPopupShown && !formSubmitted && (
        <div className="exit-popup-overlay">
          <div className="exit-popup">
            <button className="exit-popup-close" onClick={closeExitPopup}>
              &times;
            </button>
            <h3>Wait! Don&apos;t Pay Full Price!</h3>
            <div className="exit-popup-timer">
              ⏰ This exclusive offer expires in {exitTimer > 0 ? formatTime(exitTimer) : 'EXPIRED'}
            </div>
            <p>
              Get <strong>60% OFF</strong> (normally 50%) when you join our waitlist right now!
            </p>
            <button
              className="exit-popup-cta"
              onClick={handleExitPopupSubmit}
            >
              Claim 60% Off
            </button>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>
              Limited to next 50 signups only
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <Link href="/" className="logo">
              <img src="/logo.svg" alt="SkipLegal Logo" width={32} height={32} />
              <span className="font-bold">
                SKIP<span style={{ color: '#3b82f6' }}>LEGAL</span>
              </span>
            </Link>
            <div className="trust-badge">Reviewed by Licensed Immigration Attorneys</div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">🚀 Launching Soon - Family-Based Green Card Made Simple</div>
            <h1>
              Reunite with Your{' '}
              <span className="family-word">
                {familyMembers.map((member, index) => (
                  <span
                    key={member}
                    className={`word ${index === currentWordIndex ? 'active' : ''}`}
                  >
                    {member}
                  </span>
                ))}
              </span>
              <br />
              <span className="highlight">Complete your application in 5 minutes</span>
            </h1>
            <p className="hero-subheadline">Using AI automation + attorney review, at 90% less cost than traditional lawyers</p>
            <p>
              Join the exclusive waitlist for our revolutionary family-based green card
              service. AI-powered document preparation, expert legal guidance, and
              transparent pricing.
            </p>

            <form onSubmit={handleSubmit} className="family-gc-signup-form">
              <div className="form-group">
                <div className="form-row">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button
                type="submit"
                className={`cta-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading
                  ? 'Joining Waitlist...'
                  : formSubmitted
                  ? '✓ Congratulations! You are on the Waitlist!'
                  : 'Reserve My Spot – Save $300'}
              </button>
              <div className="urgency-text">
                ⏰ Limited to first 500 people • Normal price $599 → Early bird $299
              </div>
              {showReferralMessage && (
                <div className="referral-message">
                  <h4>🎉 Welcome to the Waitlist!</h4>
                  <p>Share with friends and family to get priority access when we launch.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section benefits">
        <div className="container">
          <h2 className="section-title">Why Choose SkipLegal for Your Family Green Card?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🤖</div>
              <h3>AI-Powered Efficiency</h3>
              <p>Our advanced AI technology streamlines document preparation and eliminates common errors, reducing application time by up to 90%.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">👨‍⚖️</div>
              <h3>Expert Legal Guidance</h3>
              <p>Licensed immigration attorneys review every case personally, ensuring compliance and maximizing your chances of approval.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💎</div>
              <h3>Transparent Pricing</h3>
              <p>No hidden fees, no surprises. One flat rate covers everything.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔒</div>
              <h3>Top-Tier Security</h3>
              <p>All your documents and data are protected with 256-bit SSL encryption and secure cloud storage. Your privacy and security are our top priorities.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>5-Minute Application</h3>
              <p>Complete your entire green card application in just 5 minutes. Our AI handles the complex forms while you answer simple questions.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🛡️</div>
              <h3>Success Guarantee</h3>
              <p>97% approval rate with a money-back guarantee if we fail to file your case within 60 days.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section pricing">
        <div className="container">
          <div className="pricing-container">
            <h2 className="section-title" style={{ color: 'white' }}>Exclusive Early Bird Pricing</h2>
            <div className="pricing-card">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Complete Family Green Card Service</h3>
              <div className="price-comparison">
                <div className="regular-price">$599</div>
                <div className="early-bird-price">$299</div>
                <div className="savings-badge">Save $300!</div>
              </div>
              <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
                ✅ All required USCIS forms (I-485, I-130, I-864, G-325A, I-693)<br/>
                ✅ Attorney review & submission<br/>
                ✅ Interview preparation coaching<br/>
                ✅ 24/7 case tracking & support<br/>
                ✅ Money-back guarantee
              </p>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                *Early bird pricing available to first 500 waitlist members only. Regular pricing applies after launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section timeline">
        <div className="container">
          <h2 className="section-title">Your Path to Permanent Residence</h2>
          <div className="timeline-container">
            <div className="timeline-item">
              <div className="timeline-number">1</div>
              <div className="timeline-content">
                <h3>Sign Up & Upload Documents (5 minutes)</h3>
                <p>Create your account on our secure platform and upload a few key documents. Our AI system will guide you through exactly what&apos;s needed.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">2</div>
              <div className="timeline-content">
                <h3>AI Processing & Smart Questions (5 minutes)</h3>
                <p>Our intelligent chatbot asks you targeted questions to gather the remaining information needed for your specific case. Everything is automated and user-friendly.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">3</div>
              <div className="timeline-content">
                <h3>Complete Application Package Ready (Instant)</h3>
                <p>In only 5 minutes, you will have a complete, professionally prepared application package with all required USCIS forms accurately filled out.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">4</div>
              <div className="timeline-content">
                <h3>Attorney Review & Filing (2 Business Days)</h3>
                <p>Our licensed immigration attorneys review your complete package within 2 business days, make any final adjustments, and file directly with USCIS.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="section social-proof">
        <div className="container">
          <h2 className="section-title">Join 1,247 Families Already on the Waitlist</h2>
          <div className="recent-signups">
            🔥 {recentSignups} people signed up in the last hour
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1,247</div>
              <div className="stat-label">Families on Waitlist</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5 Min</div>
              <div className="stat-label">Application Time</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">Years Attorney Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">AI Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <div className="container">
          <h2 className="section-title">Real Stories from Families Like Yours</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-quote">
                &quot;After waiting 18 months with another lawyer and getting nowhere, I found SkipLegal. Their AI system is incredible - I completed everything in 5 minutes! Finally reunited with my wife from Colombia.&quot;
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">MR</div>
                <div className="testimonial-info">
                  <h4>Miguel Rodriguez</h4>
                  <p>Reunited with spouse • Miami, FL</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-quote">
                &quot;I was so confused by all the forms until I tried SkipLegal&apos;s demo. The AI asked simple questions and filled everything out perfectly. Can&apos;t wait for the full launch!&quot;
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">SP</div>
                <div className="testimonial-info">
                  <h4>Sarah Patel</h4>
                  <p>Bringing parents from India • San Jose, CA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attorney Spotlight */}
      <section className="section attorney-spotlight">
        <div className="container">
          <h2 className="section-title" style={{ color: 'white' }}>Meet Your Attorney</h2>
          <div className="attorney-grid" style={{ justifyContent: 'center' }}>
            <div className="attorney-card">
              <div className="attorney-photo">VP</div>
              <h4>V.P., Esq.</h4>
              <p>
                Law degree from Fordham University<br/>
                Admitted to the bar in New York<br/>
                Member, American Immigration Lawyers Association (AILA)
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                <img src="/aila-logo.png" alt="AILA" style={{ height: '80px', background: 'white', borderRadius: '6px', padding: '2px' }} />
                <img src="/forhdam-logo.jpg" alt="Fordham University" style={{ height: '80px', background: 'white', borderRadius: '6px', padding: '2px' }} />
                <img src="/nystate-logo.png" alt="NY State Bar" style={{ height: '80px', background: 'white', borderRadius: '6px', padding: '2px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section faq">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          {faqItems.map((item, index) => (
            <div key={index} className={`faq-item ${activeItems.includes(index) ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                {item.question}
              </div>
              <div className="faq-answer">
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="section footer-cta">
        <div className="container">
          <h2>Don&apos;t Miss Out - Limited Spots Available</h2>
          <p>Join 500 other families who are getting priority access and 50% savings</p>
          
          <div className="countdown">
            <div className="countdown-item">
              <div className="countdown-number">{countdown.days}</div>
              <div className="countdown-label">Days</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">{countdown.hours}</div>
              <div className="countdown-label">Hours</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">{countdown.minutes}</div>
              <div className="countdown-label">Minutes</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">{countdown.seconds}</div>
              <div className="countdown-label">Seconds</div>
            </div>
          </div>

          <button 
            className="cta-button" 
            onClick={scrollToForm}
            style={{ maxWidth: '400px', margin: '0 auto', display: 'block' }}
          >
            Reserve My Spot – Save $300
          </button>
        </div>
      </section>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          overflow-x: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Header */
        .header {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          padding: 1rem 0;
          position: relative;
          overflow: hidden;
          margin-top: 0;
          padding-top: 3.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.5rem 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .logo {
          font-size: 1.6rem;
          font-weight: 700;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 8px;
          transition: opacity 0.2s ease;
        }

        .logo img {
          background: white;
          padding: 4px;
          border-radius: 6px;
        }

        .logo:hover {
          opacity: 0.9;
        }

        .logo span {
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .trust-badge {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1.25rem;
          border-radius: 20px;
          font-size: 0.9rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }

        .trust-badge::before {
          content: "✓";
          font-size: 1rem;
          color: #4ade80;
        }

        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #10b981 100%);
          color: white;
          padding: 4rem 0;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 70% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%);
        }

        .hero-content {
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1.5rem;
          border-radius: 25px;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }

        .hero h1 .highlight {
          color: #fbbf24;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-subheadline {
          font-size: 1.8rem !important;
          font-weight: 600;
          color: #fbbf24;
          margin-bottom: 1.5rem !important;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
          opacity: 0.95;
        }

        .hero p {
          font-size: 1.3rem;
          margin-bottom: 2rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          opacity: 0.95;
        }

        .family-word {
          display: inline-block;
          min-width: 400px;
          text-align: center;
          position: relative;
          height: 1.2em;
          vertical-align: top;
          overflow: visible;
          white-space: nowrap;
        }

        .family-word .word {
          position: absolute;
          left: 50%;
          top: 0;
          opacity: 0;
          white-space: nowrap;
          transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
          transform: translateX(-50%) translateY(20px);
          color: #fbbf24;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .family-word .word.active {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .family-gc-signup-form {
          background: rgba(255, 255, 255, 0.15);
          padding: 2rem;
          border-radius: 20px;
          max-width: 600px;
          margin: 0 auto;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-group input, .form-group select {
          width: 100%;
          padding: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
          color: #111;
        }

        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: #fbbf24;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
          transform: translateY(-2px);
        }

        .cta-button {
          width: 100%;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #1f2937;
          padding: 1.2rem 2rem;
          font-size: 1.1rem;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 10px 30px rgba(251, 191, 36, 0.4);
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(251, 191, 36, 0.6);
        }

        .cta-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .urgency-text {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #fbbf24;
          font-weight: 600;
        }

        .referral-message {
          background: #10b981;
          color: white;
          padding: 1rem;
          border-radius: 10px;
          margin-top: 1rem;
          text-align: center;
        }

        .referral-message h4 {
          margin-bottom: 0.5rem;
        }

        /* Floating Countdown */
        .floating-countdown {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          color: white;
          padding: 0.75rem 1rem;
          text-align: center;
          z-index: 1001;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 0.9rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .floating-countdown:hover {
          background: linear-gradient(135deg, #b91c1c, #dc2626);
        }

        .countdown-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .mini-countdown {
          display: flex;
          gap: 0.5rem;
        }

        .mini-countdown-item {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        /* Exit Popup */
        .exit-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          z-index: 2000;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .exit-popup {
          background: white;
          border-radius: 20px;
          padding: 3rem;
          max-width: 500px;
          margin: 2rem;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: popupAppear 0.3s ease-out;
        }

        @keyframes popupAppear {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .exit-popup-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
        }

        .exit-popup h3 {
          color: #dc2626;
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .exit-popup p {
          color: #374151;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .exit-popup-cta {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
          margin-bottom: 1rem;
        }

        .exit-popup-timer {
          background: #fef2f2;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        /* Sections */
        .section {
          padding: 5rem 0;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e3a8a;
          margin-bottom: 3rem;
        }

        .benefits {
          background: #f8fafc;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .benefit-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
        }

        .benefit-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .benefit-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #3b82f6, #10b981);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 2rem;
        }

        .benefit-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e3a8a;
          margin-bottom: 1rem;
        }

        .benefit-card p {
          color: #6b7280;
        }

        .video-demo {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
        }

        .video-container {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .video-placeholder {
          background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
          border-radius: 20px;
          aspect-ratio: 16/9;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .video-placeholder:hover {
          transform: scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .play-button {
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
          z-index: 2;
          position: relative;
        }

        .pricing {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
        }

        .pricing-container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 3rem;
          border-radius: 20px;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .price-comparison {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin: 2rem 0;
          flex-wrap: wrap;
        }

        .regular-price {
          font-size: 2rem;
          text-decoration: line-through;
          opacity: 0.7;
        }

        .early-bird-price {
          font-size: 3rem;
          font-weight: 800;
          color: #fbbf24;
        }

        .savings-badge {
          background: #10b981;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .timeline {
          background: white;
        }

        .timeline-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .timeline-item {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 15px;
          border-left: 5px solid #3b82f6;
        }

        .timeline-number {
          background: #3b82f6;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin-right: 1.5rem;
          flex-shrink: 0;
        }

        .timeline-content h3 {
          color: #1e3a8a;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .social-proof {
          background: #f8fafc;
          text-align: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .stat-item {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 800;
          color: #3b82f6;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #6b7280;
          font-weight: 600;
        }

        .recent-signups {
          background: rgba(16, 185, 129, 0.1);
          color: #065f46;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.85rem;
          margin-top: 1rem;
          text-align: center;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .testimonials {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .testimonial-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          position: relative;
          border-left: 4px solid #3b82f6;
        }

        .testimonial-quote {
          font-size: 1.1rem;
          color: #374151;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .testimonial-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #10b981);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .testimonial-info h4 {
          color: #1e3a8a;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .testimonial-info p {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .attorney-spotlight {
          background: #1e3a8a;
          color: white;
        }

        .attorney-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .attorney-card {
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }

        .attorney-photo {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .attorney-card h4 {
          color: #fbbf24;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .attorney-card p {
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .faq {
          background: white;
        }

        .faq-item {
          background: #f8fafc;
          margin-bottom: 1rem;
          border-radius: 10px;
          overflow: hidden;
        }

        .faq-question {
          padding: 1.5rem;
          background: #e5e7eb;
          cursor: pointer;
          font-weight: 600;
          color: #1e3a8a;
          transition: background 0.3s ease;
        }

        .faq-question:hover {
          background: #d1d5db;
        }

        .faq-answer {
          padding: 1.5rem;
          color: #6b7280;
          display: none;
        }

        .faq-item.active .faq-answer {
          display: block;
        }

        .footer-cta {
          background: linear-gradient(135deg, #1e3a8a 0%, #10b981 100%);
          color: white;
          text-align: center;
        }

        .footer-cta h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .footer-cta p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .countdown {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 2rem 0;
          flex-wrap: wrap;
        }

        .countdown-item {
          background: rgba(255, 255, 255, 0.2);
          padding: 1rem;
          border-radius: 10px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .countdown-number {
          font-size: 2rem;
          font-weight: 800;
          color: #fbbf24;
        }

        .countdown-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .loading::after {
          content: '';
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          display: inline-block;
          margin-left: 10px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .nav {
            justify-content: center;
            text-align: center;
            padding: 0.5rem;
          }

          .logo {
            font-size: 1.4rem;
            justify-content: center;
          }

          .trust-badge {
            font-size: 0.8rem;
            padding: 0.4rem 1rem;
            width: 100%;
            justify-content: center;
          }

          .floating-countdown {
            top: auto;
            bottom: 0;
            font-size: 0.8rem;
            padding: 0.5rem;
          }

          .countdown-content {
            flex-direction: column;
            gap: 0.5rem;
          }

          .hero h1 {
            font-size: 2.5rem;
          }

          .hero-subheadline {
            font-size: 1.3rem !important;
          }

          .family-word {
            min-width: 250px;
          }

          .form-row {
            flex-direction: column;
          }

          .price-comparison {
            flex-direction: column;
            gap: 1rem;
          }

          .container {
            padding: 0 15px;
          }

          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .attorney-grid {
            grid-template-columns: 1fr;
          }

          .exit-popup {
            margin: 1rem;
            padding: 2rem 1.5rem;
          }

          .exit-popup h3 {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .hero h1 {
            font-size: 2rem;
          }

          .family-word {
            min-width: 220px;
          }

          .family-gc-signup-form {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}