'use client'

import React, { useEffect, useState } from 'react';
import { Envelope, Facebook, Instagram, Linkedin, Telephone, Twitter, X, Youtube } from 'react-bootstrap-icons';
import { enviroment } from "../../enviroment";
import styles from './UnderConstruction.module.css';

export default function UnderConstruction() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const checkVisibility = () => {
            const closedTimestamp = localStorage.getItem('underConstructionClosed')
            if (!closedTimestamp) {
                setIsVisible(true)
                return
            }

            const closedTime = parseInt(closedTimestamp, 10)
            const currentTime = new Date().getTime()
            const timeDifference = currentTime - closedTime
            const daysDifference = timeDifference / (1000 * 3600 * 24)

            if (daysDifference > 2) {
                setIsVisible(true)
                localStorage.removeItem('underConstructionClosed')
            }
        }

        checkVisibility()
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        const currentTime = new Date().getTime()
        localStorage.setItem('underConstructionClosed', currentTime.toString())
    }

    if (!isVisible) return null

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
                    <X size={24} />
                </button>
                <h1 className={styles.title}>Toy Box Under Makeover!</h1>
                <p className={styles.description}>We're assembling the ultimate playground of imagination. Get ready for a world of wonder!</p>

                <div className={styles.toyElements}>
                    <div className={styles.toyBlock} aria-hidden="true"></div>
                    <div className={styles.toyBall} aria-hidden="true"></div>
                    <div className={styles.toyTrain} aria-hidden="true"></div>
                </div>

                <div className={styles.contactInfo}>
                    {enviroment.PHONE_NUMBER && (
                        <a href={`tel:${enviroment.PHONE_NUMBER}`} className={styles.contactItem}>
                            <Telephone /> {enviroment.PHONE_NUMBER}
                        </a>
                    )}
                    {enviroment.EMAIL_ADDRESS && (
                        <a href={`mailto:${enviroment.EMAIL_ADDRESS}`} className={styles.contactItem}>
                            <Envelope /> {enviroment.EMAIL_ADDRESS}
                        </a>
                    )}
                    {enviroment.STORE_ADDRESS && (
                        <p className={styles.contactItem}>
                            {enviroment.STORE_ADDRESS}
                        </p>
                    )}
                </div>

                <div className={styles.socialLinks}>
                    {enviroment.FACEBOOK_LINK && (
                        <a href={enviroment.FACEBOOK_LINK} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                            <Facebook size={24} />
                        </a>
                    )}
                    {enviroment.TWITTER_LINK && (
                        <a href={enviroment.TWITTER_LINK} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Twitter">
                            <Twitter size={24} />
                        </a>
                    )}
                    {enviroment.LINKEDIN_LINK && (
                        <a href={enviroment.LINKEDIN_LINK} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
                            <Linkedin size={24} />
                        </a>
                    )}
                    {enviroment.INSTAGRAM_LINK && (
                        <a href={enviroment.INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                            <Instagram size={24} />
                        </a>
                    )}
                    {enviroment.YOUTUBE_LINK && (
                        <a href={enviroment.YOUTUBE_LINK} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube">
                            <Youtube size={24} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

