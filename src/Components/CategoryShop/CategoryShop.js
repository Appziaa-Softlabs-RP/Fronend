import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import React, { useEffect, useState } from "react";
import ReactOwlCarousel from "react-owl-carousel";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import styles from "./CategoryShop.module.css";

export const CategoryShop = () => {
  const [shopCategory, setShopCategory] = useState([]);
  const navigate = useNavigate();
  const appData = useApp();
  let windowWidth = appData.appData.windowWidth;
  const isMobile = windowWidth === "mobile";

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

  // Adjusting responsive settings for the carousel
  const responsiveSettings = {
    0: {
      items: 1.5, // Mobile devices
    },
    400: {
      items: 2.4, // Mobile devices
    },
    668: {
      items: 3, // Tablets
    },
    992: {
      items: 4, // Small laptops
    }
  };


  return (
    <React.Fragment>
      {shopCategory.length > 0 && (
        <div className={`col-12 py-5 ${styles.container}`}>
          <div className="col-12 d-inline-flex flex-column">
            <h2
              className={`${styles.categoryHeaderTitle} text-center pb-4`}
            >
              Shop By Category
            </h2>
            <ReactOwlCarousel
              className={`carousel-looking-for col-12 brandSilder owl-theme d-flex flex-column`}
              margin={10}
              loop={false}
              dots={true}
              responsive={responsiveSettings}
              style={{
                display: 'flex',
                justifyContent: 'center'
              }}
              nav={true}
            >
              {shopCategory.map((item, index) => (
                <div
                  key={index}
                  className={`d-inline-flex flex-column align-items-center ${styles.categoryBlock}`}
                  onClick={() => getCategoryProd(item?.name, item?.name_url)}
                  style={{
                    maxWidth: "200px",
                    transition: "transform 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <div
                    className={`${styles.imgBox} rounded-circle d-flex align-items-center justify-content-center overflow-hidden`}
                    style={{
                      // width: "100px",
                      // height: "100px",
                      border: "2px solid #ddd",
                      marginBottom: "10px",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item?.name}
                      className="object-fit-cover w-100 h-100"
                    />
                  </div>
                  <p className={`${styles.categoryProdName} text-center m-0`}>
                    {item?.name}
                  </p>
                </div>
              ))}
            </ReactOwlCarousel>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};