import React, { useCallback, useEffect, useState } from "react";
import useRazorpay from "react-razorpay";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import { AppNotification } from "../../utils/helper";
import { AddAddressPopup } from "../AddAddressPopup/AddAddressPopup";
import { DeleteAddressPopup } from "../DeleteAddressPopup/DeleteAddressPopup";
import { EditAddressPopup } from "../EditAddressPopup/EditAddressPopup";
import { DeleteIcon, EditIcon, LocationIcon } from "../siteIcons";
import styles from "./DeliveryAddress.module.css";

const AddressDelivery = ({
    allAddress,
    setCheckoutType,
    checkoutType,
    setAddressId,
    setAddressSaved,
    setSelectAddrDetail,
}) => {
    const [selectAddress, setSelectAddress] = useState({});
    const [openAdressPop, setOpenAdressPop] = useState(false);
    const [openEditAdressPop, setOpenEditAdressPop] = useState(false);
    const [openDeleteAdressPop, setOpenDeleteAdressPop] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);
    const [deleteAddressId, setDeleteAddressId] = useState(null);
    const appData = useApp();
    let windowWidth = appData.appData.windowWidth;

    const chooseSelectAddr = () => {
        if (Object.keys(selectAddress).length === 0) {
            AppNotification("Error", "Please choose an address to proceed", "danger");
        } else {
            setCheckoutType("Payment");
        }
    };

    const seletThisAddress = (e, item, addrId) => {
        setSelectAddress(item);
        setSelectAddrDetail(item);
        setAddressId(addrId);
    };

    const addNewAddress = () => {
        setOpenAdressPop(true);
    };

    const editNewAddress = ({ addressId }) => {
        setOpenEditAdressPop(true);
        setEditAddressId(addressId)
    };

    const deleteAddress = ({ addressId }) => {
        setOpenDeleteAdressPop(true);
        setDeleteAddressId(addressId)
    };

    useEffect(() => {
        if (allAddress?.length > 0) {
            setSelectAddress(allAddress[0]);
            setSelectAddrDetail(allAddress[0]);
            setAddressId(allAddress[0].address_id);
        }
    }, [allAddress]);

    return (
        <div
            className={`${styles.deliveryBox} col-12 d-inline-flex flex-column mb-2`}
        >
            <div
                className={`${styles.cartTitle} col-12 d-inline-flex align-items-center justify-content-between`}
            >
                <h2
                    className={`${styles.myCartTitle} d-inline-flex align-items-center gap-2`}
                >
                    <LocationIcon color="#000" />
                    Select Delivery Address
                </h2>
                {checkoutType === "Payment" && (
                    <span
                        role="button"
                        className={`${styles.placeOrderBtn} d-inline-flex align-items-center px-3 text-uppercase`}
                        onClick={() => setCheckoutType("Address")}
                    >
                        Change
                    </span>
                )}
            </div>
            {checkoutType === "Address" && (
                <div className="col-12 d-inline-flex flex-column">
                    <div className="col-12 d-inline-flex justify-content-end p-3">
                        <span
                            onClick={() => addNewAddress()}
                            role="button"
                            className={`${styles.addAddressBtn} d-inline-flex align-items-center px-4`}
                        >
                            Add New Address
                        </span>
                    </div>
                    {allAddress?.length > 0 && (
                        <React.Fragment>
                            <div className="col-12 d-inline-flex flex-wrap p-3" style={{
                                maxHeight: '400px',
                                overflowY: 'auto'
                            }}>
                                {allAddress?.map((item, idx) => {
                                    return (
                                        <div
                                            className={`${windowWidth === "mobile" ? "col-12" : "col-6"
                                                } p-3`}
                                            key={idx}
                                        >
                                            <div
                                                className={`${styles.addedAdres} col-12 p-3 ps-5 rounded d-inline-flex flex-column position-relative`}
                                                role="button"
                                                style={{
                                                    height: "120px",
                                                }}
                                                onClick={(e) =>
                                                    seletThisAddress(e, item, item.address_id)
                                                }
                                            >
                                                <input
                                                    className={`${styles.deliveryRadio} position-absolute d-inline-block`}
                                                    id={`delivery${idx}`}
                                                    type="radio"
                                                    checked={selectAddress.address_id === item.address_id}
                                                    name="delivery"
                                                />
                                                <label
                                                    className={`col-10 d-inline-flex flex-column`}
                                                    htmlFor={`delivery${idx}`}
                                                    role="button"
                                                >
                                                    <h6
                                                        className={`${styles.addressName} col-12 d-inline-flex align-items-center flex-wrap gap-2 mb-1`}
                                                        style={{
                                                            whiteSpace: "nowrap",
                                                            textOverflow: "ellipsis",
                                                            maxWidth: "100%",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        {item.name}
                                                        <span
                                                            className={`${styles.addressTag} d-inline-flex align-items-center px-1`}
                                                        >
                                                            {item.address_type}
                                                        </span>
                                                    </h6>
                                                    <label
                                                        className={`${styles.addressdetail} col-12 d-inline-flex mb-0`}
                                                    >
                                                        {item.contact}
                                                    </label>
                                                    <label
                                                        className={`${styles.addressdetail} col-12 d-inline-flex mb-0 `}
                                                        style={{
                                                            position: "relative",
                                                            whiteSpace: "nowrap",
                                                            maxWidth: "100%",
                                                            width: "100%",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                    >
                                                        {item.house_no}, {item?.street}, {item?.city},{" "}
                                                        {item?.state} - {item.pincode}
                                                    </label>
                                                </label>
                                                <div className="position-absolute p-3 top-0 end-0 d-inline-flex justify-content-end gap-3">
                                                    <span
                                                        role="button"
                                                        onClick={
                                                            () => deleteAddress({ addressId: item.address_id })
                                                        }
                                                        className={`${styles.deleteBtn} d-inline-flex align-items-center px-2`}
                                                    >
                                                        <DeleteIcon />
                                                    </span>
                                                    <span
                                                        role="button"
                                                        onClick={() => editNewAddress({
                                                            addressId: item.address_id,
                                                        })}
                                                        // onClick={() => editAddress(item.address_id)}
                                                        className={`${styles.editBtn} d-inline-flex align-items-center px-2`}
                                                    >
                                                        <EditIcon color="#FF0000" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div
                                className={`${styles.placeOrderBtnBox} col-12 p-3 d-inline-flex align-items-center justify-content-end`}
                            >
                                <span
                                    role="button"
                                    className={`${styles.placeOrderBtn} d-inline-flex align-items-center px-3 text-uppercase`}
                                    onClick={() => chooseSelectAddr()}
                                >
                                    Proceed
                                </span>
                            </div>
                        </React.Fragment>
                    )}
                </div>
            )}
            {checkoutType === "Payment" && (
                <div
                    className={`col-12 d-inline-flex flex-column ${windowWidth === "mobile" ? "p-2" : "p-4"
                        }`}
                >
                    <div
                        className={`col-12 p-3 rounded d-inline-flex flex-column position-relative`}
                        role="button"
                    >
                        <label className={`col-10 d-inline-flex flex-column`} role="button">
                            <label
                                className={`${styles.addressdetail} col-12 d-inline-flex align-items-center flex-wrap mb-1`}
                            >
                                <span
                                    className={`${windowWidth === "mobile" ? "col-3" : "col-1"}`}
                                >
                                    Name:&nbsp;
                                </span>
                                <b>{selectAddress.name}</b>
                            </label>
                            <label
                                className={`${styles.addressdetail} col-12 d-inline-flex mb-1`}
                            >
                                <span
                                    className={`${windowWidth === "mobile" ? "col-3" : "col-1"}`}
                                >
                                    Mobile:&nbsp;
                                </span>
                                <b>{selectAddress.contact}</b>
                            </label>
                            <label
                                className={`${styles.addressdetail} col-12 d-inline-flex mb-1`}
                            >
                                <span
                                    className={`${windowWidth === "mobile" ? "col-3" : "col-1"}`}
                                >
                                    Address:&nbsp;
                                </span>
                                <b>
                                    {selectAddress.house_no}, {selectAddress?.street},{" "}
                                    {selectAddress?.city}, {selectAddress?.state} -{" "}
                                    {selectAddress.pincode}
                                </b>
                            </label>
                        </label>
                    </div>
                </div>
            )}
            {openAdressPop === true && (
                <AddAddressPopup
                    setOpenAdressPop={setOpenAdressPop}
                    setAddressSaved={setAddressSaved}
                />
            )}
            {(openEditAdressPop === true && editAddressId) && (
                <EditAddressPopup
                    addressId={editAddressId}
                    setOpenAdressPop={setOpenEditAdressPop}
                    setAddressSaved={setAddressSaved}
                />
            )}
            {(openDeleteAdressPop === true && deleteAddressId) && (
                <DeleteAddressPopup
                    addressId={deleteAddressId}
                    setAddressId={setDeleteAddressId}
                    setOpenAdressPop={setOpenDeleteAdressPop}
                    setAddressSaved={setAddressSaved}
                />
            )}
        </div>
    );
};

const PaymentMode = ({
    selectedOfferProductId,
    selectedOfferId,
    checkoutType,
    userInfo,
    addressId,
    shopcartID,
    cartPriceTotal,
    selectAddrDetail,
    paymentType,
    setPaymentType,
    paymentFeee,
    setCartPriceTotal,
    tokenAmount
}) => {
    // const [paymentType, setPaymentType] = useState(null);
    const navigate = useNavigate();
    const appData = useApp();

    const [Razorpay, isLoaded] = useRazorpay();

    const selectPaymentMode = (type) => {
        setPaymentType(type);
    };


    const handlePayment = useCallback(
        (orderId) => {

            const companyIdPayload = {
                company_id: parseInt(enviroment.COMPANY_ID),
            };

            ApiService.getRazorpayPublicKey(companyIdPayload).then(res => {
                if (res.payload != '' || res.payload != null) {
                    let finalAmount = cartPriceTotal.subTotal + cartPriceTotal.delivery;
                    const options = {
                        key: res.payload,// Fetching and adding razorpay key from server
                        amount: finalAmount,
                        currency: "INR",
                        name: enviroment.BUSINESS_NAME,
                        description: "Order Purchase",
                        image: `${process.env.REACT_APP_URL}/favicon.ico`,
                        order_id: orderId,
                        handler: (res) => {
                            onlinePaymentSuccess(
                                orderId,
                                res.razorpay_payment_id,
                                selectedOfferProductId,
                                selectedOfferId
                            );
                        },
                        prefill: {
                            name: selectAddrDetail?.name,
                            email: selectAddrDetail?.email,
                            contact: selectAddrDetail?.contact,
                        },
                        notes: {
                            address: enviroment.STORE_ADDRESS,
                        },
                        theme: {
                            color: enviroment.PRIMARY_COLOR,
                        },
                    };

                    const rzpay = new Razorpay(options);
                    rzpay.open();
                }
            }).catch(err => {
                AppNotification(
                    "Error",
                    "We are un-able to place your order. Please try later.",
                    "danger"
                );
            })
        },
        [Razorpay])

    const handleCashOnDelivery = (payload) => {
        if (parseFloat(tokenAmount) <= 0) {
            handleCashOnDelivery(payload);
        } else {
            payload['token_amount'] = tokenAmount;
            payload['paymentmode'] = 'mix';
            ApiService.onlinePaymentProcess(payload)
                .then((res) => {
                    if (res.message === "Online payment process successfully.") {
                        handleTokenAmountPayment(res.payload_onlinePaymentProcess.order_id, res.payload_onlinePaymentProcess.token_amount);
                    } else {
                        AppNotification(
                            "Error",
                            "We are un-able to place your order. Please try later.",
                            "danger"
                        );
                    }
                })
                .catch((err) => {
                    AppNotification(
                        "Error",
                        "Something went wrong. Please try again.",
                        "danger"
                    );
                });
        }
    }


    const handleTokenAmountPayment = useCallback(
        (orderId, tokenAmount) => {
            const companyIdPayload = {
                company_id: parseInt(enviroment.COMPANY_ID),
            };

            ApiService.getRazorpayPublicKey(companyIdPayload).then(res => {
                if (res.payload != '' || res.payload != null) {
                    const options = {
                        key: res.payload,
                        amount: tokenAmount,
                        currency: "INR",
                        name: enviroment.BUSINESS_NAME,
                        description: "Order Purchase",
                        image: `${process.env.REACT_APP_URL}/favicon.ico`,
                        order_id: orderId,
                        handler: (res) => {
                            onlinePaymentSuccess(
                                orderId,
                                res.razorpay_payment_id,
                                selectedOfferProductId,
                                selectedOfferId
                            );
                        },
                        modal: {
                            ondismiss: function () {
                                // Handle payment modal dismissal
                                AppNotification(
                                    "Info",
                                    "Payment cancelled by user",
                                    "info"
                                );
                            }
                        },
                        prefill: {
                            name: selectAddrDetail?.name,
                            email: selectAddrDetail?.email,
                            contact: selectAddrDetail?.contact,
                        },
                        notes: {
                            address: enviroment.STORE_ADDRESS,
                        },
                        theme: {
                            color: enviroment.PRIMARY_COLOR,
                        },
                    };

                    const rzpay = new Razorpay(options);
                    rzpay.open();
                }
            }).catch(err => {
                AppNotification(
                    "Error",
                    "We are un-able to place your order. Please try later.",
                    "danger"
                );
            })
        },
        [Razorpay]
    )

    const createOrderId = (payload) => {
        ApiService.onlinePaymentProcess(payload)
            .then((res) => {
                if (res.message === "Online payment process successfully.") {
                    handlePayment(res.payload_onlinePaymentProcess.order_id);
                } else {
                    AppNotification(
                        "Error",
                        "We are un-able to place your order. Please try later.",
                        "danger"
                    );
                }
            })
            .catch((err) => {
                AppNotification(
                    "Error",
                    "We are un-able to place your order. Please try later.",
                    "danger"
                );
            });
    };

    const onlinePaymentSuccess = (
        orderId,
        transID,
        selectedOfferProductId,
        selectedOfferId
    ) => {
        const payload = {
            company_id: parseInt(enviroment.COMPANY_ID),
            store_id: parseInt(enviroment.STORE_ID),
            customer_id: userInfo.customer_id,
            offer_id: selectedOfferProductId,
            offer_product_id: selectedOfferId,
            order_id: orderId,
            transection_id: transID,
            cart_id: shopcartID,
        };

        ApiService.onlinePaymentSuccess(payload)
            .then((res) => {
                if (res.message == "Online payment successfully.") {
                    AppNotification(
                        "Success",
                        "Your order has been placed successfully",
                        "success"
                    );
                    let emptyCartData = [];
                    appData.setAppData({
                        ...appData.appData,
                        cartData: emptyCartData,
                        cartCount: 0,
                    });
                    localStorage.setItem("cartData", JSON.stringify(emptyCartData));
                    navigate("/my-orders");
                } else {
                    AppNotification(
                        "Error",
                        "We are un-able to place your order. Please try later.",
                        "danger"
                    );
                }
            })
            .catch((err) => {
                AppNotification(
                    "Error",
                    "We are un-able to place your order. Please try later.",
                    "danger"
                );
            });
    };

    const proceedPayment = ({ selectedOfferProductId, selectedOfferId }) => {
        if (
            paymentType === "" ||
            paymentType === null ||
            paymentType === undefined
        ) {
            AppNotification("Error", "Please select payment type", "danger");
        } else {
            let finalAmount = cartPriceTotal.subTotal + cartPriceTotal.delivery + (cartPriceTotal.handling_fee ?? 0) - (cartPriceTotal.digital_discount ?? 0);
            const payload = {
                company_id: parseInt(enviroment.COMPANY_ID),
                offer_product_id: selectedOfferId ?? null,
                handling_fee: cartPriceTotal.handling_fee ?? 0,
                digital_discount: cartPriceTotal.digital_discount ?? 0,
                offer_id: selectedOfferProductId ?? null,
                store_id: parseInt(enviroment.STORE_ID),
                customer_id: userInfo.customer_id,
                address_id: addressId,
                total_paid_amount: finalAmount,
                total_saving: cartPriceTotal.saving,
                deliveryCharge: cartPriceTotal.delivery,
                paymentmode: paymentType,
                cart_id: shopcartID,
                slot_id: 1,
                couponValue: 0,
                couponcode: "",
                slot_date: new Date(),
            };
            if (paymentType === "cash") {
                handleCashOnDelivery(payload);
            } else {
                createOrderId(payload);
            }
        }
    };

    const resetPaymentFees = useCallback(() => {
        setCartPriceTotal((prevCartPriceTotal) => {
            return {
                ...prevCartPriceTotal,
                handling_fee: 0,
                digital_discount: 0,
            };
        });
    }, []);

    const getCodFees = useCallback(() => {
        return (parseFloat(paymentFeee.handling_fee) / 100) * parseFloat(cartPriceTotal.subTotal);
    }, [paymentFeee.handling_fee, cartPriceTotal.subTotal]);

    const addCodFees = useCallback(() => {
        resetPaymentFees();  // Ensure reset happens first
        setCartPriceTotal((prevCartPriceTotal) => {
            if (prevCartPriceTotal?.handling_fee > 0) return prevCartPriceTotal;  // Prevent adding fees again

            // Calculate the handling fee as a percentage of the subTotal
            const fees = getCodFees();

            // Return updated cart totals
            return {
                ...prevCartPriceTotal,
                handling_fee: fees,
                // subTotal: total,
            };
        });
    }, [paymentFeee.handling_fee, resetPaymentFees]);

    const addDigitalDiscount = useCallback(() => {
        resetPaymentFees();  // Ensure reset happens first
        setCartPriceTotal((prevCartPriceTotal) => {
            if (prevCartPriceTotal?.digital_discount > 0) return prevCartPriceTotal;  // Prevent adding discount again

            // Calculate the digital discount as a percentage of the subTotal
            const discount = (parseFloat(paymentFeee.digital_discount) / 100) * parseFloat(prevCartPriceTotal.subTotal);

            // Return updated cart totals
            return {
                ...prevCartPriceTotal,
                digital_discount: discount,
                // subTotal: total,
            };
        });
    }, [paymentFeee.digital_discount, resetPaymentFees]);

    const getPaymentAmount = useCallback(() => {
        if (paymentType === "online") {
            return cartPriceTotal.subTotal + cartPriceTotal.delivery + (cartPriceTotal.handling_fee ?? 0) - (cartPriceTotal.digital_discount ?? 0);
        } else {
            return tokenAmount
        }
    }, [cartPriceTotal, paymentType, tokenAmount]);

    return (
        <div className={`${styles.deliveryBox} col-12 d-inline-flex flex-column`}>
            <h2
                className={`${styles.cartTitle} col-12 p-3 d-inline-flex align-items-center gap-2 mb-0`}
            >
                ₹ Select Payment Mode
            </h2>
            {checkoutType === "Payment" && (
                <div className="col-12 d-inline-flex flex-column">
                    <div className="col-12 d-inline-flex flex-column gap-1 px-5 py-4">
                        <div className="col-12 d-inline-flex">
                            <label
                                className={`${styles.paymentRadio} d-inline-flex align-items-center gap-2 position-relative px-3`}
                                htmlFor="online"
                                role="button"
                                onClick={() => {
                                    selectPaymentMode("online")
                                    addDigitalDiscount()
                                }}
                            >
                                <input
                                    className={`${styles.deliveryRadio} position-absolute d-inline-block`}
                                    type="radio"
                                    id="online"
                                    name="paymentmode"
                                />
                                <p className="d-flex flex-column gap-2">
                                    <span className={`${styles.radioText} d-inline-flex`}>
                                        Online Payment Options
                                    </span>
                                    <p className="text-primary fst-italic" style={{
                                        border: "1px solid lightblue",
                                        borderRadius: "5px",
                                        padding: "0.2rem 0.5rem",
                                        fontSize: "0.8rem",
                                        width: "fit-content"
                                    }}>Pay online for a hassle-free, secure, and faster delivery! {getCodFees().toFixed(2) > 0 ? <span className="text-success">Also, you can save ₹{getCodFees().toFixed(2)} on your order.</span> : null}</p>
                                    {paymentFeee.digital_discount > 0 ? <span className="fw-bold text-success"
                                        style={{
                                            fontSize: "0.6rem",
                                            backgroundColor: "#D2FAC1",
                                            padding: "0.2rem 0.5rem",
                                            width: "fit-content"
                                        }}
                                    >Digital Payment Discount: ₹{((parseFloat(paymentFeee.digital_discount) / 100) * parseFloat(cartPriceTotal.prevTotal)).toFixed(2)}</span> : null}
                                </p>
                            </label>
                        </div>
                        <div className="col-12 d-inline-flex">
                            <label
                                className={`${styles.paymentRadio} d-inline-flex align-items-center gap-2 position-relative px-3`}
                                htmlFor="cash"
                                role="button"
                                onClick={() => {
                                    selectPaymentMode("cash")
                                    addCodFees()
                                }}
                            >
                                <input
                                    className={`${styles.deliveryRadio} position-absolute d-inline-block`}
                                    type="radio"
                                    id="cash"
                                    name="paymentmode"
                                />
                                <p className="d-flex flex-column gap-2">
                                    <span className={`${styles.radioText} d-inline-flex`}>
                                        Cash on delivery
                                    </span>
                                    <p className="text-primary fst-italic" style={{
                                        border: "1px solid lightblue",
                                        borderRadius: "5px",
                                        padding: "0.2rem 0.5rem",
                                        fontSize: "0.8rem",
                                        width: "fit-content"
                                    }}>A small commitment fee on COD helps us ensure genuine orders and faster deliveries!</p>
                                    {paymentFeee.digital_discount > 0 ? <span className="fw-bold text-danger"
                                        style={{
                                            fontSize: "0.6rem",
                                            backgroundColor: "#F8DADA",
                                            padding: "0.2rem 0.5rem",
                                            width: "fit-content"
                                        }}
                                    >Cash Handling Fees: ₹{getCodFees()}</span> : null}
                                </p>
                            </label>
                        </div>
                        <div
                            className={`${styles.payBtnBox} col-12 d-inline-flex p-3 justify-content-center align-items-center`}
                        >
                            <span
                                onClick={() =>
                                    proceedPayment({
                                        selectedOfferProductId,
                                        selectedOfferId
                                    })
                                }
                                role="button"
                                className={`${styles.payOrderBtn} d-inline-flex align-items-center px-3`}
                            >
                                {" "}
                                Proceed for Payment (₹{getPaymentAmount().toLocaleString("en-IN")})
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const DeliveryAddress = ({
    selectedOfferProductId,
    selectedOfferId,
    cartPriceTotal,
    setCartPriceTotal,
    shopcartID,
    setOrderStatus,
    tokenAmount,
    paymentType,
    setPaymentType
}) => {
    const appData = useApp();
    const [allAddress, setAllAddress] = useState([]);
    const [addressSaved, setAddressSaved] = useState(false);
    const [checkoutType, setCheckoutType] = useState("Address");
    const userInfo = appData.appData.user;
    const [addressId, setAddressId] = useState("");
    const [selectAddrDetail, setSelectAddrDetail] = useState({});
    const [paymentFees, setPaymentFees] = useState({
        digital_discount: 0,
        handling_fee: 0
    });

    const getAllAdress = () => {
        const payload = {
            store_id: parseInt(enviroment.STORE_ID),
            customer_id: userInfo?.customer_id,
        };
        ApiService.addressList(payload)
            .then((res) => {
                if (res.message === "Address list successfully") {
                    setAllAddress(res?.payload_addressList);
                    setAddressSaved(false);
                }
            })
            .catch((err) => { });
    };

    const changeProducts = () => {
        setOrderStatus("Cart");
    };

    useEffect(() => {
        getAllAdress();
    }, []);

    useEffect(() => {
        if (addressSaved === true) {
            getAllAdress();
        }
    }, [addressSaved]);

    const fetchPaymentFees = useCallback(async () => {
        const payload = {
            company_id: parseInt(enviroment.COMPANY_ID),
        };

        try {
            const res = await ApiService.getPaymentFees(payload);
            setPaymentFees({
                digital_discount: res?.digital_discount ?? 0,
                handling_fee: res?.handling_fee ?? 0,
            });
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchPaymentFees();
    }, [fetchPaymentFees]);

    if (!paymentFees) {
        return <p>Loading...</p>
    }

    return (
        <React.Fragment>
            <div
                className={`${styles.cartSummryBox} col-12 d-inline-flex align-items-center justify-content-between mb-2`}
            >
                <h1 className={`${styles.myCartTitle} d-inline-flex`}>
                    My Cart ({appData?.appData?.cartCount})
                </h1>
                <span
                    role="button"
                    className={`${styles.placeOrderBtn} d-inline-flex align-items-center px-3 text-uppercase`}
                    onClick={() => changeProducts()}
                >
                    Change
                </span>
            </div>

            <AddressDelivery
                allAddress={allAddress}
                setCheckoutType={setCheckoutType}
                checkoutType={checkoutType}
                setAddressId={setAddressId}
                setAddressSaved={setAddressSaved}
                setSelectAddrDetail={setSelectAddrDetail}
            />
            <PaymentMode
                paymentType={paymentType}
                setPaymentType={setPaymentType}
                selectedOfferProductId={selectedOfferProductId}
                selectedOfferId={selectedOfferId}
                checkoutType={checkoutType}
                userInfo={userInfo}
                addressId={addressId}
                shopcartID={shopcartID}
                cartPriceTotal={cartPriceTotal}
                selectAddrDetail={selectAddrDetail}
                setCartPriceTotal={setCartPriceTotal}
                paymentFeee={paymentFees}
                tokenAmount={tokenAmount}
            />
        </React.Fragment>
    );
}; 