import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#fff', borderTop: '3px solid #000', marginTop: 'auto' }}>
      {/* Upper Footer Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', display: 'flex', flexWrap: 'wrap', gap: '60px' }}>

        {/* Contact Column (Reduced Stay Connected) */}
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '25px', letterSpacing: '-0.02em' }}>GET IN TOUCH</h3>
          <p style={{ color: '#666', fontWeight: 600, fontSize: '1rem', lineHeight: 1.6, marginBottom: '30px' }}>
            Have questions or need support? MOCKMASTER is here to help you master your exams.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                backgroundColor: '#FCEB7B',
                border: '2px solid #000',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '3px 3px 0px #000'
              }}>
                <Mail size={18} strokeWidth={3} />
              </div>
              <span style={{ fontWeight: 900 }}>sarveshkumarsinghhh6@gmail.com</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                backgroundColor: '#FCEB7B',
                border: '2px solid #000',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '3px 3px 0px #000'
              }}>
                <Phone size={18} strokeWidth={3} />
              </div>
              <span style={{ fontWeight: 900 }}>+91 6392867714</span>
            </div>
          </div>
        </div>

        {/* Quick Links Column */}
        <div style={{ flex: '0 1 200px' }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '25px' }}>QUICK LINKS</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['HOME', 'ABOUT', 'SERVICES', 'PORTFOLIO', 'BLOG', 'CONTACT'].map((link) => (
              <li key={link}>
                <a href="#" style={{ textDecoration: 'none', color: '#000', fontWeight: 700, fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#f93109ff'} onMouseOut={(e) => e.target.style.color = '#000'}>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources Column */}
        <div style={{ flex: '0 1 200px' }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '25px' }}>RESOURCES</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['DOCUMENTATION', 'API REFERENCE', 'TUTORIALS', 'COMMUNITY', 'SUPPORT', 'STATUS'].map((link) => (
              <li key={link}>
                <a href="#" style={{ textDecoration: 'none', color: '#000', fontWeight: 700, fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#f93109ff'} onMouseOut={(e) => e.target.style.color = '#000'}>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ backgroundColor: '#000', padding: '30px 20px', textAlign: 'center' }}>
        <p style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.05em', margin: 0 }}>
          © 2026 MOCKMASTER. Crafted with passion and Super Love. All rights reserved.
          <br />
          ❤️ by Sarvesh Kumar Singh
        </p>
      </div>
    </footer>
  );
};

export default Footer;
