import React, { useEffect } from "react";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { useApp } from "../../context/AppContextProvider";
import { Link } from "react-router-dom";

export const Return = () => {
  const appData = useApp();
  let windowWidth = appData.appData.windowWidth;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <React.Fragment>
      {windowWidth === "mobile" ? (
        <PageHeader title="Return Policy" hide={true} />
      ) : (
        <Header />
      )}
      <div className="min-vh-100 col-12 d-inline-flex flex-column my-5">
        <div className="container">
          <h1>Return Policy</h1>
          <p className="c6">
            <span className="c7">{process.env.REACT_APP_BUSINESS_NAME} Return Policy</span>
          </p>
          <p className="c6">
            <span className="c2">Effective Date:</span>
            <span className="c4">&nbsp;February 29, 2024</span>
          </p>
          <p className="c6">
            <span className="c1">Return Window:</span>
          </p>
          <p className="c6">
            <span className="c8">{process.env.REACT_APP_BUSINESS_NAME} offers a </span>
            <span className="c2">7-day return policy</span>
            <span className="c4">
              &nbsp;for all online and in-store purchases. This means you have 7
              days from the date of purchase to request a return.
            </span>
          </p>
          <p className="c6">
            <span className="c1">Items Eligible for Return:</span>
          </p>
          <ul className="c10 lst-kix_isgwu580cs8w-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                Unopened and unused items in their original packaging with all
                tags attached are eligible for a full refund.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                Opened items may be eligible for store credit or exchange, at
                our discretion.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                Items marked as &quot;Final Sale&quot; or &quot;Clearance&quot;
                are not eligible for return or exchange.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">Return Process:</span>
          </p>
          <ul className="c10 lst-kix_cb5fqzi5fw09-0 start">
            <li className="c0 li-bullet-0">
              <span className="c2">Online Purchases:</span>
              <span className="c8">
                &nbsp;To initiate a return for an online purchase, please
                contact us via email at{" "}
              </span>
              <span className="c15">
                <Link className="c17" to={`mailto:${process.env.REACT_APP_EMAIL_ADDRESS}`}>
                  {process.env.REACT_APP_EMAIL_ADDRESS}
                </Link>
              </span>
              <span className="c8">&nbsp;</span>
              <span className="c4">
                within the 7-day return window. Include your order number, the
                items you wish to return, and the reason for your return. We
                will then provide you with instructions on how to return the
                items.
              </span>
            </li>
          </ul>
          <p className="c11 c23">
            <span className="c4"></span>
          </p>
          <ul className="c10 lst-kix_cb5fqzi5fw09-0">
            <li className="c0 li-bullet-0">
              <span className="c2">In-Store Purchases:</span>
              <span className="c8">
                &nbsp;You may return items purchased in-store to our location at{" "}
              </span>
              <span className="c14 c18">
                NEOTOY INNOVATIONS PRIVATE LIMITED Sri Sai Tower, No. 994, 1st Floor, 1st main, Koramangala 1st Block Bengaluru -560034 Karnataka
                India,{" "}
              </span>
              <span className="c4">
                &nbsp;within the 7-day return window. Please bring your receipt
                with you.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">Shipping Costs:</span>
          </p>
          <ul className="c10 lst-kix_aafslp5ju28a-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                You are responsible for the cost of shipping the returned
                item(s) back to {process.env.REACT_APP_BUSINESS_NAME}.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                For online purchases, we offer free pickup from the delivered
                location.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">Refunds:</span>
          </p>
          <ul className="c10 lst-kix_aucshdx3yxsx-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                Once we receive your returned item(s) and verify that they meet
                the return criteria, we will issue a refund to your original
                payment method within 7 business days.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                For in-store purchases, refunds will be issued in the same form
                of payment used for the original purchase.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">Exclusions:</span>
          </p>
          <ul className="c10 lst-kix_ja24afuyk4no-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                This return policy applies only to purchases made from
                {process.env.REACT_APP_BUSINESS_NAME}. Items purchased from other retailers or through
                third-party marketplaces may have different return policies.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                We reserve the right to deny a return or exchange if the item(s)
                are not returned in accordance with this policy.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">Contact Us:</span>
          </p>
          <p className="c6">
            <span className="c8">
              If you have any questions about our return policy, please contact
              us at{" "}
            </span>
            <span className="c15">
              <Link className="c17" to={`mailto:${process.env.REACT_APP_EMAIL_ADDRESS}`}>
                {process.env.REACT_APP_EMAIL_ADDRESS}
              </Link>
            </span>
            <span className="c8">&nbsp;or by phone at</span>
            <span className="c2">&nbsp;+91-99997 56468</span>
            <span className="c4">.</span>
          </p>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};
