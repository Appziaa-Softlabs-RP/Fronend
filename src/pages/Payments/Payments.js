import React, { useEffect } from "react";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { useApp } from "../../context/AppContextProvider";
import { Link } from "react-router-dom";

export const Payments = () => {
  const appData = useApp();
  let windowWidth = appData.appData.windowWidth;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <React.Fragment>
      {windowWidth === "mobile" ? (
        <PageHeader title="Payments" hide={true} />
      ) : (
        <Header />
      )}
      <div className="min-vh-100 col-12 d-inline-flex flex-column my-5">
        <div className="container">
          <h1>Payments</h1>
          <p className="c6">
            <span className="c2">Effective Date:</span>
            <span className="c4">&nbsp;February 29, 2024</span>
          </p>
          <p className="c6">
            <span className="c1">1. Introduction</span>
          </p>
          <p className="c6">
            <span className="c4">
              This Payments Policy describes the payment methods available for
              purchases on {process.env.REACT_APP_URL} (&quot;the Site&quot;).
            </span>
          </p>
          <p className="c6">
            <span className="c1">2. Accepted Payment Methods</span>
          </p>
          <p className="c6">
            <span className="c4">We offer the following payment methods:</span>
          </p>
          <ul className="c10 lst-kix_lhn94rw92ts4-0 start">
            <li className="c0 li-bullet-0">
              <span className="c2">Credit Cards:</span>
              <span className="c4">
                &nbsp;We accept Visa, Mastercard, and other major credit cards
                issued in India.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c2">Debit Cards:</span>
              <span className="c4">
                &nbsp;We accept debit cards issued by banks in India.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c2">Cash on Delivery (COD):</span>
              <span className="c4">
                &nbsp;You can pay cash upon delivery of your order. Additional
                COD charges may apply.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c2">UPI:</span>
              <span className="c4">
                &nbsp;We accept payments through popular UPI platforms like
                PhonePe and Google Pay powered by Razorpay.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">3. Payment Processing</span>
          </p>
          <ul className="c10 lst-kix_2bg2nzopvxlh-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                We use secure payment gateways for all online transactions.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                You will be directed to the payment gateway&#39;s secure website
                to enter your payment information.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                We do not store your full credit card or debit card information.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">4. Order Confirmation</span>
          </p>
          <ul className="c10 lst-kix_lwe1kl9zm1cw-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                Once your payment is confirmed, you will receive an order
                confirmation email.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                If your chosen payment method is COD, no confirmation email will
                be sent.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">5. Transaction Fees</span>
          </p>
          <ul className="c10 lst-kix_5b27zip28age-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                No additional transaction fees are charged for using
                credit/debit cards or UPI.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                Cash on Delivery (COD) may incur an additional fee, which will
                be clearly displayed at checkout.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">6. Security</span>
          </p>
          <ul className="c10 lst-kix_k1up0fixapi3-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                We take security seriously and use industry-standard security
                measures to protect your payment information.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">7. Changes to Payment Policy</span>
          </p>
          <ul className="c10 lst-kix_gaq5ww9umwel-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                We may update this Payments Policy at any time. We will post the
                updated Policy on the Site.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                Your continued use of the Site after any changes are made
                constitutes your acceptance of the updated Policy.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">8. Contact Us</span>
          </p>
          <p className="c6">
            <span className="c4">
              For any questions or concerns regarding payments, please contact
              us:
            </span>
          </p>
          <ul className="c10 lst-kix_yasi54br4n2q-0 start">
            <li className="c0 li-bullet-0">
              <span className="c2">Email:</span>
              <span className="c8">&nbsp;</span>
              <span className="c15">
                <Link className="c17" to={`mailto:${process.env.REACT_APP_EMAIL_ADDRESS}`}>
                {process.env.REACT_APP_EMAIL_ADDRESS}
                </Link>
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c2">Phone:</span>
              <span className="c4">&nbsp;+91-99997 56468</span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c2">Address:</span>
              <span className="c8">&nbsp;</span>
              <span className="c14">
                MRPC, Govindpuri Extension, Delhi - 110019 (Beside Corporation Bank)
                India,{" "}
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">
              By using the {process.env.REACT_APP_URL} website, you acknowledge and agree
              to this Payments Policy.
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};
