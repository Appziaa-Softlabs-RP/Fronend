import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './Loader.module.css';

// const Wrapper = ({ child }) => <div className='flex w-16'>{child}</div>

export const HeaderNavLoader = () => {
  return (
    <div className='p-1 pb-2 d-flex justify-content-around' style={{
      maxWidth: "100dvw",
      overflowX: "hidden",
    }}>
      <Skeleton height={40} width={"80%"} containerClassName='h-100' style={{
        minWidth: '180px',
        margin: '0px 80px',
        width: '200px'
      }} />
      <Skeleton height={40} width={"80%"} containerClassName='h-100' style={{
        minWidth: '180px',
        margin: '0px 80px',
        width: '200px'
      }} />
      <Skeleton height={40} width={"80%"} containerClassName='h-100' style={{
        minWidth: '180px',
        margin: '0px 80px',
        width: '200px'
      }} />
      <Skeleton height={40} width={"80%"} containerClassName='h-100' style={{
        minWidth: '180px',
        margin: '0px 80px',
        width: '200px'
      }} />
    </div>
  )
}

export const ProductCardLoader = () => {
  return (
    <div className={styles.productCardLoaderWrapper}>
      <div className={styles.productCardLoaderWrapperBody}>
        <div className='container'>
          {/* images */}
          <Skeleton
            height={275}
            width={"100%"}
          />

          <Skeleton
            height={16}
            count={2}
          />
          <Skeleton
            height={16}
            width={"40%"}
          />
          <div className='mt-10' />
          <Skeleton height={50} />
        </div>
      </div>
    </div>
  );
}

export const ProductListLoader = () => {
  return (
    <div className='d-flex flex-column w-full'>
      {/* <div className={`${styles.ageBannerRow} col-12 d-inline-flex mb-4`}>
        <Skeleton
          height={200}
          className={styles.productListBanner}
        />
      </div> */}
      <div className='d-flex w-full'
        style={{
          position: "relative",
          maxWidth: "100vw",
          overflowX: "hidden",
        }}
      >
        <div className={styles.productCardsContainer}>
          {Array.apply(null, { length: 10 }).map((e, i) => (
            <ProductCardLoader key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const HeroBannerLoader = () => {
  return (
    <div className={styles.heroBannerLoader}>
      <Skeleton containerClassName='h-100 w-100'
        style={{
          minHeight: '100%',
          borderRadius: '10px',
        }}
        height={100}
        width={"100%"} />
    </div>
  );
}

const responsiveItems =
  window.innerWidth >= 1450
    ? 6
    : window.innerWidth >= 1400
      ? 5
      : window.innerWidth >= 992
        ? 4
        : 3

export const ShopAgeLoader = () => {
  return (
    <div className={styles.ageLoader}>
      <div className='container'>
        <div className={styles.bannerTitle}>
          <Skeleton
            containerClassName='h-100 w-100 mt-4'
            height={40}
            width={"40%"}
          />
        </div>
        <div className={styles.ageBody}>
          {Array.apply(null, { length: responsiveItems }).map((e, i) => (
            <div className={styles.smallBox} key={i} style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}>
              <Skeleton className={styles.ageCircleLoader} />
              <Skeleton className={styles.ageTextLoader} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const LookingForBannerLoader = () => {
  return (
    <div className={styles.bannerLoader}>
      <div className='container'>
        <div className={styles.bannerTitle}>
          <Skeleton
            containerClassName='h-100 w-100'
            height={25}
            width={"40%"}
          />
        </div>
        <div className={styles.bannerBody}>
          {Array.apply(null, { length: 6 }).map((e, i) => (
            <div className={styles.smallBox} key={i}>
              <Skeleton className='h-100 w-100' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const CategoryShopLoader = () => {
  return (
    <div className={styles.bannerLoader}>
      <div className='container'>
        <div className={styles.bannerTitle}>
          <Skeleton
            containerClassName='h-100 w-100'
            height={50}
            width={"30%"}
          />
        </div>
        <div className={styles.bannerBody}>
          {Array.apply(null, { length: 6 }).map((e, i) => (
            <div className={styles.smallBox}>
              <Skeleton className='h-100 w-100' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const PromoBannerLoader = () => {
  return (
    <div className={styles.bannerLoader}>
      <div className='container'>
        <div className={styles.bannerTitle}>
          <Skeleton
            containerClassName='h-100 w-100'
            height={50}
            width={"30%"}
          />
        </div>
        <div className={styles.bannerBody}>
          {Array.apply(null, { length: 3 }).map((e, i) => (
            <div className={styles.promoBox} key={i}>
              <Skeleton className='h-100 w-100' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const BrandFocusLoader = () => {
  return (
    <div className={styles.bannerLoader}>
      <div className='container'>
        <div className={styles.bannerTitle}>
          <Skeleton
            containerClassName='h-100 w-100'
            height={50}
            width={"20%"}
          />
        </div>
        <div className={styles.bannerBody}>
          {Array.apply(null, { length: 3 }).map((e, i) => (
            <div className={styles.focusBox}>
              <Skeleton className='h-100 w-100' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}