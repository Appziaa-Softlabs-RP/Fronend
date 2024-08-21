import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import noImage from "../../assets/images/image-not-available.jpg";
import mensCollection from '../../assets/images/mens-collection.svg';
import { enviroment } from '../../enviroment';
import ApiService from '../../services/ApiService';
import styles from './Collection.module.css';
import womensCollection from '../../assets/images/women-fashion.svg';

export default function Collections({ type }) {

    const [shopCategory, setShopCategory] = useState([]);

    useEffect(() => {
        const payload = {
            store_id: parseInt(enviroment.STORE_ID),
            vertical_slug: type,
        };
        ApiService.StoreSubCategory(payload)
            .then((res) => {
                console.log(res)
                // only selecting 4
                setShopCategory(res?.payload_verticalByCategory.slice(0, 4));
            })
            .catch((err) => { });
    }, [type]);

    const getTitle = ({ type }) => {
        if (type === 'men') {
            return "Men's Collection";
        } else if (type === 'women') {
            return "Women's Collection";
        } else {
            return 'Collection';
        }
    }


    return <div className={`container-fluid m-0 ${styles.mainContainer}`}>
        <div className={`container row col-12 mx-auto d-flex flex-column-reverse ${type === "men" ? "flex-md-row" : "flex-md-row-reverse"}`}>
            <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center py-4">
                <h2 className="text-center">
                    {getTitle({ type })}
                </h2>
                <div className="row col-12 gap-2 d-flex py-4 flex-wrap justify-content-center">
                    {shopCategory.map((item, index) => {
                        return (
                            <Link to={`/store/${item?.name_url}`}
                                key={index}
                                className={`position-relative col-5 ${styles.categoryCollection}`}
                            >
                                <img
                                    src={item?.image === "" ? noImage : item?.image}
                                    alt={item?.name}
                                    className={`${styles.imageResponsive}`}
                                />
                                <p
                                    className={`text-center mt-2 ${styles.categoryName}`}
                                >
                                    {item?.name}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
            <div className='col-12 col-md-6 position-relative' 
                style={{
                    maxWidth: "100%",
                    overflow: "hidden",
                }}
            >
                <img
                    src={
                        type === "men" ?
                        mensCollection :
                        womensCollection
                    }
                    alt="Mens Collection"
                    className={`${styles.darkenImage}`}
                />
                <p className={styles.collectionImageText}
                    style={{
                        whiteSpace: "break-spaces",
                        wordSpacing: "99999px"
                    }}
                >
                    {getTitle({ type })}
                </p>
            </div>
        </div>
    </div>
}