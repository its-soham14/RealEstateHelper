import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Zap, Shield, Home as HomeIcon } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const About = () => {
    return (
        <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'var(--font-sans)', paddingTop: 'var(--navbar-height)' }}>
            
            {/* Hero Section */}
            <section style={{ padding: '6rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, #0a0a0a 0%, #000 100%)' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', color: '#c8a96e', padding: '0.4rem 1rem', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                        About Us
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 1.5rem 0', lineHeight: 1 }}>
                        Redefining Real Estate <br />
                        <span style={{ color: '#c8a96e', fontStyle: 'italic' }}>with Radical Transparency.</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
                        RealEstateHelper is India's fastest-growing, zero-brokerage property platform. We connect buyers and sellers directly, eliminating middlemen and hidden fees.
                    </p>
                </motion.div>
            </section>

            {/* Founder Section */}
            <section style={{ padding: '4rem 2rem', borderTop: '1px solid #111', borderBottom: '1px solid #111', background: '#050505' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}>
                        <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#1a1a1a', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>
                            SR
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Soham Ratnaparkhi</h2>
                        <div style={{ color: '#c8a96e', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Founder & CEO</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}>
                        <p style={{ color: '#999', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 700, margin: 0 }}>
                            Founded in 2025, RealEstateHelper was built from a simple frustration: finding a home shouldn't be harder than buying one. Our mission is to empower Indians to make confident real estate decisions by providing 100% verified listings, zero brokerage fees, and a direct line of communication between buyers and sellers.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats / Value Props */}
            <section style={{ padding: '6rem 2rem' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {[
                        { icon: Shield, title: '100% Verified', desc: 'Every property is rigorously checked for authenticity and RERA compliance before being listed.' },
                        { icon: Zap, title: 'Zero Brokerage', desc: 'Why pay a middleman? Connect directly with the owner and save thousands on brokerage fees.' },
                        { icon: Users, title: 'Community First', desc: 'Over 2.4L+ families trust us to find their next home, office, or investment property.' },
                        { icon: HomeIcon, title: 'Seamless Booking', desc: 'Pay a 5% token amount securely online to instantly block a property and stop other inquiries.' }
                    ].map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '2rem', borderRadius: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(200,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c8a96e', marginBottom: '1.5rem' }}>
                                <item.icon size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>{item.title}</h3>
                            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section style={{ padding: '0 2rem 6rem' }}>
                <div style={{ maxWidth: 800, margin: '0 auto', background: '#111', border: '1px solid #222', borderRadius: 24, padding: '4rem 2rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 1rem 0' }}>Get in Touch</h2>
                    <p style={{ color: '#888', marginBottom: '2.5rem' }}>Have questions? Our support team is here to help.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '1.1rem' }}>
                            <span style={{ color: '#c8a96e', fontWeight: 700 }}>Email:</span> <a href="mailto:realestatehelperteam@gmail.com" style={{ color: '#fff', textDecoration: 'none' }}>realestatehelperteam@gmail.com</a>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '1.1rem' }}>
                            <span style={{ color: '#c8a96e', fontWeight: 700 }}>Phone:</span> <a href="tel:7385833456" style={{ color: '#fff', textDecoration: 'none' }}>+91 7385833456</a>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '1.1rem' }}>
                            <span style={{ color: '#c8a96e', fontWeight: 700 }}>Headquarters:</span> HITEC City, Hyderabad, India
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
