import React, { useEffect } from 'react';
import { Tooltip } from 'bootstrap';
import { Info } from 'react-bootstrap-icons';

const InfoTooltip = ({ text }) => {
    useEffect(() => {
        // Initialize tooltips when component mounts
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));

        // Cleanup tooltips when component unmounts
        return () => {
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            [...tooltipTriggerList].map(tooltipTriggerEl => {
                const tooltip = Tooltip.getInstance(tooltipTriggerEl);
                if (tooltip) {
                    tooltip.dispose();
                }
            });
        };
    }, []);

    return (
        <span
            className="ms-1"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={text}
            style={{ cursor: 'pointer', border: '1px solid #000', padding: '1px', height: '15px', width: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Info />
        </span>
    );
};

export default InfoTooltip;