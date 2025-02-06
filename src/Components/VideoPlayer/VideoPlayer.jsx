import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ApiService from "../../services/ApiService";

const VideoPlayer = () => {
  const [videoBanners, setVideoBanners] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const videoRefs = useRef([]);

  useEffect(() => {
    const payload = {
      company_id: process.env.REACT_APP_COMPANY_ID,
    };
    ApiService.companyVideoBanner(payload)
      .then((res) => {
        setVideoBanners(res?.payload_getActiveVideoBanner?.banners || "");
      })
      .catch((err) => console.error(err));
  }, []);

  // Create array of 8 identical videos
  const videoArray = Array(8).fill(videoBanners);

  const isYoutubeUrl = (url) => {
    return url?.includes("youtube.com") || url?.includes("youtu.be");
  };

  const getYoutubeEmbedUrl = (url, withControls = false) => {
    if (!url) return "";

    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(url.split("?")[1]);
      videoId = urlParams.get("v") || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1]?.split("?")[0] || "";
    }

    if (!videoId) return "";
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1${withControls ? "&controls=1" : "&controls=0"}&playlist=${videoId}&rel=0`;
  };

  // Start videos with 3s delay between each
  useEffect(() => {
    videoRefs.current.forEach((videoRef, index) => {
      if (videoRef) {
        setTimeout(() => {
          videoRef.play().catch((err) => console.log("Playback failed:", err));
        }, index * 3000);
      }
    });
  }, []);

  const VideoElement = ({ url, index, fullScreen = false }) => {
    if (isYoutubeUrl(url)) {
      return (
        <div className="embed-responsive embed-responsive-16by9">
          <iframe
            className="embed-responsive-item"
            src={getYoutubeEmbedUrl(url, fullScreen)}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            allowFullScreen
          />
        </div>
      );
    }

    return (
      <video
        className="w-100 h-100"
        style={{ objectFit: "cover", borderRadius: "5px" }}
        autoPlay
        loop
        muted={!fullScreen}
        playsInline
        controls={fullScreen}
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  };

  return (
    <div className="container-fluid py-4">
      {videoBanners && (
        <>
          <Swiper
            modules={[Navigation, A11y]}
            slidesPerView={1}
            spaceBetween={30}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              340: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
          >
            {videoBanners.map((video, index) => (
              <SwiperSlide key={index}>
                <div
                  className="card h-100 cursor-pointer"
                  onClick={() => {
                    setSelectedVideo(video?.video_url);
                    setShowModal(true);
                  }}
                >
                  <div style={{ aspectRatio: "3/5", overflow: "hidden" }}>
                    <VideoElement url={video?.video_url} index={index} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Full Screen Modal */}
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            size="sm"
            centered
          >
            <Modal.Body className="p-0">
              <div
                style={{
                  aspectRatio: "3/5",
                  objectFit: "cover",
                  // marginBottom: "-6px",
                }}
              >
                <VideoElement url={selectedVideo} fullScreen />
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
