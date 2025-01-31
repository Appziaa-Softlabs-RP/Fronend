import React, { useEffect } from "react";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { useApp } from "../../context/AppContextProvider";

export const ShippingPolicy = () => {
    const appData = useApp();
    let windowWidth = appData.appData.windowWidth;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <React.Fragment>
            {windowWidth === "mobile" ? (
                <PageHeader title="Shipping Information Policy" hide={true} />
            ) : (
                <>
                    <Header />
                </>
            )}
            <h1 className="titleMainSmall fw-bold mt-5">Shipping Information Policy</h1>
            <div className="min-vh-100 col-12 d-inline-flex flex-column pt-2" style={{
                letterSpacing: "1px",
                fontSize: "14px",
            }}>
                <div className="container">
                    The Company shall exercise all possible measures to ensure that any Product booked on the Website is delivered within seven (7) working days from the date of booking of order on the Website subject to the successful realization of payment made against the said Order and availability of the product(s). However, the user understands and confirms that the Company shall not be held responsible for any delay in delivery of the product due to circumstances beyond the control of the Company, provided, the Company takes all required and necessary steps to ensure delivery of the product within the above-mentioned timelines.
                    <br />
                    <br />
                    Shipping costs are calculated during checkout based on the weight, dimensions, and destination of the items in the order. Payment for shipping will be collected with the purchase. This price will be the final price for shipping cost to the customer.
                    <br />
                    <br />
                    For a few select products, additional shipping charges may apply due to the nature, size, weight, specific shipping requirements or outside delivery area pin codes. In such cases, we will separately communicate if something additional need to be paid by you. We will refund your payment in case you choose to cancel your order due to additional charges applicable on your order.
                    <br />
                    <br />
                    In case the User books an order of multiple products in one transaction, the Company would endeavour to ship all Products together. However, this may not always be possible due to product characteristics and/or logistics issues. If the User purchases multiple products in a single transaction, then the products can be shipped to different addresses within the same pin code chosen individually by the user at the time of checkout.
                    <br />
                    <br />
                    The information about any pin code being serviced within India can be checked on the product page once the Pincode is entered. Your shipping address Pin code will be verified with our database before you add the product to the cart. In case it is not serviceable by our delivery partners, we would request you to provide us with an alternate shipping Pincode and check the availability.
                    <br />
                    <br />
                    For non serviceable areas, you may enquire separately with our customer service number 9654502991 through phone call or whatsapp message. If delivery is possible through an alternate courier service, we will respond with the extra shipping charges applicable for such locations
                    <br />
                    <br />
                    Product delivery will be done through reputed courier service providers.
                    <br />
                    <br />
                    <p className={`fw-bold`}>In Delhi NCR, we deliver items within 0 to 1 day.</p>
                    <p className={`fw-bold`}>Currently, we charge ₹2000 for delivery across India.</p>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    )
}