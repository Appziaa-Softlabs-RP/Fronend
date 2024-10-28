import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from './LoginPopup.module.css';
import ApiService from "../../services/ApiService";
import { AppNotification } from '../../utils/helper';
import { useApp } from '../../context/AppContextProvider';
import { useNavigate } from 'react-router-dom';
import { enviroment } from "../../enviroment";

const LoginPassword = ({ setLoginType, setLoginPop }) => {
    const [mobileVal, setMobileVal] = useState('');
    const [mobilePass, seMobilePass] = useState('');
    const appData = useApp();

    const userLogin = () => {
        const mobileNumberPattern = /^[0-9]{10}$/;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (mobileVal === '') {
            AppNotification('Error', 'Please enter mobile number or E-mail ID.', 'danger');
        } else if (mobileNumberPattern.test(mobileVal) === false && emailPattern.test(mobileVal) === false) {
            AppNotification('Error', 'Enter mobile number and email Address is not valid.', 'danger');
        } else if (mobilePass === '') {
            AppNotification('Error', 'Please enter your password', 'danger');
        } else if (mobileNumberPattern.test(mobileVal) === true || emailPattern.test(mobileVal) === true) {
            let registrationType = '';
            if (mobileNumberPattern.test(mobileVal) === true) {
                registrationType = 'mobile';
            } else if (emailPattern.test(mobileVal) === true) {
                registrationType = 'email';
            }
            const payload = {
                company_id: parseInt(enviroment.COMPANY_ID),
                type: registrationType,
                username: mobileVal,
                password: mobilePass
            }
            ApiService.signIn(payload).then((res) => {
                if (res.message === "Login successfully.") {
                    localStorage.setItem('user', JSON.stringify(res.payload));
                    appData.setAppData({ ...appData.appData, user: res.payload, loggedIn: true });
                    localStorage.setItem('loggedIn', true);
                    AppNotification('Welcome', 'You have been logged-In successfully.', 'success');
                    setLoginPop(false);
                    getAddCartList(res.payload);
                } else {
                    AppNotification('Error', 'Username or password is incorret.', 'danger');
                }
            }).catch((err) => {
                AppNotification('Error', 'Username or password is incorret.', 'danger');
            });
        }
    }

    const getAddCartList = (userData) => {
        let addedCart = appData.appData.cartData;
        if (addedCart?.length > 0) {
            const payload = {
                company_id: parseInt(enviroment.COMPANY_ID),
                store_id: parseInt(enviroment.STORE_ID),
                customer_id: userData.customer_id,
                cartJson: JSON.stringify(appData?.appData?.cartData)
            }
            ApiService.addMultipleCart(payload).then((res) => {
                if (res.message === "Add successfully.") {
                    appData.setAppData({ ...appData.appData, cartSaved: true, cartData: res.payload_cartList_items, cartCount: res.payload_cartList_items?.length, cartID: res.payload_cartList_id });
                    localStorage.setItem('cartID', res.payload_cartList_id);
                    localStorage.setItem('cartSaved', true);
                    localStorage.setItem('cartData', JSON.stringify(res.payload_cartList_items));
                    window.location.reload();
                } else {
                    AppNotification('Error', 'We are facing issue on shopping cart. Please try later.', 'error');
                }
            }).catch((err) => {
                AppNotification('Error', 'We are facing issue on shopping cart. Please try later.', 'error');
            });
        } else {
            const payload = {
                store_id: parseInt(enviroment.STORE_ID),
                customer_id: userData.customer_id
            }
            ApiService.showCart(payload).then((res) => {
                if (res.message === "Cart list successfully") {
                    let addProducts = res.payload_cartList;
                    appData.setAppData({ ...appData.appData, cartData: addProducts, cartCount: addProducts?.length, cartSaved: true, user: userData, loggedIn: true });
                    localStorage.setItem('cartData', JSON.stringify(addProducts));
                    localStorage.setItem('cartSaved', true);
                    window.location.reload();
                }
            }).catch((err) => {

            });
        }
    }

    return (
        <React.Fragment>
            <div className="d-inline-flex flex-column col-12">
                <h2 className={`${styles.loginTitle} col-12 d-inline-flex mb-3 mt-0`}>Login</h2>
                <p className={`${styles.loginDesc} col-12 d-inline-flex mb-3 mt-0`}>Enter Mobile No / Email ID to get an OTP for smooth login</p>
                <div className="d-inline-flex flex-column col-12 gap-4 mb-5">
                    <div className="col-12 d-inline-flex">
                        <input type="text" value={mobileVal} onChange={(e) => setMobileVal(e.target.value)} name="useremail" placeholder="Enter Mobile No / E-mail ID" className={`${styles.inputField} col-12 d-inline-flex px-3`} />
                    </div>
                    <div className="col-12 d-inline-flex">
                        <input type="password" value={mobilePass} onChange={(e) => seMobilePass(e.target.value)} name="userpassword" placeholder="Enter Password" className={`${styles.inputField} col-12 d-inline-flex px-3`} />
                    </div>
                </div>
                <div className="d-inline-flex justify-content-end col-12 gap-2 mb-5">
                    <span className={`${styles.loginUnfilledBtn} d-inline-flex align-items-center justify-content-center text-uppercase col-5`} role="button" onClick={() => setLoginType('LoginOTP')}>Login via OTP</span>
                    <span className={`${styles.loginFilledBtn} d-inline-flex align-items-center justify-content-center text-uppercase col-5`} role="button" onClick={() => userLogin()}>Login</span>
                </div>
                <div className="col-12 d-inline-flex flex-column mb-4">
                    <div className="col-12 text-center"><span className={`${styles.alreadyTxt}`}>New Customer?</span> <span className={`${styles.loginLink}`} onClick={() => setLoginType('Register')} role="button">Signup</span></div>
                    <div className={`${styles.privacyTxt} col-12 text-center`}>By continuing, you agree to our <Link to="/privacy-policy" target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none">Privacy Policy</Link> and <Link className="text-decoration-none" to="/terms" target="_blank" rel="noopener noreferrer"
                        >T&amp;C</Link></div>
                </div>
            </div>
        </React.Fragment>
    );
}

const LoginOTP = ({ setLoginType, mobileVal, setMobileVal, setOTPObj }) => {

    const sendMobileOtp = () => {
        const payload = {
            otp_type: 'mobile',
            username: mobileVal
        }
        ApiService.sendOTP(payload).then((res) => {
            if (res.message === 'Otp send successfully.') {
                AppNotification('Sucess', 'OTP sent to your mobile number.', 'success');
                setOTPObj({ otpID: res.payload.otp_id });
                setLoginType('VerifyOTP');
            }
        }).catch((err) => {

            AppNotification('Error', 'Unable to send OTP to your number', 'danger');
        })
    }

    return (
        <React.Fragment>
            <div className="d-inline-flex flex-column col-12">
                <h2 className={`${styles.loginTitle} col-12 d-inline-flex mb-4 mt-0`}>Login</h2>
                <p className={`${styles.loginDesc} col-12 d-inline-flex mb-3 mt-0`}>Enter Mobile No / Email ID to get an OTP for smooth login</p>
                <div className="d-inline-flex flex-column col-12 gap-4 mb-4">
                    <div className="col-12 d-inline-flex">
                        <input type="tel" value={mobileVal} minLength="10" maxLength="10" placeholder="9XXXXXXXXX" className={`${styles.inputField} col-12 d-inline-block px-3`} onChange={(e) => setMobileVal(e.target.value.replace(/\D/g, ""))} />
                    </div>
                </div>
                <div className="d-inline-flex justify-content-between col-12 mb-4">
                    <span className={`${styles.loginFilledBtn} d-inline-flex align-items-center justify-content-center text-uppercase col-12`} role="button" onClick={() => sendMobileOtp()}>Proceed</span>
                </div>
                <div className="col-12 d-inline-flex flex-column">
                    <div className="col-12 text-center"><span className={`${styles.alreadyTxt}`}>New Customer?</span> <span className={`${styles.loginLink}`} onClick={() => setLoginType('Register')} role="button">Signup</span></div>
                    <div className={`${styles.privacyTxt} col-12 text-center`}>By continuing, you agree to our <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer"
                        className="text-decoration-none">Privacy Policy</Link> and <Link to="/terms" target="_blank" rel="noopener noreferrer"
                            className="text-decoration-none">T&amp;C</Link></div>
                </div>
            </div>
        </React.Fragment>
    );
}

const LoginVerifyOTP = ({ setLoginType, mobileVal, mobileOTP, setMobileOTP, otpObj, setOTPObj, setLoginPop }) => {
    const appData = useApp();
    const navigate = useNavigate();

    const sendMobileOtp = () => {
        const payload = {
            otp_type: 'mobile',
            username: mobileVal
        }
        ApiService.sendOTP(payload).then((res) => {
            if (res.message === 'Otp send successfully.') {
                AppNotification('Sucess', 'OTP sent to your mobile number.', 'success');
                setOTPObj({ otp: res.payload.otp, otpID: res.payload.otp_id });
            }
        }).catch((err) => {

            AppNotification('Error', 'Unable to send OTP to your number', 'danger');
        })
    }

    const proceedVerify = () => {
        if (mobileOTP !== '') {
            let matchOTP = mobileOTP;
            matchOTP = parseInt(matchOTP);
            if (mobileOTP.length === 4) {
                const payload = {
                    otp_id: otpObj.otpID,
                    otp: matchOTP,
                    otp_type: "mobile",
                    company_id: parseInt(enviroment.COMPANY_ID)
                }
                ApiService.VerifyOTP(payload).then((res) => {
                    if (res.message === "Registration successfully.") {
                        localStorage.setItem('user', JSON.stringify(res.payload));
                        appData.setAppData({ ...appData.appData, user: res.payload, loggedIn: true });
                        localStorage.setItem('loggedIn', true);
                        AppNotification('Welcome', 'OTP verified successfully.', 'success');
                        setLoginPop(false);
                        getAddCartList(res.payload);
                    }
                }).catch((err) => {
                    AppNotification('Error', 'Entered OTP is incorrect.', 'danger');
                });
            } else {
                AppNotification('Error', 'Entered OTP is incorrect.', 'danger');
            }
        } else {
            AppNotification('Error', 'Please enter OTP', 'danger');
        }
    }

    const getAddCartList = (userData) => {
        let addedCart = appData.appData.cartData;
        if (addedCart?.length > 0) {
            const payload = {
                company_id: parseInt(enviroment.COMPANY_ID),
                store_id: parseInt(enviroment.STORE_ID),
                customer_id: userData.customer_id,
                cartJson: JSON.stringify(appData?.appData?.cartData)
            }
            ApiService.addMultipleCart(payload).then((res) => {
                if (res.message === "Add successfully.") {
                    appData.setAppData({ ...appData.appData, cartSaved: true, cartData: res.payload_cartList_items, cartCount: res.payload_cartList_items?.length, cartID: res.payload_cartList_id });
                    localStorage.setItem('cartID', res.payload_cartList_id);
                    localStorage.setItem('cartSaved', true);
                    localStorage.setItem('cartData', JSON.stringify(res.payload_cartList_items));
                    window.location.reload();
                } else {
                    AppNotification('Error', 'We are facing issue on shopping cart. Please try later.', 'error');
                }
            }).catch((err) => {
                AppNotification('Error', 'We are facing issue on shopping cart. Please try later.', 'error');
            });
        } else {
            const payload = {
                store_id: parseInt(enviroment.STORE_ID),
                customer_id: userData.customer_id
            }
            ApiService.showCart(payload).then((res) => {
                if (res.message === "Cart list successfully") {
                    let addProducts = res.payload_cartList;
                    appData.setAppData({ ...appData.appData, cartData: addProducts, cartCount: addProducts?.length, cartSaved: true, user: userData, loggedIn: true });
                    localStorage.setItem('cartData', JSON.stringify(addProducts));
                    localStorage.setItem('cartSaved', true);
                    window.location.reload();
                }
            }).catch((err) => {

            });
        }
    }

    return (
        <React.Fragment>
            <div className="d-inline-flex flex-column col-12">
                <h2 className={`${styles.loginTitle} col-12 d-inline-flex mb-4 mt-0`}>Login</h2>
                <p className={`${styles.loginDesc} col-12 d-inline-flex mb-3 mt-0`}>Enter Mobile No / Email ID to get an OTP for smooth login</p>
                <div className="d-inline-flex flex-column col-12 gap-4 mb-4">
                    <div className="col-12 d-inline-flex position-relative">
                        <input type="text" value={mobileVal} readOnly placeholder="Enter Mobile No / E-mail ID" className={`${styles.inputField} col-12 d-inline-flex px-3`} />
                        <span className={`${styles.changeNumber} top-0 bottom-0 d-inline-flex align-items-center end-0 px-3 position-absolute text-uppercase`} onClick={() => setLoginType('LoginOTP')} role="button">Change</span>
                    </div>
                    <div className="col-12 d-inline-flex position-relative">
                        <input type="tel" placeholder="Enter Mobile OTP" className={`${styles.inputField} col-12 d-inline-flex px-3`} minLength="4" maxLength="4" value={mobileOTP} onChange={(e) => setMobileOTP(e.target.value.replace(/\D/g, ""))} />
                        <span className={`${styles.resendOTp} top-0 bottom-0 d-inline-flex align-items-center end-0 px-3 position-absolute text-uppercase`} role="button" onClick={() => sendMobileOtp()}>Resend</span>
                    </div>
                </div>
                <div className="d-inline-flex justify-content-between col-12 mb-4">
                    <span className={`${styles.loginFilledBtn} d-inline-flex align-items-center justify-content-center text-uppercase col-12`} role="button" onClick={() => proceedVerify()}>Login</span>
                </div>
                <div className="col-12 d-inline-flex flex-column">
                    <div className="col-12 text-center"><span className={`${styles.alreadyTxt}`}>New Customer?</span> <span className={`${styles.loginLink}`} onClick={() => setLoginType('Register')} role="button">Signup</span></div>
                    <div className={`${styles.privacyTxt} col-12 text-center`}>By continuing, you agree to our <Link to="/privacy" target="_blank" rel="noopener noreferrer"
                        className="text-decoration-none">Privacy Policy</Link> and <Link to="/terms" target="_blank" rel="noopener noreferrer"
                            className="text-decoration-none">T&amp;C</Link></div>
                </div>
            </div>
        </React.Fragment>
    );
}

const Register = ({ setLoginType, mobileVal, setMobileVal, setOTPObj, setRegisterType }) => {
    const sendMobileOtp = () => {
        const mobileNumberPattern = /^[0-9]{10}$/;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (mobileVal === '') {
            AppNotification('Error', 'Please enter mobile number or E-mail ID.', 'danger');
        } else if (mobileNumberPattern.test(mobileVal) === false && emailPattern.test(mobileVal) === false) {
            AppNotification('Error', 'Enter mobile number and email Address is not valid.', 'danger');
        } else if (mobileNumberPattern.test(mobileVal) === true || emailPattern.test(mobileVal) === true) {
            let registrationType = '';
            if (mobileNumberPattern.test(mobileVal) === true) {
                registrationType = 'mobile';
            } else if (emailPattern.test(mobileVal) === true) {
                registrationType = 'email';
            }
            setRegisterType(registrationType);
            const payload = {
                otp_type: registrationType,
                username: mobileVal
            }
            ApiService.signupOTP(payload).then((res) => {
                if (res.message === 'Otp send successfully.') {
                    if (registrationType === 'mobile') {
                        AppNotification('Sucess', 'OTP sent to your mobile number.', 'success');
                    } else if (registrationType === 'mobile') {
                        AppNotification('Sucess', 'OTP sent to your Email Address.', 'success');
                    }
                    setOTPObj({ otpID: res.payload.otp_id });
                    setLoginType('RegVerifyOTP');
                } else if (res.message === "You are already registered. Please login.") {
                    AppNotification('Error', res.message, 'danger');
                }
            }).catch((err) => {
                AppNotification('Error', 'Unable to send OTP to your number', 'danger');
            });
        }
    }
    return (
        <React.Fragment>
            <div className="d-inline-flex flex-column col-12">
                <h2 className={`${styles.loginTitle} col-12 d-inline-flex mb-4 mt-0`}>Sign Up</h2>
                <p className={`${styles.loginDesc} col-12 d-inline-flex mb-3 mt-0`}>Enter Mobile No / Email ID to get an OTP for smooth login</p>
                <div className="d-inline-flex flex-column col-12 gap-4 mb-4">
                    <div className="col-12 d-inline-flex">
                        <input type="text" value={mobileVal} placeholder="Enter Mobile No / E-mail ID" className={`${styles.inputField} col-12 d-inline-block px-3`} onChange={(e) => setMobileVal(e.target.value)} />
                    </div>
                </div>
                <div className="d-inline-flex justify-content-between col-12 mb-4">
                    <span className={`${styles.loginFilledBtn} d-inline-flex align-items-center justify-content-center text-uppercase col-12`} role="button" onClick={() => sendMobileOtp()}>Register</span>
                </div>
                <div className="col-12 d-inline-flex flex-column">
                    <div className="col-12 text-center"><span className={`${styles.alreadyTxt}`}>Already have account?</span> <span className={`${styles.loginLink}`} onClick={() => setLoginType('Login')} role="button">Login</span></div>
                    <div className={`${styles.privacyTxt} col-12 text-center`}>By continuing, you agree to our <Link to="/privacy" target="_blank" rel="noopener noreferrer"
                        className="text-decoration-none">Privacy Policy</Link> and <Link to="/terms" target="_blank" rel="noopener noreferrer"
                            className="text-decoration-none">T&amp;C</Link></div>
                </div>
            </div>
        </React.Fragment>
    );
}

const RegisterVerifyOTP = ({ setLoginType, mobileVal, mobileOTP, setMobileOTP, otpObj, setOTPObj, setLoginPop, registerType }) => {
    const appData = useApp();
    const navigate = useNavigate();
    const [registrationVal, setRegistrationVal] = useState({ name: '', email: '', mobile: '', password: '' });
    const mobileNumberPattern = /^[0-9]{10}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const sendMobileOtp = () => {
        const payload = {
            otp_type: registerType,
            username: mobileVal
        }
        ApiService.signupOTP(payload).then((res) => {
            if (res.message === 'Otp send successfully.') {
                if (registerType === 'mobile') {
                    AppNotification('Sucess', 'OTP sent to your mobile number.', 'success');
                } else if (registerType === 'mobile') {
                    AppNotification('Sucess', 'OTP sent to your Email Address.', 'success');
                }
                setOTPObj({ otpID: res.payload.otp_id });
            }
        }).catch((err) => {

            AppNotification('Error', 'Unable to send OTP to your number', 'danger');
        })
    }

    const proceedVerify = () => {
        if (mobileOTP === '' || mobileOTP.length < 3) {
            AppNotification('Error', 'Please enter the OTP.', 'danger');
        } else if (registrationVal.mobile === '' || mobileNumberPattern.test(registrationVal.mobile) === false) {
            AppNotification('Error', 'Mobile number is not valid. Enter valid mobile number.', 'danger');
        } else if (registrationVal.email === '' || emailPattern.test(registrationVal.email) === false) {
            AppNotification('Error', 'Email address is not valid. Enter valid email address.', 'danger');
        } else if (registrationVal.name === '') {
            AppNotification('Error', 'Please enter your full name.', 'danger');
        } else if (registrationVal.password === '') {
            AppNotification('Error', 'Please enter your password.', 'danger');
        } else if (registrationVal.password.length < 7) {
            AppNotification('Error', 'Entered password characters is less than 8 characters.', 'danger');
        } else if (mobileOTP !== '') {
            let matchOTP = mobileOTP;
            matchOTP = parseInt(matchOTP);
            if (mobileOTP.length === 4) {
                const payload = {
                    otp_id: otpObj.otpID,
                    otp: matchOTP,
                    otp_type: registerType,
                    company_id: parseInt(enviroment.COMPANY_ID),
                    email: registrationVal.email,
                    password: registrationVal.password,
                    name: registrationVal.name,
                    phone: registrationVal.phone
                }
                ApiService.VerifyOTPReg(payload).then((res) => {
                    if (res.message === "Registration successfully.") {
                        localStorage.setItem('user', JSON.stringify(res.payload));
                        appData.setAppData({ ...appData.appData, user: res.payload, loggedIn: true });
                        localStorage.setItem('loggedIn', true);
                        AppNotification('Welcome', 'OTP verified successfully.', 'success');
                        setLoginPop(false);
                        getAddCartList(res.payload);
                    }
                }).catch((err) => {
                    AppNotification('Error', 'Entered OTP is incorrect.', 'danger');
                });
            } else {
                AppNotification('Error', 'Entered OTP is incorrect.', 'danger');
            }
        }
    }

    const getAddCartList = (userData) => {
        let addedCart = appData.appData.cartData;
        if (addedCart?.length > 0) {
            const payload = {
                company_id: parseInt(enviroment.COMPANY_ID),
                store_id: parseInt(enviroment.STORE_ID),
                customer_id: userData.customer_id,
                cartJson: JSON.stringify(appData?.appData?.cartData)
            }
            ApiService.addMultipleCart(payload).then((res) => {
                if (res.message === "Add successfully.") {
                    appData.setAppData({ ...appData.appData, cartSaved: true, cartData: res.payload_cartList_items, cartCount: res.payload_cartList_items?.length, cartID: res.payload_cartList_id });
                    localStorage.setItem('cartID', res.payload_cartList_id);
                    localStorage.setItem('cartSaved', true);
                    localStorage.setItem('cartData', JSON.stringify(res.payload_cartList_items));
                    window.location.reload();
                } else {
                    AppNotification('Error', 'We are facing issue on shopping cart. Please try later.', 'error');
                }
            }).catch((err) => {
                AppNotification('Error', 'We are facing issue on shopping cart. Please try later.', 'error');
            });
        } else {
            const payload = {
                store_id: parseInt(enviroment.STORE_ID),
                customer_id: userData.customer_id
            }
            ApiService.showCart(payload).then((res) => {
                if (res.message === "Cart list successfully") {
                    let addProducts = res.payload_cartList;
                    appData.setAppData({ ...appData.appData, cartData: addProducts, cartCount: addProducts?.length, cartSaved: true, user: userData, loggedIn: true });
                    localStorage.setItem('cartData', JSON.stringify(addProducts));
                    localStorage.setItem('cartSaved', true);
                    window.location.reload();
                }
            }).catch((err) => {

            });
        }
    }

    useEffect(() => {
        if (registerType === 'mobile') {
            setRegistrationVal((prev) => ({ ...prev, mobile: mobileVal }));
        } else if (registerType === 'email') {
            setRegistrationVal((prev) => ({ ...prev, email: mobileVal }));
        }
    }, [registerType]);

    return (
        <React.Fragment>
            <div className="d-inline-flex flex-column col-12">
                <h2 className={`${styles.loginTitle} col-12 d-inline-flex mb-4 mt-0`}>Register</h2>
                <p className={`${styles.loginDesc} col-12 d-inline-flex mb-3 mt-0`}>Enter Mobile No / Email ID to get an OTP for smooth registration</p>
                <div className="d-inline-flex flex-column col-12 gap-4 mb-4">
                    <div className="col-12 d-inline-flex position-relative">
                        <input type="text" value={mobileVal} readOnly placeholder="Enter Mobile No / E-mail ID" className={`${styles.inputField} col-12 d-inline-flex px-3`} />
                        <span className={`${styles.changeNumber} top-0 bottom-0 d-inline-flex align-items-center end-0 px-3 position-absolute text-uppercase`} onClick={() => setLoginType('Register')} role="button">Change</span>
                    </div>
                    <div className="col-12 d-inline-flex position-relative">
                        <input type="tel" placeholder="Enter Mobile OTP" className={`${styles.inputField} col-12 d-inline-flex px-3`} minLength="4" maxLength="4" value={mobileOTP} onChange={(e) => setMobileOTP(e.target.value.replace(/\D/g, ""))} />
                        <span className={`${styles.resendOTp} top-0 bottom-0 d-inline-flex align-items-center end-0 px-3 position-absolute text-uppercase`} role="button" onClick={() => sendMobileOtp()}>Resend</span>
                    </div>
                    {registerType !== 'mobile' ?
                        <div className="col-12 d-inline-flex position-relative">
                            <input type="tel" placeholder="Enter Mobile number" className={`${styles.inputField} col-12 d-inline-flex px-3`} value={registrationVal.mobile} onChange={(e) => setRegistrationVal((prev) => ({ ...prev, mobile: e.target.value.replace(/\D/g, "") }))} />
                        </div>
                        : registerType !== 'email' ?
                            <div className="col-12 d-inline-flex position-relative">
                                <input type="email" placeholder="Enter your email address" className={`${styles.inputField} col-12 d-inline-flex px-3`} value={registrationVal.email} onChange={(e) => setRegistrationVal((prev) => ({ ...prev, email: e.target.value }))} />
                            </div>
                            : ''}
                    <div className="col-12 d-inline-flex position-relative">
                        <input type="text" placeholder="Enter your name" className={`${styles.inputField} col-12 d-inline-flex px-3`} value={registrationVal.name} onChange={(e) => setRegistrationVal((prev) => ({ ...prev, name: e.target.value }))} />
                    </div>
                    <div className="col-12 d-inline-flex position-relative">
                        <input type="password" placeholder="Please create your password" className={`${styles.inputField} col-12 d-inline-flex px-3`} value={registrationVal.password} onChange={(e) => setRegistrationVal((prev) => ({ ...prev, password: e.target.value }))} />
                    </div>
                </div>
                <div className="d-inline-flex justify-content-between col-12 mb-4">
                    <span className={`${styles.loginFilledBtn} d-inline-flex align-items-center justify-content-center text-uppercase col-12`} role="button" onClick={() => proceedVerify()}>Register</span>
                </div>
                <div className="col-12 d-inline-flex flex-column">
                    <div className="col-12 text-center"><span className={`${styles.alreadyTxt}`}>Already have account?</span> <span className={`${styles.loginLink}`} onClick={() => setLoginType('Login')} role="button">Login</span></div>
                    <div className={`${styles.privacyTxt} col-12 text-center`}>By continuing, you agree to our <Link to="/privacy" target="_blank" rel="noopener noreferrer"
                        className="text-decoration-none">Privacy Policy</Link> and <Link to="/terms" target="_blank" rel="noopener noreferrer"
                            className="text-decoration-none">T&amp;C</Link></div>
                </div>
            </div>
        </React.Fragment>
    );
}

export const LoginPopup = ({ setLoginPop }) => {
    const [loginType, setLoginType] = useState('Login');
    const [mobileVal, setMobileVal] = useState('');
    const [mobileOTP, setMobileOTP] = useState('');
    const [registerType, setRegisterType] = useState('');
    const [otpObj, setOTPObj] = useState({});

    const hideLoginPop = () => {
        setLoginPop(false);
    }

    const stopParentLayer = (e) => {
        e.stopPropagation();
    }
    return (
        <React.Fragment>
            <div className={`${styles.loginLayerBox} position-fixed top-0 bottom-0 start-0 end-0 d-inline-flex align-items-center justify-content-center`}>
                <div className={`${styles.loginContainer} d-inline-flex align-items-stretch`}>
                    <div className="col-4 d-inline-flex flex-column align-items-center" onClick={(e) => stopParentLayer(e)}>
                        <div className={`${styles.loginGradientBox} col-12 d-inline-flex flex-column gap-4 px-4 flex-grow-1 justify-content-center`}>
                            <div className="col-12 d-inline-flex flex-column">
                                <h2 className="col-12 d-inline-flex mb-2 mt-0">Original Products</h2>
                                <p className="col-12 d-inline-flex m-0">Step into the world of {process.env.REACT_APP_BUSINESS_NAME}, your trusted toy haven, where every plaything is a genuine joy-bringer, crafted with authenticity and love.</p>
                            </div>
                            <div className="col-12 d-inline-flex flex-column">
                                <h2 className="col-12 d-inline-flex mb-2 mt-0">Easy Returns</h2>
                                <p className="col-12 d-inline-flex m-0">Shop with confidence and zero worries, as our 7-day free return policy ensures your satisfaction is our priority!</p>
                            </div>
                            <div className="col-12 d-inline-flex flex-column">
                                <h2 className="col-12 d-inline-flex mb-2 mt-0">Home Delivery</h2>
                                <p className="col-12 d-inline-flex m-0">Experience the joy of shopping from the comfort of your home, as we bring your desires to your doorstep with our swift and reliable home delivery!</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-8 p-4 position-relative">
                        <span className={`${styles.closeLogin} position-absolute d-inline-flex align-items-center justify-content-center`} role="button" onClick={() => hideLoginPop(false)}>&times;</span>
                        {loginType === 'Login' ?
                            <LoginPassword setLoginType={setLoginType} setLoginPop={setLoginPop} />
                            : loginType === 'LoginOTP' ?
                                <LoginOTP setLoginType={setLoginType} mobileVal={mobileVal} setMobileVal={setMobileVal} setOTPObj={setOTPObj} />
                                : loginType === 'Register' ?
                                    <Register setLoginType={setLoginType} mobileVal={mobileVal} setMobileVal={setMobileVal} setOTPObj={setOTPObj} setRegisterType={setRegisterType} />
                                    : loginType === 'VerifyOTP' ?
                                        <LoginVerifyOTP setLoginType={setLoginType} mobileVal={mobileVal} mobileOTP={mobileOTP} setMobileOTP={setMobileOTP} otpObj={otpObj} setOTPObj={setOTPObj} setLoginPop={setLoginPop} />
                                        : loginType === 'RegVerifyOTP' ?
                                            <RegisterVerifyOTP setLoginType={setLoginType} mobileVal={mobileVal} mobileOTP={mobileOTP} setMobileOTP={setMobileOTP} otpObj={otpObj} setOTPObj={setOTPObj} setLoginPop={setLoginPop} registerType={registerType} />
                                            : ''}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}