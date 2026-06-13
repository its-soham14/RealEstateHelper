import React from 'react';
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const PrivacyPolicy = () => {
    return (
        <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'var(--font-sans)', paddingTop: 'var(--navbar-height)' }}>
            
            {/* Header */}
            <section style={{ padding: '4rem 2rem', borderBottom: '1px solid #111', background: '#050505', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 1rem 0' }}>Privacy Policy</h1>
                    <p style={{ color: '#888', fontSize: '1rem', margin: 0 }}>Last Updated: October 2025</p>
                </motion.div>
            </section>

            {/* Content */}
            <section style={{ padding: '4rem 2rem' }}>
                <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c8a96e', marginBottom: '1rem' }}>1. Introduction</h2>
                        <p style={{ color: '#ccc', lineHeight: 1.7, fontSize: '0.95rem' }}>
                            Welcome to RealEstateHelper. We value your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c8a96e', marginBottom: '1rem' }}>2. Data We Collect</h2>
                        <p style={{ color: '#ccc', lineHeight: 1.7, fontSize: '0.95rem' }}>
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                        </p>
                        <ul style={{ color: '#ccc', lineHeight: 1.7, fontSize: '0.95rem', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                            <li><strong>Profile Data:</strong> includes your username and password, purchases or orders made by you.</li>
                        </ul>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c8a96e', marginBottom: '1rem' }}>3. How We Use Your Data</h2>
                        <p style={{ color: '#ccc', lineHeight: 1.7, fontSize: '0.95rem' }}>
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul style={{ color: '#ccc', lineHeight: 1.7, fontSize: '0.95rem', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal obligation.</li>
                        </ul>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c8a96e', marginBottom: '1rem' }}>4. Data Security</h2>
                        <p style={{ color: '#ccc', lineHeight: 1.7, fontSize: '0.95rem' }}>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c8a96e', marginBottom: '1rem' }}>5. Contact Details</h2>
                        <p style={{ color: '#ccc', lineHeight: 1.7, fontSize: '0.95rem' }}>
                            If you have any questions about this privacy policy or our privacy practices, please contact us in the following ways:
                        </p>
                        <div style={{ background: '#111', padding: '1.5rem', borderRadius: 12, marginTop: '1rem', border: '1px solid #222' }}>
                            <p style={{ margin: '0 0 0.5rem 0', color: '#ccc' }}><strong style={{ color: '#fff' }}>Email address:</strong> <a href="mailto:realestatehelperteam@gmail.com" style={{ color: '#c8a96e', textDecoration: 'none' }}>realestatehelperteam@gmail.com</a></p>
                            <p style={{ margin: '0 0 0.5rem 0', color: '#ccc' }}><strong style={{ color: '#fff' }}>Telephone number:</strong> +91 7385833456</p>
                            <p style={{ margin: '0', color: '#ccc' }}><strong style={{ color: '#fff' }}>Postal address:</strong> HITEC City, Hyderabad, India</p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
