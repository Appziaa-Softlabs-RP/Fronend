import React, { useState } from "react";
import { AddAddressForm } from "../AddAddressForm/AddAddressForm";
import styles from "./AddAddressPopup.module.css";
import ApiService from "../../services/ApiService";
import { AppNotification } from "../../utils/helper";
import { enviroment } from "../../enviroment";
import { useApp } from "../../context/AppContextProvider";

export const DeleteAddressPopup = ({
    addressId,
    setOpenAdressPop,
    setAddressSaved,
}) => {
    const appData = useApp();
    const userInfo = appData?.appData?.user;


    const removeNewAddress = () => {
        if (addressId) {
            const payload = {
                address_id: addressId,
                store_id: parseInt(enviroment.STORE_ID),
                customer_id: userInfo?.customer_id,
            }
            ApiService.removeAddress(payload)
                .then((res) => {
                    if (res.message === "Remove successfully") {
                        AppNotification(
                            "Address Removed",
                            "Your address has been removed successfully",
                            "success"
                        )
                        // relod page
                        setAddressSaved(true);
                    } else {
                        AppNotification(
                            "Error",
                            "We got an error while removing your address.",
                            "danger"
                        );
                    }
                })
                .catch((err) => {
                    AppNotification(
                        "Error",
                        "We got an error while removing your address.",
                        "danger"
                    );
                });
        }
    };


    return (
        <React.Fragment>
            <div
                className={`${styles.addresssLayerBox} position-fixed top-0 bottom-0 start-0 end-0 d-inline-flex align-items-center justify-content-center`}
            >
                <div
                    className={`${styles.addressContainer} d-flex flex-column m-auto position-relative px-2 bg-white h-25 rounded`}
                >
                    <span
                        className={`${styles.closeLogin} position-absolute d-inline-flex align-items-center justify-content-center`}
                        role="button"
                        onClick={() => setOpenAdressPop(false)}
                    >
                        &times;
                    </span>
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                        }}
                    >
                        <div className="text-center">
                            <h3>Are you sure you wish to remove this address?</h3>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "end",
                                    width: "100%",
                                    marginTop: "50px",
                                }}
                            >
                                <button
                                    className="btn"
                                    style={{
                                        margin: "5px",
                                        border: "1px solid",
                                    }}
                                    onClick={() => {
                                        setOpenAdressPop(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn"
                                    style={{
                                        margin: "5px",
                                        backgroundColor: "#FF0000",
                                        borderRadius: "5px",
                                        color: "#fff",
                                        padding: "5px 20px",
                                    }}
                                    onClick={() => {
                                        removeNewAddress();
                                        setOpenAdressPop(false);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};