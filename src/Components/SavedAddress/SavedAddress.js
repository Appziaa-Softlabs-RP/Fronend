import React from "react";
import styles from './SavedAddress.module.css';
import { useNavigate } from "react-router-dom";

export const SavedAddress = ({item}) => {
    const navigate = useNavigate();

    const editAddress = (id) => {
        navigate('/add-new-address', {state: {addressEdit: true, addressId: id}});
    }

    return (
        <React.Fragment>
            <div className={`${styles.addedAdres} col-12 p-3 rounded d-inline-flex flex-column`}>
                <div className={`col-10 d-inline-flex flex-column`}>
                    <h6 className={`${styles.addressName} col-12 d-inline-flex align-items-center flex-wrap gap-2 mb-1`}>{item.name}<span className={`${styles.addressTag} d-inline-flex align-items-center px-1`}>{item.address_type}</span></h6>
                    <label className={`${styles.addressdetail} col-12 d-inline-flex mb-0`}>{item?.contact}</label>
                    <label className={`${styles.addressdetail} col-12 d-inline-flex mb-0`}>{item.house_no} - {item.pincode}</label>
                </div>
                <div className="col-12 mt-3 d-inline-flex justify-content-end gap-3">
                    <span role="button" className={`${styles.deleteBtn} d-inline-flex align-items-center px-2`}>Delete</span>
                    <span role="button" onClick={() => editAddress(item.address_id)} className={`${styles.editBtn} d-inline-flex align-items-center px-2`}>Edit</span>
                </div>
            </div>
        </React.Fragment>
    )
}