import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import noImage from "../../assets/images/image-not-available.jpg";
import { enviroment } from "../../enviroment";
import styles from "./ProductCard.module.css";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const ProductCard = ({ item, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const swiperRef = useRef(null);

  const setNoImage = (e) => {
    if (e.target) {
      e.target.src = noImage;
    }
  };

  const mrp = parseFloat(item?.mrp);
  const selling_price = parseFloat(item?.selling_price);

  const handlePrev = (e) => {
    e.preventDefault();
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const getInitialSlide = () => {
    if (!isHovered) return 0;
    // If there's a second image (either gallery or main), show it on hover
    return (item?.gallery_images?.length > 0 || item?.image) ? 1 : 0;
  };

  const CardContent = () => (
    <>
      <div
        className={`${styles.featuredImageBox} position-relative`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {item.stock === 0 || item.stock < 0 ? (
          <span className={`${styles.soldOutText} position-absolute`}>
            Sold Out
          </span>
        ) : null}
        <Swiper
          ref={swiperRef}
          modules={[Pagination, Navigation, Autoplay]}
          pagination={{
            clickable: true,
            el: '.swiper-pagination'
          }}
          navigation={false}
          autoplay={isHovered ? { delay: 2000, disableOnInteraction: false } : false}
          loop={true}
          initialSlide={getInitialSlide()}
          allowTouchMove={true}
          className={styles.swiper}
        >
          {isHovered && (item?.gallery_images?.length > 1 || (item?.gallery_images?.length > 0 && item?.image)) && (
            <>
              <div className={`swiper-pagination ${styles.customPagination}`}></div>
            </>
          )}
          <SwiperSlide>
            <img
              onError={setNoImage}
              src={
                item?.image
                  ? item.image?.replace(
                    "https://rewardsplus.in/uploads/app/public/cogendermpany",
                    "https://merchant.rewardsplus.in/uploads/app/public/company"
                  )
                  : item?.image_url ?? noImage
              }
              alt={item.name}
              className={styles.productImg}
            />
          </SwiperSlide>
          {item?.gallery_images?.map((imageSrc, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={enviroment.API_IMAGE_GALLERY_URL + imageSrc}
                alt={`gallery`}
                className={styles.productImg}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.productInfo}>
        <h5 className={styles.offerItemName}>{item.name}</h5>
        <div className={styles.priceContainer}>
          {item?.is_deal === 1 && item.deals_price !== 0 ? (
            <>
              <span className={styles.offerPrice}>₹{Math.round(item.deals_price)}</span>
              <del className={styles.offerDiscountPrice}>₹{Math.round(mrp)}</del>
            </>
          ) : mrp > item.selling_price ? (
            <>
              <span className={styles.offerPrice}>₹{Math.round(item.selling_price)}</span>
              <del className={styles.offerDiscountPrice}>₹{Math.round(mrp)}</del>
            </>
          ) : (
            <span className={styles.offerPrice}>₹{Math.round(mrp)}</span>
          )}
        </div>
      </div>
      {parseFloat(mrp) > parseFloat(item.selling_price) && (
        <div className={`${styles.featureOffBox} position-absolute`}>
          {Math.ceil(((item?.mrp - selling_price) * 100) / item?.mrp)}% OFF
        </div>
      )}
    </>
  );

  return (
    <div className={`${styles.singleFeaturedProduct} flex-shrink-0 d-inline-block position-relative overflow-hidden col-12 h-100`} key={index}>
      {item?.product_id ? (
        <Link
          to={`/product/${item?.name_url}/${item.product_id}`}
          className={styles.productLink}
        >
          <CardContent />
        </Link>
      ) : (
        <CardContent />
      )}
    </div>
  );
};
