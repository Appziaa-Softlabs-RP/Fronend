import React, { useState } from "react";
import { AddAddressForm } from "../AddAddressForm/AddAddressForm";
import styles from "./AddAddressPopup.module.css";

export const EditAddressPopup = ({
    addressId,
    setOpenAdressPop,
    setAddressSaved,
}) => {
    const [stopNavigate, setStopNavigate] = useState(true);

    return (
        <React.Fragment>
            <div
                className={`${styles.addresssLayerBox} position-fixed top-0 bottom-0 start-0 end-0 d-inline-flex align-items-center justify-content-center`}
            >
                <div
                    className={`${styles.addressContainer} d-flex flex-column m-auto position-relative px-2`}
                >
                    <span
                        className={`${styles.closeLogin} position-absolute d-inline-flex align-items-center justify-content-center`}
                        role="button"
                        onClick={() => setOpenAdressPop(false)}
                    >
                        &times;
                    </span>
                    <AddAddressForm
                        addressId={addressId}
                        isEdit={true}
                        stopNavigate={stopNavigate}
                        setOpenAdressPop={setOpenAdressPop}
                        setAddressSaved={setAddressSaved}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};