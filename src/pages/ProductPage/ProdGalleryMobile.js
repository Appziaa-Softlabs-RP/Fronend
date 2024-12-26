import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ThreeDots } from "react-loader-spinner";
import ReactOwlCarousel from "react-owl-carousel";
import { enviroment } from "../../enviroment";

export default function ProdGalleryMobile({
    ProductData,
    styles,
    productLoading,
    setNoImage,
    prodMainImg,
    getProductImageOfColorId
}) {
    const [fullScreenMode, setFullScreenMode] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <button
                        onClick={closeFullScreen}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'black',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                        aria-label="btn btn-primary Close full screen gallery"
                    >
                        ← Back
                    </button>
                    <span style={{ color: 'black' }}>{currentImageIndex + 1} / {allImages.length}</span>
                </div>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <img
                        src={allImages[currentImageIndex]}
                        alt={`Product image ${currentImageIndex + 1}`}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain'
                        }}
                    />
                    <button
                        onClick={() => navigateImage(-1)}
                        style={{
                            position: 'absolute',
                            left: '10px',
                            background: 'none',
                            border: 'none',
                            color: 'black',
                            fontSize: '24px',
                            cursor: 'pointer'
                        }}
                        aria-label="Previous image"
                    >
                        ‹
                    </button>
                    <button
                        onClick={() => navigateImage(1)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            background: 'none',
                            border: 'none',
                            color: 'black',
                            fontSize: '24px',
                            cursor: 'pointer'
                        }}
                        aria-label="Next image"
                    >
                        ›
                    </button>
                </div>
                <div style={{
                    padding: '10px',
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '10px'
                }}>
                    {allImages.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                border: index === currentImageIndex ? '2px solid black' : 'none',
                                cursor: 'pointer'
                            }}
                            onClick={() => setCurrentImageIndex(index)}
                        />
                    ))}
                </div>
            </div>,
            document.body
        );
    };

    return (
        <>
            <div className="col-12 bg-white d-inline-block position-relative">
                {ProductData?.stock === 0 || ProductData?.stock < 0 ? (
                    <div
                        className={`${styles.productSoldOutBox} position-absolute col-12 p-0 h-100`}
                    >
                        <span
                            className={`${styles.soldOutText} text-center text-uppercase position-absolute d-block`}
                        >
                            Sold Out
                        </span>
                    </div>
                ) : (
                    ""
                )}
                <ReactOwlCarousel
                    className={`${styles.bannerContainer} col-12 owl-theme`}
                    margin={0}
                    loop={false}
                    dots={true}
                    items={1}
                >
                    {allImages.map((img, index) => (
                        <div
                            key={index}
                            className={`col-12 d-inline-block bg-white d-flex align-items-center justify-content-center w-full`}
                            onClick={() => openFullScreen(index)}
                        >
                            {!productLoading ? (
                                <img
                                    src={img}
                                    alt={`${ProductData?.name} - Image ${index + 1}`}
                                    onError={(e) => setNoImage(e)}
                                    className="col-12 d-inline-block"
                                    style={{
                                        minHeight: "300px",
                                        maxHeight: "500px",
                                        width: "auto",
                                        objectFit: "contain"
                                    }}
                                />
                            ) : (
                                <div
                                    className={`col-12 d-inline-block d-flex align-items-center justify-content-center w-full`}
                                    style={{
                                        height: "500px",
                                    }}
                                >
                                    <ThreeDots
                                        visible={true}
                                        height="80"
                                        width="80"
                                        color="#000"
                                        radius="9"
                                        ariaLabel="three-dots-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </ReactOwlCarousel>
                {productLoading && !ProductData?.gallery_images.length ? (
                    !productLoading ? (
                        <div
                            className={`col-12 d-inline-block d-flex align-items-center justify-content-center w-full`}
                        >
                            <img
                                src={prodMainImg === "" ? getProductImageOfColorId(ProductData?.color_id) : prodMainImg}
                                alt={ProductData?.name}
                                onError={(e) => setNoImage(e)}
                                className="col-12 d-inline-block"
                                style={{
                                    maxHeight: "100px",
                                    width: "auto",
                                }}
                            />
                        </div>
                    ) : (
                        <div
                            className={`col-12 d-inline-block d-flex align-items-center justify-content-center w-full`}
                            style={{
                                height: "100px",
                            }}
                        >
                            <ThreeDots
                                visible={true}
                                height="80"
                                width="80"
                                color="#000"
                                radius="9"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </div>
                    )
                ) : null}
            </div>
            {fullScreenMode && renderFullScreenGallery()}
        </>
    );
}

