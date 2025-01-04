import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import styles from "./ShopAge.module.css";
import { ShopAgeLoader } from "../Loader/Loader";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";

export const ShopAge = () => {
  const [categAge, setCategAge] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const appData = useApp();
  let windowWidth = appData.appData.windowWidth;

  const openAgeProd = (ageSlug, banner, name) => {
    navigate(`/store/age/${ageSlug}`);
  };

  useEffect(() => {
    const payload = {
      store_id: parseInt(enviroment.STORE_ID),
    };
    ApiService.ageGroupBox(payload)
      .then((res) => {
        if (res.message === "Fetch successfully.") {
          setCategAge(res.payload_ageGroupList.age_group);
        }
      })
      .catch((err) => { })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const responsiveItems =
    window.innerWidth >= 1450
      ? 6
      : window.innerWidth >= 1400
        ? 5
        : window.innerWidth >= 992
          ? 4
          : window.innerWidth >= 768
            ? 3
            : 2.5;

  return (
    <React.Fragment>
      {
        loading ? (
          <ShopAgeLoader />
        ) : (
          categAge?.length > 0 && (
            <div className={`${styles.shopAgeBox} px-3 col-12 d-inline-flex mb-3`}>
              <div className={`${windowWidth === "mobile" && "p-0"} container`}>

                {/* Desktop Structure */}
                <h2
                  className={`${styles.categoryHeaderTitle} hideInMobile col-12 d-inline-flex justify-content-center mt-4 mb-3 fs-2 `}
                >
                  ✨ Shop By Age ✨
                </h2>

                {/* Mobile Structure */}
                <div className={`${styles.shopAgeContainer} col-12 pl-0 pr-0`}>

                  <h2
                    className={`${styles.exploreByCategoryHeader} hideInDesktop mb-2 ps-3 d-inline-block col-12 text-black fs-3 py-2`}
                  >
                    Shop By Age
                  </h2>

                  <div
                    className={`${styles.scrollAgeBox} col-12 d-inline-flex justify-content-center px-2 pb-0 `}
                  >
                    <Swiper
                      modules={[Navigation, Pagination, Scrollbar, A11y]}
                      spaceBetween={50}
                      slidesPerView={responsiveItems}
                      className="col-12 pe-5"
                      navigation
                      pagination={{ clickable: true }}
                      scrollbar={{ draggable: true }}
                      onSwiper={(swiper) => console.log(swiper)}
                    >

                      {categAge.map((item, index) => {
                        return (
                          <SwiperSlide>
                            <div
                              className={`${styles.ageBlock} my-3 d-inline-block p-0 flex-shrink-0 mouse-cursor`}
                              key={index}
                              style={{
                                minWidth:
                                  window.innerWidth <= 500 ? "120px" : "180px",
                              }}
                              onClick={() =>
                                openAgeProd(
                                  item?.name_url,
                                  item?.age_group_banner,
                                  item?.name
                                )
                              }
                            >
                              <div className="col-12 pl-1 pr-1 d-inline-flex flex-column justify-content-center align-items-center position-relative text-decoration-none">
                                <div
                                  className={`${styles.ageBlockIcon} overflow-hidden d-inline-block col-12 position-relative`}
                                >
                                  <img
                                    src={item?.image}
                                    alt={item?.name}
                                    style={{
                                      maxWidth:
                                        window.innerWidth <= 500 ? "120px" : "200px",
                                      maxHeight:
                                        window.innerWidth <= 500 ? "120px" : "200px",
                                      borderRadius: "100%",
                                    }}
                                    className="position-absolute col-12 h-100 d-inline-block p-0"
                                  />
                                </div>
                                <h6
                                  className={`${styles.shopAgeNumber} text-center col-12 p-0 mb-0 text-black fs-6 `}
                                >
                                  {item.name}
                                </h6>
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                </div>
              </div>
            </div>
          ))}
    </React.Fragment>
  );
};