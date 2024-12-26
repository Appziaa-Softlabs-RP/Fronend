import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { enviroment } from '../../enviroment';
import { useAppStore } from '../../store';
import styles from './Footer.module.css';

export const Footer = () => {

  const navItems = useAppStore((state) => state.navItems);

  return (
    <footer className={styles.footer}>
      <Container>
        <Row className={styles.mainContent}>
          <Col lg={3} md={6} className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>About the Shop</h3>
            <p className={styles.aboutText}>
              Ashi Electronics specializes in selling open-box home and electronic appliances, offering high-quality products at deeply discounted prices. The brand ensures that all items are thoroughly tested and certified for functionality and reliability, providing customers with excellent value for money. With a focus on affordability and sustainability, Ashi Electronics caters to smart shoppers looking for premium appliances at unbeatable deals.
            </p>
            <div className={styles.socialIcons}>
              {
                enviroment.FACEBOOK_LINK &&
                <a href={enviroment.FACEBOOK_LINK} className={styles.socialLink}><Facebook /></a>
              }
              {
                enviroment.TWITTER_LINK &&
                <a href={enviroment.TWITTER_LINK} className={styles.socialLink}><Twitter /></a>
              }
              {
                enviroment.INSTAGRAM_LINK &&
                <a href={enviroment.INSTAGRAM_LINK} className={styles.socialLink}><Instagram /></a>
              }
              {
                enviroment.YOUTUBE_LINK &&
                <a href={enviroment.YOUTUBE_LINK} className={styles.socialLink}><Youtube /></a>
              }
              {
                enviroment.LINKEDIN_LINK &&
                <a href={enviroment.LINKEDIN_LINK} className={styles.socialLink}><Linkedin /></a>
              }
            </div>
          </Col>

          <Col lg={3} md={6} className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Main Menu</h3>
            {/* {JSON.stringify(navItems)} */}
            <ul className={styles.footerLinks}>
              {navItems?.map((item, index) => (
                <li
                  key={index}
                ><Link to="/">
                    {item?.name}
                  </Link></li>
              ))}
            </ul>
          </Col>

          <Col lg={3} md={6} className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Important Links</h3>
            <ul className={styles.footerLinks}>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/return-policy">Refund & Return Policy</Link></li>
              <li><Link to="/shipping-information-policy">Shipping Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cancellation-policy">Cancellation Policy</Link></li>
              <li><Link to="/faq">FAQ's</Link></li>
            </ul>
          </Col>

          <Col lg={3} md={6} className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Newsletter</h3>
            <p className={styles.newsletterText}>
              Stay updated with our latest offers and product news. Subscribe to our newsletter.
            </p>
            <Form className={styles.newsletterForm}>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                className={styles.emailInput}
              />
              <Button className={styles.subscribeButton}>
                Subscribe
              </Button>
            </Form>

            <div className={styles.contactInfo}>
              <h3 className={styles.columnTitle}>Contact Us</h3>
              <p>+91 9654502991</p>
              <p>+91 9811931938</p>
              <p>Wednesday to Saturday: 11:00 AM - 7:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </Col>
        </Row>

        <div className={styles.businessSection}>
          <h3 className={styles.columnTitle} style={{
            width: 'fit-content',
            margin: 'auto'
          }}>Let's Do Business Together!</h3>
          <p>
            Be a part of AshiElectronics - Recommence Retail revolution and own a profitable online + offline business.
            Contact us at info@ashielectronics.com or WhatsApp 9654502991
          </p>
        </div>

        <div className={styles.copyrightSection}>
          <p>© {(new Date()).getFullYear()} AshiElectronics India</p>
          <p>AshiElectronics.in is a property of AshiElectronics. Developed & Marketed by RewardsPlus</p>
        </div>
      </Container>
    </footer>
  );
}
