import React, { useEffect } from "react";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { useApp } from "../../context/AppContextProvider";
import { Link } from "react-router-dom";

export const Terms = () => {
  const appData = useApp();
  let windowWidth = appData.appData.windowWidth;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <React.Fragment>
      {windowWidth === "mobile" ? (
        <PageHeader title="Terms & Conditions" hide={true} />
      ) : (
        <Header />
      )}
      <div className="min-vh-100 col-12 d-inline-flex flex-column my-5">
        <div className="container">
          <h1>Terms & Conditions</h1>
          <p>
            Welcome to MRPC, your trusted omnichannel grocery supermarket serving customers since 1972. These Terms & Conditions ("Terms") govern your use of our website ("the Site") and the purchase of products from MRPC ("we," "us," or "our"). Please read these Terms carefully before using our services.
          </p>
          <h2>1. Account Creation and Use</h2>
          <ul>
            <li>
              To shop with us online, you must create an account with accurate and up-to-date information.
            </li>
            <li>You are responsible for maintaining the confidentiality of your account details.</li>
            <li>
              All activities carried out under your account are your responsibility.
            </li>
          </ul>
          <h2>2. Orders and Payments</h2>
          <ul>
            <li>All prices on the Site are listed in Indian Rupees (INR).</li>
            <li>
              We accept a variety of payment methods, including credit cards, debit cards, net banking, and other online options.
            </li>
            <li>
              Orders are subject to acceptance and availability. We reserve the right to refuse or cancel orders at our discretion.
            </li>
          </ul>
          <h2>3. Shipping and Delivery</h2>
          <ul>
            <li>
              Delivery times and charges depend on your location and the items ordered.
            </li>
            <li>
              We aim to deliver orders within 0-7 days; however, delays may occur due to factors beyond our control.
            </li>
          </ul>
          <h2>4. Returns and Refunds</h2>
          <ul>
            <li>
              Please refer to our detailed <Link to="/return-policy">Return Policy</Link> for information regarding returns and refunds.
            </li>
          </ul>
          <h2>5. Intellectual Property</h2>
          <ul>
            <li>
              All content on our Site, including text, images, and designs, is the property of MRPC or its licensors and protected by copyright laws.
            </li>
            <li>
              Unauthorized use of our content is strictly prohibited.
            </li>
          </ul>
          <h2>6. User Conduct</h2>
          <ul>
            <li>You agree not to use the Site for any unlawful or harmful activities.</li>
            <li>
              Any content that violates the rights of others, including intellectual property or privacy, is prohibited.
            </li>
          </ul>
          <h2>7. Disclaimer of Warranties</h2>
          <ul>
            <li>
              The Site and all products are provided "as is." We disclaim all warranties, express or implied, including those of merchantability and fitness for a particular purpose.
            </li>
          </ul>
          <h2>8. Limitation of Liability</h2>
          <ul>
            <li>
              MRPC is not liable for any damages arising from your use of the Site, including indirect or incidental damages.
            </li>
          </ul>
          <h2>9. Changes to Terms & Conditions</h2>
          <ul>
            <li>
              We may update these Terms from time to time. Continued use of the Site implies acceptance of the updated Terms.
            </li>
          </ul>
          <h2>10. Governing Law</h2>
          <ul>
            <li>
              These Terms are governed by the laws of India, with jurisdiction in Delhi.
            </li>
          </ul>
          <h2>11. Contact Us</h2>
          <p>
            For questions or support, please reach out to us:
          </p>
          <ul>
            <li>Email: <Link to={`mailto:${process.env.REACT_APP_EMAIL_ADDRESS}`}>{process.env.REACT_APP_EMAIL_ADDRESS}</Link></li>
            <li>Phone: +91-99997 56468</li>
            <li>Address: MRPC, Govindpuri Extension, Delhi - 110019, India</li>
          </ul>
          <p>
            By using our Site, you agree to these Terms & Conditions. Thank you for choosing MRPC!
          </p>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};