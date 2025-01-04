import React, { useEffect, useState } from "react";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { useApp } from "../../context/AppContextProvider";

export const Faq = () => {
  const appData = useApp();
  const [visibleItem, setVisibleItem] = useState(null);

  let windowWidth = appData.appData.windowWidth;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      heading: "What is ByeByeMRPS?",
      answer:
        "ByeByeMRPS offers top-quality open-box electrical appliances at unbeatable prices. Discover a wide range of trusted brands with warranty and savings that fit your budget!",
    },
    {
      heading: "Are the items on ByeByeMRPS brand new?",
      answer:
        "Our products either have been directly procured from the OEM under excess inventory, transit damage, service return & end of life categories or simply unboxed items returned by the customers on leading eCommerce portals.<br /> <br />These items have never been owned by anyone, and are unused but may have their packaging boxes open with minor scratches or small dents. We have an extremely efficient procurement channel to source such items at large scale from OEMs and e-com portals. Each sourced item undergoes comprehensive quality checks to ensure that only perfectly functional and defect free products reach our end customers.",
    },
    {
      heading: "How much can I save by buying from ByeByeMRPS?",
      answer:
        "ByeByeMRPS offers unbeatable pricing with up to 80%* discounts on MRP depending on the product type.  We are more or less certain that our pricing remains the best across online or offline platforms pan India. To buy the products of your choice and check our amazing offers and discounts, click here: <a href='https://byebyemrps.com/' target='_blank'>https://byebyemrps.com/</a>.",
    },
    {
      heading: "Is ByeByeMRPS a recognized company?",
      answer:
        "Yes, ByeByeMRPS is a registered business entity having its head office in Delhi with nationwide distribution through company-owned outlets, franchises, business associates, and our online portal <a href='https://byebyemrps.com/' target='_blank'>https://byebyemrps.com/</a>. We use secure online e-commerce platform India's leading payment gateway Razorpay and deploy robust SSL security measures strictly following government regulations/compliances to keep our customers data privacy as the top most priority",
    },
    {
      heading: "How do I place an order?",
      answer:
        "<ul><li>Go to our website: <a href='https://byebyemrps.com/' target='_blank'>https://byebyemrps.com/</a></li><li>Use the search bar or browse through product categories to find the product of your choice</li><li>Click on the product you would like to purchase</li><li>If you like the product, click the '<strong>Add to Cart</strong>' button.</li><li>Once you are ready, click the '<strong>Proceed to Checkout</strong>' button.</li><li>You will be prompted to enter your email address and delivery address. Make sure all your information is accurate to avoid delays.</li><li>Provide additional phone number in the billing address if you have one</li><li>Select your preferred payment method from the available options</li><li>We offer secure payment gateways for credit cards, debit cards, net banking, and UPI</li><li>Review and Place Order: Review your order summary carefully, including product details, pricing, and delivery address</li><li>Once everything looks good, click the '<strong>Place Order</strong>' button.</li></ul>",
    },
    {
      heading: "Which payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, net banking and EMI options.",
    },
    {
      heading: "Is my payment information secure?",
      answer:
        "We use Razorpay <a href='https://byebyemrps.com/' target='_blank'>https://byebyemrps.com/</a> payment gateway for processing all the transactions. Razorpay is India's first full-stack financial solutions company compliant with leading industry standards such as ISO 27001, PCI DSS and SOC2.<br /><br />They are RBI Authorised Payment Aggregator, and fully ensures that your transactions are secure.",
    },
    {
      heading: "How long does it take to receive my order?",
      answer:
        "Each product is comprehensively quality tested once again before the dispatch. Unless we need to do extra round of QC for the product ordered by you, we try dispatching the product the very next day after your order is confirmed and payment is processed.<br /><br />Depending on your location and the size of the product, it generally takes 4 to 7 business working days for the product to be delivered to you after the dispatch. Very rarely some unforeseen delays may occur due to our complete dependence on our shipping/courier partners. We have robust internal processes to check and correct such delays but won't be responsible for extreme situations beyond our control.",
    },
    {
      heading: "How much does shipping cost?",
      answer:
        "Shipping costs are calculated during checkout based on the weight, dimensions, and destination of the items in the order. Payment for shipping (if any) will be added along with the product cost at the time of checkout.",
    },
    {
      heading: "How do I track my shipment?",
      answer:
        "You can easily track your package using the tracking ID and link sent on your email id after the product is dispatched. Delivering your order promptly remains our priority. If any unavoidable delays occur at our end, we will keep you fully informed.",
    },
    {
      heading: "What happens if my product isn't delivered?",
      answer:
        "If the product is returned undelivered due to unavailability of the customer or refusal to accept a properly packed and delivered product, both side courier charges will be payable by the customer.<br /><br />The net refund for the customer will be processed after accounting for the original charges paid by the company in sending and returning the product to its warehouse.",
    },
    {
      heading: "What all I need to do while accepting the delivery?",
      answer:
        "We take utmost care to ensure that your orders are processed and delivered safely and within the committed delivery timelines.<br /><br /><ul><li>We kindly request that you inspect the product and its accessories carefully upon delivery.</li><li>Pls make a complete unboxing video without any breaks in between.</li><li>If you discover any discrepancies, defects, or damages in the product or its accessories, please bring it to our attention immediately on the very same day within 24 hours after accepting the delivery.</li><li>You can contact us at +91 9654675803 or email us at byebyemrps@gmail.com to report any issues with your order within 24 hours after you accept the delivery.</li></ul>",
    },
    {
      heading:
        "Can I return the product or get a refund after receiving the product?",
      answer:
        "<ul><li>Once you have accepted the delivery of the product, we will not entertain any returns or refund requests unless the product is found to be broken or non-functional after complete unpacking.</li><li>In the event of a broken or non-functional product, you must provide a complete, unbroken unpacking video within 24 hours to establish the condition in which the product was received.</li><li>Claims for returns and refunds without appropriate delivery and unpacking videos will not be entertained. <strong>Please note that unpacking videos must be shared within 24 hours of delivery for any claims involving broken products. This is required for further claims to the transportation or courier company.</strong></li></ul>",
    },
    {
      heading: "What choices do I have if my claim is accepted?",
      answer:
        "What choices do I have if my claim is accepted?<br /><br /><ul><li>Replacement of the product</li><li>Repair of the product</li><li> Return of the product</li></ul>",
    },
    {
      heading: "How long does it take to get a refund?",
      answer:
        "Refunds for returned products or cancelled orders made before the initiation of delivery will be processed within 7 working days from the date of the refund request",
    },
    {
      heading: "Are all the products on your website in stock?",
      answer:
        "We strive for maintaining accurate stock levels at any point on time. But due to our offline presence across multiple locations, at times a particular product may be sold out in parallel while you order it online.<br /><br />In case of unavailability:<ul><li>We will propose the best alternatives available</li><li>We offer a full refund if an alternative isn't acceptable to you </li></ul>",
    },
    {
      heading: "Do you offer warranty on your products?",
      answer:
        "All large appliances available on our website get 100% coverage for one year warranty without an exception. A significant percentage of large appliances from leading Brands are covered under their respective brand warranty. Those not covered under the brand warranty or other large appliances from smaller/purely online brands are covered under ByeByeMRPS one-year comprehensive onsite service warranty.<br /><br />Small home appliances and other lifestyle products may be covered under their respective brand warranties which are generally off site in nature. We do not take any responsibility for these categories of products and nor we cover them under our own warranty.",
    },
    {
      heading: "How are you able to offer such heavy discounts?",
      answer:
        "Our entire product range is directly procured from the OEMs under excess inventory, transit damage, service return & end of life categories or simply unboxed items returned by the customers on leading eCommerce portals. These items have never been owned by anyone, and are unused but may have their packaging boxes opened and can have minor scratches or small dents. We have an extremely efficient procurement channel to source such items at a large scale in bulk from OEMs and e-com portals at a steep discount. This enables us to transparently pass on these discounts to the end customers like you. Each item sourced by us undergoes extensive quality checks to ensure – only defect free products are provided to the customers",
    },
    {
      heading: "How can I contact customer service?",
      answer:
        "You can reach us by phone - 9654675803 or email us at byebyemrps@gmail.com",
    },
    {
      heading: "What are your customer service hours?",
      answer:
        "Our customer service team is available Wednesday-Monday from 11:30 AM to 7:00 PM IST",
    },
  ];

  return (
    <React.Fragment>
      {windowWidth === "mobile" ? (
        <PageHeader title="Privacy" hide={true} />
      ) : (
        <Header />
      )}
      <div className="min-vh-100 col-12 d-inline-flex flex-column my-5">
        <div className="container">
          <h1>FAQ's</h1>

          <div className="accordion w-100" id="basicAccordion">
            {faqs?.map((faq, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header" id={`heading${index + 1}`}>
                  <button
                    data-mdb-collapse-init
                    className={`accordion-button ${
                      visibleItem === index ? "" : "collapsed"
                    }`}
                    style={{
                      backgroundColor:
                        visibleItem === index ? "#f0b562" : "#fff",
                    }}
                    type="button"
                    data-mdb-target={`#basicAccordionCollapse${index + 1}`}
                    aria-expanded={visibleItem === index}
                    aria-controls={`collapse${index + 1}`}
                    onClick={() => setVisibleItem(index)}
                  >
                    {faq?.heading}
                  </button>
                </h2>
                <div
                  id={`basicAccordionCollapse${index + 1}`}
                  className={`accordion-collapse ${
                    visibleItem === index ? "show" : "collapse"
                  }`}
                  aria-labelledby={`heading${index + 1}`}
                  data-mdb-parent="#basicAccordion"
                >
                  <div className="accordion-body">
                    <div
                      dangerouslySetInnerHTML={{ __html: faq?.answer }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};
