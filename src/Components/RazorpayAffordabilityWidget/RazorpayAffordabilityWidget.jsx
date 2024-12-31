import React, { useEffect, useState } from 'react';

const RazorpayAffordabilityWidget = ({ amount }) => {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        // Check if the script is already added to avoid duplicate loading
        const scriptExists = document.querySelector('script[src="https://cdn.razorpay.com/widgets/affordability/affordability.js"]');
        if (!scriptExists) {
            const script = document.createElement('script');
            script.src = 'https://cdn.razorpay.com/widgets/affordability/affordability.js';
            script.async = true;
            script.onload = () => {
                console.log('Razorpay Affordability Widget script loaded');
                setIsScriptLoaded(true); // Set the script as loaded
            };
            script.onerror = (error) => {
                console.error('Failed to load Razorpay script:', error);
            };
            document.head.appendChild(script);
        } else {
            setIsScriptLoaded(true); // If script already exists, just mark as loaded
        }

        return () => {
            // Clean up script on component unmount
            const existingScript = document.querySelector('script[src="https://cdn.razorpay.com/widgets/affordability/affordability.js"]');
            if (existingScript) {
                document.head.removeChild(existingScript);
            }
        };
    }, []);

    useEffect(() => {
        if (isScriptLoaded) {
            // Initialize or update the widget whenever the amount changes
            const key = 'rzp_live_2RgyyWdKw9r1Cj'; // Replace with your Live Key ID
            const payableAmount = amount * 100; // Convert amount to paise

            if (window.RazorpayAffordabilitySuite) {
                // Destroy the existing widget before creating a new one
                const existingWidget = document.getElementById('razorpay-affordability-widget');
                existingWidget.innerHTML = ''; // Clear any existing widget

                const widgetConfig = {
                    key: key,
                    amount: payableAmount,
                };
                const rzpAffordabilitySuite = new window.RazorpayAffordabilitySuite(widgetConfig);
                rzpAffordabilitySuite.render(); // Render the widget
            } else {
                console.error('RazorpayAffordabilitySuite is not available');
            }
        }
    }, [isScriptLoaded, amount]); // Add `amount` as a dependency to update the widget when the amount changes

    if (!isScriptLoaded) {
        return null; // Don't render anything until the script is loaded
    }

    if (!window.RazorpayAffordabilitySuite) {
        return (
            <div className="alert alert-danger" role="alert">
                Razorpay Affordability Suite is not available
            </div>
        );
    }

    return (
        <div className="w-100" style={{
            minHeight: '50px',
        }}>
            <div
                id="razorpay-affordability-widget"
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px',
                }}
            >
                {/* Widget will render here */}
            </div>
        </div>
    );
};

export default RazorpayAffordabilityWidget;