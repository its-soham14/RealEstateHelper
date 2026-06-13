import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter, Shield, CheckCircle, Star } from 'lucide-react';

const Footer = () => {
    return (
        <>
            <style>{`
                .reb-footer { background: #060606; border-top: 1px solid #141414; padding: 80px 2rem 2rem; font-family: 'Satoshi', sans-serif; color: #fff; }
                .footer-grid { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 4rem; }
                .footer-brand-desc { font-size: 0.9375rem; color: rgba(255,255,255,0.4); line-height: 1.7; margin-top: 1rem; max-width: 280px; }
                .footer-social { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
                .footer-social a { width: 36px; height: 36px; border-radius: 10px; background: #141414; border: 1px solid #1c1c1c; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.45); transition: all 0.25s; text-decoration: none; }
                .footer-social a:hover { background: #1c1c1c; color: #fff; border-color: #2a2a2a; }
                .footer-col-title { font-family: 'Clash Display', sans-serif; font-size: 0.875rem; font-weight: 700; color: #fff; letter-spacing: 0.04em; margin-bottom: 1.25rem; }
                .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; padding: 0; margin: 0; }
                .footer-links li a { font-size: 0.875rem; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.2s; }
                .footer-links li a:hover { color: rgba(255,255,255,0.8); }
                .footer-bottom { max-width: 1280px; margin: 0 auto; border-top: 1px solid #141414; padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
                .footer-bottom-text { font-size: 0.8125rem; color: rgba(255,255,255,0.25); }
                .footer-trust { display: flex; gap: 1.5rem; }
                .trust-seal { font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.3); display: flex; align-items: center; gap: 0.35rem; }
                .trust-seal svg { color: #c8a96e; }
                .reb-nav-logo { font-family: 'Clash Display', sans-serif; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.04em; color: #fff; text-decoration: none; }
                .reb-nav-logo span { color: #c8a96e; }
                @media (max-width: 1024px) {
                    .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
                }
                @media (max-width: 768px) {
                    .footer-grid { grid-template-columns: 1fr; }
                }
            `}</style>
            <footer className="reb-footer">
                <div className="footer-grid">
                    <div>
                        <Link to="/" className="reb-nav-logo" style={{ display: 'inline-block', marginBottom: '1rem' }}>RE<span>H</span></Link>
                        <p className="footer-brand-desc">RealEstateHelper — Redefining real estate by combining cutting-edge tech with radical transparency.</p>
                        <div className="footer-social">
                            <a href="#"><Instagram size={16} /></a>
                            <a href="#"><Linkedin size={16} /></a>
                            <a href="#"><Twitter size={16} /></a>
                        </div>
                    </div>
                    <div>
                        <div className="footer-col-title">Quick Links</div>
                        <ul className="footer-links">
                            {['Buy Property', 'Rent Property', 'Sell Property', 'New Projects', 'Home Loans'].map(l => (
                                <li key={l}><Link to="/signup">{l}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <div className="footer-col-title">Top Cities</div>
                        <ul className="footer-links">
                            {['Mumbai', 'Bangalore', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai'].map(c => (
                                <li key={c}><Link to="/signup">{c}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <div className="footer-col-title">Company</div>
                        <ul className="footer-links">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><a href="mailto:realestatehelperteam@gmail.com">Contact Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Press</a></li>
                            <li><a href="#">Blog</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span className="footer-bottom-text">© 2025 RealEstateHelper. Founded by Soham Ratnaparkhi. Built with purpose.</span>
                    <div className="footer-trust">
                        <span className="trust-seal"><Shield size={12} /> SSL Secured</span>
                        <span className="trust-seal"><CheckCircle size={12} /> RERA Compliant</span>
                        <span className="trust-seal"><Star size={12} /> ISO 27001</span>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
