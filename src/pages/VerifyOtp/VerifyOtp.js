import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BackArrowIcon } from "../../Components/siteIcons";
import OtpImg from "../../assets/images/mobile-otp.png";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import { AppNotification } from "../../utils/helper";
import styles from "./VerifyOtp.module.css";

let mobileOTPId = "",
  mobileNum = "";

export const VerifyOtp = () => {
  const [optInput, setOptInput] = useState({
    otpInput1: "",
    otpInput2: "",
    otpInput3: "",
    otpInput4: "",
  });
  const [mobileLast, setMobileLast] = useState("");
  const appData = useApp();

const [btnDisable, setBtnDisable] = useState(true);

  const optInput1 = useRef();
  const optInput2 = useRef();
  const optInput3 = useRef();
  const optInput4 = useRef();
  const locationState = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = enviroment.BUSINESS_NAME + " - User Verify";
    if (locationState?.state?.optID) {
      mobileOTPId = locationState.state.optID;
      mobileNum = locationState.state.mobile;
      mobileNum = mobileNum?.substr(mobileNum.length - 5);
      setMobileLast(mobileNum);
    } else {
      navigate("/");
    }
  }, [locationState]);

  const resendOTP = () => {
    const payload = {
      otp_type: "mobile",
      username: locationState.state.mobile,
    };
    ApiService.sendOTP(payload)
      .then((res) => {
        if (res.message === "Otp send successfully.") {
          AppNotification(
            "Sucess",
            "OTP sent to your mobile number.",
            "success"
          );
          mobileOTPId = res.payload.otp_id;
        }
      })
      .catch((err) => {
        AppNotification("Error", "Unable to send OTP to your number", "danger");
      });
  };

  const changeOptInput1 = (e) => {
    setOptInput({ ...optInput, otpInput1: e.target.value });
  };

  const changeOptInput2 = (e) => {
    setOptInput({ ...optInput, otpInput2: e.target.value });
  };

  const changeOptInput3 = (e) => {
    setOptInput({ ...optInput, otpInput3: e.target.value });
  };

  const changeOptInput4 = (e) => {
    setOptInput({ ...optInput, otpInput4: e.target.value });
  };

  const proceedVerify = () => {
    if (
      optInput.otpInput1 !== "" &&
      optInput.otpInput2 !== "" &&
      optInput.otpInput3 !== "" &&
      optInput.otpInput4 !== ""
    ) {
      let matchOTP =
        optInput.otpInput1 +
        optInput.otpInput2 +
        optInput.otpInput3 +
        optInput.otpInput4;
      matchOTP = parseInt(matchOTP);
      const payload = {
        otp_id: mobileOTPId,
        otp: matchOTP,
        otp_type: "mobile",
        company_id: parseInt(enviroment.COMPANY_ID),
      };
      ApiService.VerifyOTP(payload)
        .then((res) => {
          if (res.message === "Registration successfully.") {
            localStorage.setItem("user", JSON.stringify(res.payload));
            appData.setAppData({
              ...appData.appData,
              user: res.payload,
              loggedIn: true,
            });
            localStorage.setItem("loggedIn", true);
            AppNotification("Welcome", "OTP verified successfully.", "success");
            getAddCartList(res.payload);
            navigate("/");
          }
        })
        .catch((err) => {
          AppNotification("Error", "Entered OTP is incorrect.", "danger");
        });
    } else {
      AppNotification("Error", "Please enter OTP", "danger");
    }
  };

  const getAddCartList = (userData) => {
    let addedCart = appData.appData.cartData;
    if (addedCart?.length > 0) {
      const payload = {
        company_id: parseInt(enviroment.COMPANY_ID),
        store_id: parseInt(enviroment.STORE_ID),
        customer_id: userData.customer_id,
        cartJson: JSON.stringify(appData?.appData?.cartData),
      };
      ApiService.addMultipleCart(payload)
        .then((res) => {
          if (res.message === "Add successfully.") {
            appData.setAppData({
              ...appData.appData,
              cartSaved: true,
              cartData: res.payload_cartList_items,
              cartCount: res.payload_cartList_items?.length,
            });
            localStorage.setItem("cartSaved", true);
            localStorage.setItem(
              "cartData",
              JSON.stringify(res.payload_cartList_items)
            );
          } else {
            AppNotification(
              "Error",
              "We are facing issue on shopping cart. Please try later.",
              "danger"
            );
          }
        })
        .catch((err) => {
          AppNotification(
            "Error",
            "We are facing issue on shopping cart. Please try later.",
            "danger"
          );
        });
    } else {
      const payload = {
        store_id: parseInt(enviroment.STORE_ID),
        customer_id: userData.customer_id,
      };
      ApiService.showCart(payload)
        .then((res) => {
          if (res.message === "Cart list successfully") {
            let addProducts = res.payload_cartList;
            appData.setAppData({
              ...appData.appData,
              cartData: addProducts,
              cartCount: addProducts?.length,
              cartSaved: true,
              user: userData,
              loggedIn: true,
            });
            localStorage.setItem("cartData", JSON.stringify(addProducts));
            localStorage.setItem("cartSaved", true);
            window.location.reload();
          }
        })
        .catch((err) => {});
    }
  };

 

  useEffect(() => {
    if (optInput.otpInput1 !== "") {
      optInput2.current.focus();
    }
  }, [optInput.otpInput1]);

  useEffect(() => {
    if (optInput.otpInput2 !== "") {
      optInput3.current.focus();
    } else if (optInput.otpInput2 === "") {
      optInput1.current.focus();
    }
  }, [optInput.otpInput2]);

  useEffect(() => {
    if (optInput.otpInput3 !== "") {
      optInput4.current.focus();
    } else if (optInput.otpInput3 === "") {
      optInput2.current.focus();
    }
  }, [optInput.otpInput3]);

  useEffect(() => {
    if (optInput.otpInput4 === "") {
      optInput1.current.focus();
    }
  }, [optInput.otpInput4]);

  useEffect(() => {
    if (
      optInput.otpInput1 !== "" &&
      optInput.otpInput2 !== "" &&
      optInput.otpInput3 !== "" &&
      optInput.otpInput4 !== ""
    ) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  }, [optInput]);

  return (
    <React.Fragment>
      <div className={`d-inline-flex flex-column col-12 align-items-start p-3`}>
        <div
          className={`${styles.optHeader} col-12 p-3 d-inline-flex flex-column align-items-start gap-4`}
        >
          <span
            className="d-inline-flex flex-shrink-0"
            onClick={() => navigate(-1)}
          >
            <BackArrowIcon color="#000" />
          </span>
          <img src={OtpImg} alt="img" className={`${styles.OtpImgIcon} `} />
          <div className="col-12 d-inline-flex align-items-center">
            <span className={`${styles.verifyTxt} d-inline-flex m-1`}>Verify</span>
            <span className={`${styles.otpTxt} d-inline-flex my-1`}>OTP</span>
          </div>
          <div className="col-12 p-0 d-inline-flex align-items-center justify-content-between">
            <input
              type="tel"
              className={`${styles.otpInput} d-inline-block`}
              maxLength="1"
              minLength="1"
              ref={optInput1}
              value={optInput.otpInput1}
              onChange={(e) => changeOptInput1(e)}
            />

            <input
              type="tel"
              className={`${styles.otpInput} d-inline-block`}
              maxLength="1"
              minLength="1"
              ref={optInput2}
              value={optInput.otpInput2}
              onChange={(e) => changeOptInput2(e)}
            />

            <input
              type="tel"
              className={`${styles.otpInput} d-inline-block`}
              maxLength="1"
              minLength="1"
              ref={optInput3}
              value={optInput.otpInput3}
              onChange={(e) => changeOptInput3(e)}
            />

            <input
              type="tel"
              className={`${styles.otpInput} d-inline-block`}
              maxLength="1"
              minLength="1"
              ref={optInput4}
              value={optInput.otpInput4}
              onChange={(e) => changeOptInput4(e)}
            />
          </div>
          <div className="col-12 p-0 d-inline-block">
            {mobileLast !== "" && (
              <span className={`${styles.otpInfo}`}>
                Please enter 4 Digit Verification Code sent to{" "}
                <span>+91- XXXXX {mobileLast}</span>
              </span>
            )}
          </div>
          <div className="col-12 p-0 d-inline-block">
            <span className={`${styles.resendInfo}`}>
              Didn't recieve the OTP?
            </span>
            &nbsp;
            <span onClick={() => resendOTP()} className={`${styles.resendOtp}`}>
              Resend Code
            </span>
          </div>
          <div className="col-12 p-0 d-inline-block">
            <button
              disabled={btnDisable}
              className={`${styles.verifyBtn}  d-inline-flex align-items-center justify-content-center col-12`}
              style={{
                opacity: btnDisable ? "0.5" : "1",
              }}
              onClick={() => proceedVerify()}
            >
              Verify &amp; Proceed
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
