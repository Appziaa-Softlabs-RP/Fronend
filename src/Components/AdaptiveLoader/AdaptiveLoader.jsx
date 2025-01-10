import styles from './AdaptiveLoader.module.css'

export default function AdaptiveLoader({ fullWidth = false }) {
    return (
        <div className={`${styles.loaderContainer} ${fullWidth ? styles.fullWidth : styles.halfWidth}`}>
            <div className={styles.loaderWrapper}>
                <img
                    src="/images/loader-logo.png"
                    alt="Loading"
                    className={styles.loaderImage}
                />
                <p className={styles.loadingText}>Loading...</p>
            </div>
        </div>
    )
}