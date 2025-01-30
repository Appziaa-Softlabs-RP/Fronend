import React, { useEffect, useState } from 'react';
import ApiService from '../../services/ApiService';

const VideoPlayer = () => {

    const [videoBanner, setVideoBanner] = useState([]);

    useEffect(() => {
        const payload = {
            company_id: process.env.REACT_APP_COMPANY_ID,
        };
        ApiService.companyVideoBanner(payload)
            .then((res) => {
                setVideoBanner(res?.payload_getActiveVideoBanner?.url || [])
            })
            .catch((err) => console.error(err));
    }, []);

    const isYoutubeUrl = (url) => {
        return url?.includes('youtube.com') || url?.includes('youtu.be');
    };

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return '';

        // Extract video ID more robustly
        let videoId = '';
        if (url.includes('youtube.com/watch')) {
            // Handle youtube.com/watch?v=VIDEO_ID
            const urlParams = new URLSearchParams(url.split('?')[1]);
            videoId = urlParams.get('v');
        } else if (url.includes('youtu.be/')) {
            // Handle youtu.be/VIDEO_ID
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
            // Handle youtube.com/embed/VIDEO_ID
            videoId = url.split('youtube.com/embed/')[1]?.split('?')[0];
        }

        if (!videoId) return '';

        // For looping, we need to use both loop=1 and playlist parameter
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}&rel=0`;
    };

    return (
        <div className="col-12 d-inline-flex justify-content-center">
            {videoBanner ? (
                <div className="col-12 d-inline-flex justify-content-center">
                    {isYoutubeUrl(videoBanner) ? (
                        <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
                            <iframe
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%'
                                }}
                                src={getYoutubeEmbedUrl(videoBanner)}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls={false}
                            className="col-12 d-inline-block"
                            style={{ width: '100%', height: 'auto' }}
                        >
                            <source
                                src={videoBanner}
                                type="video/mp4"
                            />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default VideoPlayer;