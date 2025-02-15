import React, { useEffect, useState } from "react";
import styles from "./CategoryShop.module.css";
import ApiService from "../../services/ApiService";
import { enviroment } from "../../enviroment";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContextProvider";
import noImage from "../../assets/images/image-not-available.jpg";
import ReactOwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

export default function CategoryShop() {
  const [shopCategory, setShopCategory] = useState([]);
  const navigate = useNavigate();
  const appData = useApp();

  let windowWidth = appData.appData.windowWidth;


  const setNoImage = (e) => {
    if (e.target) {
      e.target.src = noImage;
    }
  };

  const getCategoryProd = (name, name_url) => {
    navigate(`/store/${name_url}`);
  };

  useEffect(() => {
    const payload = {
      store_id: parseInt(enviroment.STORE_ID),
    };
    ApiService.StoreCategory(payload)
      .then((res) => {
        setShopCategory(res?.payload_verticalList?.vertical);
      })
      .catch((err) => { });
  }, []);

  return <div style={{
    marginTop: '3rem'
  }}>
    {shopCategory?.length > 0 &&
      <div className={`col-12  ${windowWidth === "desktop" && 'px-3'} d-inline-flex`}>
        <div className={`${windowWidth === "mobile" && 'p-0'} container`}>
          <div className={`col-12 ${windowWidth === 'mobile' ? 'px-3' : 'm-0'} d-inline-flex flex-column`}>
            <div className="titlesWrapper">
              <h4
                className={`subTitleLarge col-12`}
              >
                Shop By Category
              </h4>
            </div>
            <ReactOwlCarousel
              className="owl-theme"
              margin={5}
              dots={false}
              items={2.3}
              loop={false}
              nav={true}
              stagePadding={2}
            >
              {shopCategory
                ?.sort((a, b) => b.stock - a.stock)
                .map((item, index) => (
                    <div
                      key={index}
                      className={`${styles.categoryblock} d-inline-flex flex-column gap-2 w-100`}
                      onClick={() => getCategoryProd(item?.name, item?.name_url)}
                      style={{
                        zIndex: 100
                      }}
                    >
                      <div
                        className={`${styles.imgBox} d-inline-flex align-items-center justify-content-center overflow-hidden`}
                      >
                        <img
                          src={item.image}
                          onError={(e) => setNoImage(e)}
                          alt={item?.name}
                          className="object-fit-cover h-100 col-12 d-inline-block start-0 top-0"
                        />
                      </div>
                      <p
                        className={`${styles.categoryProdName} col-12 text-center m-0`}
                        style={{
                          fontSize: "12px"
                        }}
                      >
                        {item?.name}
                      </p>
                    </div>
                ))}
            </ReactOwlCarousel>
          </div>
        </div>
      </div>
    }
  </div>
};