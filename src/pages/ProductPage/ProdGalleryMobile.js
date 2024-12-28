import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ThreeDots } from 'react-loader-spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { enviroment } from '../../enviroment';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProdGalleryMobile({
    ProductData,
    productLoading,
    styles,
    setNoImage,
    prodDiscount
}) {
    const [fullScreenMode, setFullScreenMode] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const swiperRef = useRef(null);

    const allImages = [
        ProductData?.image,
        ...(ProductData?.gallery_images?.map(item => enviroment.API_IMAGE_GALLERY_URL + item) || [])
    ].filter(Boolean);

    const openFullScreen = (index) => {
        setCurrentImageIndex(index);
        setFullScreenMode(true);
    };

    const closeFullScreen = () => {
        setFullScreenMode(false);
    };

    const navigateImage = (direction) => {
        let newIndex = currentImageIndex + direction;
        if (newIndex < 0) newIndex = allImages.length - 1;
        if (newIndex >= allImages.length) newIndex = 0;
        setCurrentImageIndex(newIndex);
    };

    const renderFullScreenGallery = () => {
        return createPortal(
            <div className={styles.fullScreenGallery}>
                <div className={styles.fullScreenHeader}>
                    <button onClick={closeFullScreen} className={styles.backButton}>
                        ← Back
                    </button>
                    <span>{currentImageIndex + 1} / {allImages.length}</span>
                </div>
                <div className={styles.fullScreenImageContainer}>
                    <img
                        src={allImages[currentImageIndex]}
                        alt={`Product image ${currentImageIndex + 1}`}
                        className={styles.fullScreenImage}
                    />
                    <button onClick={() => navigateImage(-1)} className={`${styles.navButton} ${styles.prevButton}`}>
                        ‹
                    </button>
                    <button onClick={() => navigateImage(1)} className={`${styles.navButton} ${styles.nextButton}`}>
                        ›
                    </button>
                </div>
                <div className={styles.thumbnailContainer}>
                    {allImages.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className={`${styles.thumbnail} ${index === currentImageIndex ? styles.activeThumbnail : ''}`}
                            onClick={() => setCurrentImageIndex(index)}
                        />
                    ))}
                </div>
            </div>,
            document.body
        );
    };

    const ProdDiscount = ({ prodDiscount = 0 }) => {
        if (!prodDiscount && prodDiscount == '') return null;

        return <>
            <span
                className={`${styles.discountBoxOff} fs-5 position-absolute d-inline-flex align-items-center`}
            >
                <span>{prodDiscount}%</span>
                <span>OFF</span>
            </span>
        </>
    }

    return (
        <div className={`col-12 bg-white d-inline-block position-relative ${styles.productGallery}`}>
            {ProductData?.stock <= 0 && (
                <div className={styles.soldOutBox}>
                    <span className={styles.soldOutText}>Sold Out</span>
                </div>
            )}
            <ProdDiscount
                prodDiscount={prodDiscount}
            />
            <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
                className={styles.swiper}
            >
                {allImages.map((img, index) => (
                    <SwiperSlide key={index} onClick={() => openFullScreen(index)}>
                        {!productLoading ? (
                            <img
                                src={img}
                                alt={`${ProductData?.name} - Image ${index + 1}`}
                                onError={(e) => setNoImage(e)}
                                className={styles.productImage}
                            />
                        ) : (
                            <div className={styles.loaderContainer}>
                                <ThreeDots
                                    visible={true}
                                    height="80"
                                    width="80"
                                    color="#000"
                                    radius="9"
                                    ariaLabel="three-dots-loading"
                                />
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
            {fullScreenMode && renderFullScreenGallery()}
        </div>
    );
}
