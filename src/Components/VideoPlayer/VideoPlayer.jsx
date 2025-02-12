"use client"

import { useEffect, useRef, useState } from "react"
import { Card, Button } from "react-bootstrap"
import { A11y, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import ApiService from "../../services/ApiService"
import { PlayFill } from "react-bootstrap-icons"
import styles from "./VideoPlayer.module.css"
// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"

const VideoPlayer = () => {
  const [videoBanners, setVideoBanners] = useState([])
  const videoRefs = useRef([])

  useEffect(() => {
    const payload = {
      company_id: process.env.REACT_APP_COMPANY_ID,
    }
    ApiService.companyVideoBanner(payload)
      .then((res) => {
        setVideoBanners(res?.payload_getActiveVideoBanner?.banners || [])
      })
      .catch((err) => console.error(err))
  }, [])

  const isYoutubeUrl = (url) => {
    return url?.includes("youtube.com") || url?.includes("youtu.be")
  }

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return ""

    let videoId = ""
    if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(url.split("?")[1])
      videoId = urlParams.get("v") || ""
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || ""
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1]?.split("?")[0] || ""
    }

    if (!videoId) return ""
    return `https://www.youtube.com/embed/${videoId}?rel=0`
  }

  const VideoElement = ({ url, index }) => {
    const [isPlaying, setIsPlaying] = useState(false)

    const handlePlay = () => {
      setIsPlaying(true)
      if (videoRefs.current[index]) {
        videoRefs.current[index].play().catch((err) => console.log("Playback failed:", err))
      }
    }

    if (isYoutubeUrl(url)) {
      return (
        <div className="embed-responsive embed-responsive-16by9" style={{ height: "100%" }}>
          <iframe
            className="embed-responsive-item"
            src={getYoutubeEmbedUrl(url)}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
      )
    }

    return (
      <div className="position-relative h-100">
        <video
          ref={(el) => (videoRefs.current[index] = el)}
          className="w-100 h-100"
          style={{ objectFit: "cover", borderRadius: "5px" }}
          loop
          playsInline
          controls={isPlaying}
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {!isPlaying && (
          <Button className={`position-absolute top-50 start-50 translate-middle ${styles.customPlayerButton}`} onClick={handlePlay}
          >
            <PlayFill size={50} />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="container-fluid py-4">
      {videoBanners.length > 0 && (
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
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 3.5,
            },
          }}
        >
          {videoBanners.map((video, index) => (
            <SwiperSlide key={index}>
              <Card className="h-100">
                <div style={{ aspectRatio: "3/5", overflow: "hidden"}}>
                  <VideoElement url={video?.video_url} index={index} />
                </div>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}

export default VideoPlayer

