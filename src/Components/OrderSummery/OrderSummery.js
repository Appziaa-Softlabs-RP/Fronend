import React, { useEffect, useState } from "react";
import styles from "./OrderSummery.module.css";
import InfoTooltip from "../InfoTooltip/InfoTooltip";

export const OrderSummery = ({ cartPriceTotal, tokenAmount, paymentType, orderStatus, isDeliverChargeLoading, isInitalAddressFetched }) => {
    const [finalTotal, setFinalTotal] = useState(0);
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        setFinalTotal(cartPriceTotal.subTotal + cartPriceTotal.delivery + (cartPriceTotal.handling_fee ?? 0) - (cartPriceTotal.digital_discount ?? 0));
    }, [cartPriceTotal]);

    return (
        <React.Fragment>
            <div
                className={`${styles.orderSummryBox} col-12 d-inline-flex flex-column`}
            >
                <h2 className={`${styles.summeryTitle} col-12 d-inline-flex mb-1 p-3`}>
                    Order Summery
                </h2>
                <div className={`col-12 d-inline-flex flex-column p-3`}>
                    <div className={`col-12 position-relative d-inline-flex flex-column`}>
                        <label className={`${styles.couponLabel} d-inline-flex`}>
                            Have Coupon?
                        </label>
                        <div
                            className={`${styles.couponInputBox} overflow-hidden col-12 d-inline-flex align-items-stretch`}
                        >
                            <input
                                type="text"
                                className={`${styles.couponinput} d-inline-flex col-10 flex-shrink-1`}
                                value={discount || ""}
                                onChange={(e) => setDiscount(e.target.value)}
                                placeholder="Coupon code"
                            />
                            <span
                                className={`${styles.couponApplyBtn} flex-shrink-0 d-inline-flex align-items-center px-4`}
                            >
                                Apply
                            </span>
                        </div>
                    </div>
                </div>
                <div className={`col-12 d-inline-flex flex-column px-3 `}>
                    <div className="col-12 d-inline-flex flex-column gap-2">
                        <div className="col-12 d-inline-flex align-items-center justify-content-between">
                            <h6 className={`${styles.subTotalLabel} d-inline-flex`}>Price</h6>
                            <div className={`${styles.subTotalPrice} d-inline-flex`}>
                                ₹{(cartPriceTotal?.price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                        {cartPriceTotal.saving !== 0 && (
                            <div className="col-12 d-inline-flex align-items-center justify-content-between">
                                <h6 className={`${styles.subTotalLabel} d-inline-flex`}>
                                    Discount
                                </h6>
                                <div className={`${styles.subTotalSaving} d-inline-flex`}>
                                    <b>-₹{(cartPriceTotal?.saving || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>
                                </div>
                            </div>
                        )}
                        <div className="col-12 d-inline-flex align-items-center justify-content-between">
                            <h6 className={`${styles.subTotalLabel} d-inline-flex`}>
                                Subtotal
                            </h6>
                            <div className={`${styles.subTotalPrice} d-inline-flex`}>
                                ₹{(cartPriceTotal?.subTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                        {
                            (orderStatus == "Place Order" && cartPriceTotal.subTotal > 0) &&
                            <div className="col-12 d-inline-flex align-items-center justify-content-between">
                                <h6 className={`${styles.subTotalLabel} d-inline-flex`}>
                                    Delivery
                                </h6>
                                <div className={`${styles.subTotalSaving} d-inline-flex`}>
                                    {(!isInitalAddressFetched || isDeliverChargeLoading) ? (
                                        <span>Loading...</span>
                                    ) : (
                                        cartPriceTotal.delivery === 0 ? (
                                            <React.Fragment>
                                                <b>
                                                    <del>
                                                        ₹{(cartPriceTotal?.delivery || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</del>{" "}
                                                    Free
                                                </b>
                                            </React.Fragment>
                                        ) : (
                                            <span>₹{(cartPriceTotal?.delivery || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        ))}
                                </div>
                            </div>
                        }
                        {
                            cartPriceTotal?.handling_fee > 0 &&
                            <div className="col-12 d-inline-flex align-items-center justify-content-between"
                            >
                                <h6 className={`d-inline-flex m-0`} style={{
                                    fontSize: "14px",
                                }}>
                                    Cash Handling Fee
                                </h6>
                                <span className="d-flex text-danger" style={{
                                    fontSize: "14px",
                                    height: "fit-content",
                                }}>+₹{(cartPriceTotal?.handling_fee || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        }
                        {
                            cartPriceTotal?.digital_discount > 0 &&
                            <div className="col-12 d-inline-flex align-items-center justify-content-between"
                            >
                                <h6 className={`d-inline-flex m-0`} style={{
                                    fontSize: "14px",
                                }}>
                                    Digital Payment Discount
                                </h6>
                                <span className="d-flex text-success" style={{
                                    fontSize: "14px",
                                    height: "fit-content",
                                }}>-₹{(cartPriceTotal?.digital_discount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        }
                        {cartPriceTotal?.deliveryUpTo > 0 && cartPriceTotal.subTotal > 0 &&
                            parseInt(cartPriceTotal?.deliveryUpTo) - parseInt(finalTotal) >
                            0 && (
                                <p className={`${styles.deliveryCharges}`}>
                                    {/* delivery charges above cartPriceTotal?.delivery will be free */}
                                    <b>
                                        Add Item worth of{" "}
                                        <span
                                            style={{
                                                color: "green",
                                            }}
                                        >
                                            ₹
                                            {((parseInt(cartPriceTotal?.deliveryUpTo) -
                                                parseInt(cartPriceTotal.subTotal)) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>{" "}
                                        more to get free delivery
                                    </b>
                                </p>
                            )}
                    </div>
                    {cartPriceTotal.subTotal > 0 &&
                        paymentType === 'cash' ?
                        <ShowCartAmountForTokenAmount cartPriceTotal={cartPriceTotal} finalTotal={finalTotal} tokenAmount={tokenAmount} />
                        :
                        <ShowCartAmount cartPriceTotal={cartPriceTotal} finalTotal={finalTotal} />
                    }
                </div>
            </div>
        </React.Fragment >
    );
};


const ShowCartAmountForTokenAmount = ({ cartPriceTotal, finalTotal, tokenAmount }) => {
    return <div className="col-12 d-inline-flex flex-column">
        <div
            className={`col-12 d-inline-flex align-items-center justify-content-between py-3`}
        >
            <h6 className={`${styles.finalTotalLabel} d-inline-flex m-0`}>
                Billed Amount
            </h6>
            <div className={`${styles.subTotalPrice} d-inline-flex`}>
                ₹{(finalTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        </div>
        <div
            className={`${styles.finalTotalRow} col-12 d-inline-flex align-items-center justify-content-between py-3`}
        >
            <h6 className={`${styles.finalTotalLabel} d-inline-flex m-0 align-items-center`}>
                Token Amount
                <InfoTooltip text="This is an upfront amount that you're paying online." />
            </h6>
            <div className={`${styles.subTotalPrice} d-inline-flex`}>
                ₹{(tokenAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        </div>
        <div
            className={`${styles.finalTotalRow} col-12 d-inline-flex align-items-center justify-content-between py-3`}
        >
            <h6 className={`${styles.finalTotalLabel} d-inline-flex m-0`}>
                Amount to be Paid
                <InfoTooltip text="This amount is payable upon delivery." />
            </h6>
            <div className={`${styles.subTotalPrice} d-inline-flex`}>
                ₹{((finalTotal - tokenAmount) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        </div>
        <div className="col-12 d-inline-flex align-items-center justify-content-between mt-3">
            <h6 className={`${styles.finalSavingLabel} d-inline-flex m-0`}>
                Your Total Saving
            </h6>
            <div className={`${styles.subTotalSaving} d-inline-flex`}>
                ₹{(cartPriceTotal?.saving || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        </div>
    </div>
}

const ShowCartAmount = ({ cartPriceTotal, finalTotal }) => {
    return <div className="col-12 d-inline-flex flex-column">
        <div
            className={`${styles.finalTotalRow} col-12 d-inline-flex align-items-center justify-content-between py-3`}
        >
            <h6 className={`${styles.finalTotalLabel} d-inline-flex m-0`}>
                Total Amount Payable
            </h6>
            <div className={`${styles.subTotalPrice} d-inline-flex`}>
                ₹{(finalTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        </div>
        <div className="col-12 d-inline-flex align-items-center justify-content-between mt-3">
            <h6 className={`${styles.finalSavingLabel} d-inline-flex m-0`}>
                Your Total Saving
            </h6>
            <div className={`${styles.subTotalSaving} d-inline-flex`}>
                ₹{(cartPriceTotal?.saving || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        </div>
    </div>
}