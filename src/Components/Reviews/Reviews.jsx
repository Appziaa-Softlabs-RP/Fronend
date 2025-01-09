'use client'

import { useEffect, useRef, useState } from 'react';
import { Quote, Star, StarFill } from 'react-bootstrap-icons';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './Review.module.css';

const reviews = [
    {
        name: 'Sarah Johnson',
        review: "The selection of toys is amazing! My kids absolutely love everything we've purchased. The quality is outstanding and the prices are very reasonable.",
        rating: 5,
        source: "Google Review"
    },
    {
        name: 'Robert Smith',
        review: 'Finding educational toys for my grandchildren has never been easier. The staff is incredibly helpful and knowledgeable about their products.',
        rating: 4,
        source: "Google Review"
    },
    {
        name: 'Emily Davis',
        review: "As a preschool teacher, I appreciate the range of developmental toys available. They're perfect for both learning and fun!",
        rating: 5,
        source: "Google Review"
    },
    {
        name: 'Michael Brown',
        review: 'The toy store has become our go-to place for birthday gifts. The unique selection and gift wrapping service make shopping here a joy.',
        rating: 5,
        source: "Google Review"
    },
    {
        name: 'Lisa Wilson',
        review: 'The website is easy to navigate, and delivery is always prompt. Customer service is exceptional when you need help.',
        rating: 4,
        source: "Google Review"
    }
]

export default function SuccessStories() {
    const swiperRef = useRef(null);
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);
    const [slidesPerView, setSlidesPerView] = useState(3.2);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1200) {
                setSlidesPerView(3.2);
            } else if (window.innerWidth >= 768) {
                setSlidesPerView(2.2);
            } else {
                setSlidesPerView(1.2);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.params) {
            swiperRef.current.params.navigation.prevEl = prevButtonRef.current;
            swiperRef.current.params.navigation.nextEl = nextButtonRef.current;
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
        }
    }, []);

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, index) => (
            index < rating ? <StarFill key={index} className={styles.starFilled} /> : <Star key={index} className={styles.starEmpty} />
        ));
    };

    return (
        <section className={styles.container}>
            <div className={styles.wrapper}>
                <h2 className={styles.title}>What Our Customers Say</h2>
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    modules={[Pagination, Navigation]}
                    spaceBetween={30}
                    slidesPerView={slidesPerView}
                    centeredSlides={true}
                    loop={true}
                    pagination={{ clickable: true }}
                    navigation={{
                        prevEl: prevButtonRef.current,
                        nextEl: nextButtonRef.current,
                    }}
                    className={styles.swiperContainer}
                >
                    {reviews.map((review, index) => (
                        <SwiperSlide key={index}>
                            <div className={styles.slideCard}>
                                <div className={styles.quoteLeft}>
                                    <Quote size={20} />
                                </div>
                                <div className={styles.quoteRight}>
                                    <Quote size={20} />
                                </div>
                                <h3 className={styles.userName}>{review.name}</h3>
                                <div className={styles.ratingContainer}>
                                    {renderStars(review.rating)}
                                </div>
                                <p className={styles.review}>{review.review}</p>
                                <p className={styles.source}>{review.source}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className={styles.navigationButtons}>
                    <button
                        ref={prevButtonRef}
                        className={`${styles.navButton} btnCustom ${styles.navButtonPrev}`}
                        aria-label="Previous slide"
                    >
                        ←
                    </button>
                    <button
                        ref={nextButtonRef}
                        className={`${styles.navButton} btnCustom ${styles.navButtonNext}`}
                        aria-label="Next slide"
                    >
                        →
                    </button>
                </div>
                <div className={styles.writeReviewContainer}>
                    <a
                        href="https://g.page/r/CXxxxxxxxxxxxxxxx/review"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={"btnCustom2"}
                    >
                        Share Your Experience
                    </a>
                </div>
            </div>
        </section>
    );
}

