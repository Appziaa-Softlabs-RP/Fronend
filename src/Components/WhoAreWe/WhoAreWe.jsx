import WeGrow from '../WeGrow/WeGrow'
import styles from './whoarewe.module.css'

export default function WhoAreWe() {
    return <section className={`${styles.mainContainer}`}>
        <div className={`${styles.wrapper}`}>
            <div className={`${styles.left}`}>
                <WeGrow />
            </div>
            <div className={`${styles.right}`}>
                <h2 className='titleMainSmall' style={{
                    textAlign: 'start',
                    margin: '0px'
                }}>Who are we?</h2>
                <h4 className='subTitleLarge' style={{
                    textAlign: 'start',
                    margin: '0px'
                }}>Neverowned</h4>
                <p className='text-white' style={{
                    fontSize: '0.9rem',
                }}>
                    We are customer obsessed, technology first company committed to provide comprehensively quality checked products, at deep discounts to the market prices, in a condition as good as new with complete service guarantee either directly from the OEM brand or our own exclusive Warranty/Warranty++ offerings.
                    <br />
                    <br />
                    Through our brand NeverOwned, we are solving core value-for-money problems faced by individual and institutional consumers while buying overhyped and overpriced new large appliances. Our unique low-cost business model leverages technology and brings the benefits of re-Commerce to consumers.
                </p>
                <img
                    src="/images/certified.png"
                    alt="certified"
                    className="img-fluid"
                    style={{
                        maxHeight: '100px',
                        maxWidth: '100px',
                    }}
                />
            </div>
        </div>
    </section>
}