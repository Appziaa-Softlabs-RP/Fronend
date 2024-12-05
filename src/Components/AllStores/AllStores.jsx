
import React, { useEffect, useState } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import styles from './AllStores.module.css';

export const AllStores = () => {
    const [storeData, setStoreData] = useState([]);
    const [activeLocation, setActiveLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLocationChange = (city_id) => {
        const newLocation = storeData.find(loc => loc.city_id === city_id);
        if (newLocation) setActiveLocation(newLocation);
    };

    useEffect(() => {
        const payload = {
            company_id: parseInt(enviroment.COMPANY_ID),
        };
        setLoading(true);
        ApiService.getAllStores(payload)
            .then((res) => {
                if (res.payload.length === 0) return;
                const removeDuplicateCityId = res.payload.filter((v, i, a) =>
                    a.findIndex(t => (t.city_id === v.city_id)) === i
                );
                setStoreData(removeDuplicateCityId);
                setActiveLocation(res.payload[0]);
            })
            .catch((err) => { console.error(err); })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return null;

    if (storeData.length === 0) return null;

    return (
        <Container fluid className="bg-white border-bottom border-light py-5"
            style={{
                position: "relative",
                maxWidth: '800px',
                margin: "0 auto"
            }}
        >            <Container>
                <Row className="mb-4">
                    <Col>
                        <Nav className="justify-content-center" activeKey={activeLocation?.city_id} onSelect={(selectedKey) => handleLocationChange(selectedKey)}>
                            {storeData.map((loc, index) => (
                                <Nav.Item key={index}>
                                    <Nav.Link
                                        eventKey={loc.city_id}
                                        className={`px-3 py-2 mx-2 ${loc.city_id === activeLocation?.city_id ? 'border-bottom border-2 border-danger fw-bold' : ''}`}
                                    >
                                        <span className='fs-6 text-black'>{loc.city_id}</span>
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="position-relative m-0 p-0 mb-md-0">
                        <div className={styles.activeImage}>
                            <img
                                src={`${activeLocation?.photo}`}
                                alt="store"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'fill',
                                    display: 'block',
                                }}
                            />
                        </div>
                    </Col>
                    <Col md={12} className={`position-relative d-flex align-items-center p-0`}>
                        <div className={`text-white p-4 w-100  ${styles.activeLocatoin}`}>
                            <h2 className="mb-4">{activeLocation?.city_id}</h2>
                            <p>{activeLocation?.address}</p>
                            <p>
                                Call Us: <a href={`tel:${activeLocation?.contact}`} className="text-white">{activeLocation?.contact}</a>
                            </p>
                            <p>
                                Email: <a href={`mailto:${activeLocation?.email}`} className="text-white">{activeLocation?.email}</a>
                            </p>
                            <a href={`https://www.google.com/maps?q=${activeLocation?.lat},${activeLocation?.lon}`} className="text-white">MAP</a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default AllStores;
