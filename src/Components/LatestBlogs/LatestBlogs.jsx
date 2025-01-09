'use client'

import React, { useEffect, useState } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const LatestBlogs = () => {
    // const blogs = [
    //     {
    //         title: "Top 10 Educational Toys for Toddlers",
    //         description: "Discover the best toys that can help your toddler learn and grow while having fun!",
    //         image: "https://source.unsplash.com/random/800x600?toy,educational",
    //         dateAdded: "2023-07-01",
    //         categories: ["Educational", "Toddlers"]
    //     },
    //     {
    //         title: "The Rise of Eco-Friendly Toys",
    //         description: "Explore the growing trend of sustainable and environmentally friendly toys for conscious parents.",
    //         image: "https://source.unsplash.com/random/800x600?toy,eco-friendly",
    //         dateAdded: "2023-06-28",
    //         categories: ["Eco-Friendly", "Sustainability"]
    //     },
    //     {
    //         title: "Retro Toys Making a Comeback",
    //         description: "Nostalgia alert! These classic toys from your childhood are becoming popular again.",
    //         image: "https://source.unsplash.com/random/800x600?toy,retro",
    //         dateAdded: "2023-06-25",
    //         categories: ["Retro", "Classics"]
    //     },
    //     {
    //         title: "STEM Toys: Preparing Kids for the Future",
    //         description: "How STEM toys are shaping the next generation of innovators and problem-solvers.",
    //         image: "https://source.unsplash.com/random/800x600?toy,stem",
    //         dateAdded: "2023-06-22",
    //         categories: ["STEM", "Educational"]
    //     }
    // ]

    const [blogs, setBlogs] = useState(null);

    const fetchBlogs = async () => {
        const response = await fetch(`${process.env.REACT_APP_BLOGS_API_URL}/blogs/latest`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
                "email": process.env.REACT_APP_EMAIL_ADDRESS
            }
        });
        const data = await response.json();
        if (response.status === 200) {
            setBlogs(data?.data);
        } else {
            setBlogs(null)
        }
    }

    useEffect(() => {
        fetchBlogs();
    }, []);

    if (!blogs || blogs?.length <= 0) return null;

    return (
        <div className=""
            style={{
                backgroundColor: '#f7ba0023',
            }}
        >
            <div className="container my-5">
                <h2 className="text-center mb-4" style={{
                    color: '#FF0000',
                    fontSize: '32px',
                    fontWeight: '600',
                    marginBottom: '2rem'
                }}>Latest Blog Posts</h2>

                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                        },
                        992: {
                            slidesPerView: 3,
                        },
                    }}
                    style={{
                        padding: '20px 5px 50px 5px',
                    }}
                >
                    {blogs?.map((blog, index) => (
                        <SwiperSlide key={index}>
                            <a href={`https://blog.toymie.com/blog/${blog.slug}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                <div className="card h-100" style={{
                                    border: '1px solid #eee',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    cursor: 'pointer',
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)'
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <img
                                        src={blog.cover_image}
                                        className="card-img-top"
                                        alt={blog.title}
                                        style={{
                                            height: '200px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <div className="card-body" style={{ padding: '1.25rem' }}>
                                        <h5 className="card-title" style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '0.75rem',
                                            color: '#333'
                                        }}>{blog.title}</h5>
                                        <p className="card-text" style={{
                                            fontSize: '14px',
                                            color: '#666',
                                            marginBottom: '1rem',
                                            lineHeight: '1.5',
                                            minHeight: '110px'
                                        }}>
                                            {blog.description.length > 150 ? blog.description.substring(0, 150) + '...' : blog.description}
                                        </p>
                                        <div className="d-flex justify-content-between align-items-end">
                                            <div className="categories">
                                                {blog.categories.map((category, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="badge me-1"
                                                        style={{
                                                            backgroundColor: '#FF0000',
                                                            color: 'white',
                                                            padding: '4px 8px',
                                                            fontSize: '12px',
                                                            fontWeight: '500',
                                                            borderRadius: '4px'
                                                        }}
                                                    >
                                                        {category?.name}
                                                    </span>
                                                ))}
                                            </div>
                                            <small style={{ color: '#999', fontSize: '12px' }}>
                                                {
                                                    new Date(blog.created_at).toLocaleDateString('en-GB', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })
                                                }
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="text-center mt-4">
                    <a href="https://blog.toymie.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                        <button
                            className="btn btnCustom"
                            style={{
                                color: "var(--SECONDARY_COLOR)"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E60000'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF0000'}
                        >
                            View All Blog Posts
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default LatestBlogs

