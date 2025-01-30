import React, { useState, useEffect } from 'react';

const GoToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled up to given distance
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <div
                    onClick={scrollToTop}
                    className='btnCustom'
                    style={{
                        position: 'fixed',
                        right: '20px',
                        bottom: '20px',
                        cursor: 'pointer',
                        backgroundColor: 'red',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#fff',
                        fontSize: '24px',
                        opacity: '0.7',
                        transition: 'opacity 0.3s',
                        zIndex: '1000',
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = '1')}
                    onMouseLeave={(e) => (e.target.style.opacity = '0.7')}
                >
                    ↑
                </div>
            )}
        </>
    );
};

export default GoToTop;
