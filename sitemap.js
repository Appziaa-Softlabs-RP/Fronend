const axios = require("axios");
const fs = require("fs"); // Assuming fs is available in your environment
const path = require("path");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const sitemap = async () => {
    const storeId = process.env.REACT_APP_STORE_ID;
    const appUrl = process.env.REACT_APP_URL;

    // get age group list
    const ageGroupResponse = await axios.post(
        "https://rewardsplus.in/api/store/ageGroupList",
        {
            store_id: storeId,
        }
    );
    const ageGroupList = ageGroupResponse?.data?.payload_ageGroupList?.age_group;

    const ageGroups = ageGroupList?.map(
        (ageGroup) => `/store/age/${ageGroup.name_url}`
    );


    // get all Brands
    const brandResponse = await axios.post(
        "https://rewardsplus.in/api/store/getAllBrands",
        {
            store_id: storeId,
        }
    );

    const brands = brandResponse?.data?.payload_getAllBrands;

    const brandsUrls = brands?.map(
        (brand) => `/store-product/brand/${brand?.name_url}`
    );

    // Vertical Response
    const verticalWithCatResponse = await axios.post(
        "https://rewardsplus.in/api/store/verticalWithCatList",
        {
            store_id: storeId,
        }
    );

    const verticalsWithCat =
        verticalWithCatResponse?.data?.payload_verticalWithCatList?.vertical;

    let verticalUrls = [];
    let categoryUrls = [];
    let verticalCatUrls = [];

    verticalsWithCat.forEach((element) => {
        verticalUrls.push(`/store/${element.name_url}`);
        element.catList.forEach((cat) => {
            categoryUrls.push(`/store-product/${cat.name_url}`);
            verticalCatUrls.push(
                `/store-product/vertical/${element.name_url}/category/${cat.name_url}`
            );
        });
    });

    // Product Routes
    const productResponse = await axios.post(
        "https://rewardsplus.in/api/store/getAllProduct",
        {
            store_id: storeId,
        }
    );

    const products = productResponse?.data?.payload_getAllProducts;

    const productUrls = products?.map(
        (product) => `/product/${product.name_url}`
    );

    const urls = [
        "/home",
        "/login",
        "/register",
        "/verify",
        "/shop-offers",
        "/offers",
        "/checkout",
        "/my-account",
        "/my-orders",
        "/order-details",
        "/my-address",
        "/privacy",
        "/terms",
        "/return-policy",
        "/about-us",
        "/faq",
        "/payments",
        "/Cancellation-policy",
        "/press",
    ];

    const sitemap1 = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
            ...urls,
            ...productUrls,
            ...verticalUrls,
            ...categoryUrls,
            ...verticalCatUrls,
            ...brandsUrls,
            ...ageGroups
        ]
            .map(
                (url) => `
<url>
<loc>${appUrl}${url}</loc>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
<lastmod>${new Date().toISOString()}</lastmod>
</url>
`
            )
            .join("\n")}
</urlset>`;

    const sitemap2 = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
            ...urls,
            ...productUrls,
            ...verticalUrls,
            ...categoryUrls,
            ...verticalCatUrls,
            ...brandsUrls,
            ...ageGroups
        ]
            .map(
                (url) => `
<url>
<loc>https://knickknack.in${url}</loc>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
<lastmod>${new Date().toISOString()}</lastmod>
</url>
`
            )
            .join("\n")}
</urlset>`;

    fs.writeFileSync(path.join("./public/sitemap.xml"), sitemap1);
    fs.writeFileSync(path.join("./public/sitemap2.xml"), sitemap2);
};

sitemap();