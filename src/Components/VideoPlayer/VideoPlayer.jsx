"use client"

import { useEffect, useRef, useState } from "react"
import { Card, Button } from "react-bootstrap"
import { A11y, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import ApiService from "../../services/ApiService"
import { ArrowsAngleExpand, ArrowsExpand, ArrowsExpandVertical, ArrowsFullscreen, PauseFill, PlayFill, VolumeMute, VolumeUp } from "react-bootstrap-icons"
import "./VideoPlayer.css"
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
    const [volume, setVolume] = useState(1)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [hasPlayed, setHasPlayed] = useState(false)
    const videoRef = useRef(null)

    useEffect(() => {
      videoRefs.current[index] = videoRef.current
    }, [index])

    const togglePlay = () => {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }

    const handleVolumeChange = (e) => {
      const newVolume = parseFloat(e.target.value)
      videoRef.current.volume = newVolume
      setVolume(newVolume)
    }

    const handleProgress = () => {
      const current = videoRef.current.currentTime
      setCurrentTime(current)
      setProgress((current / videoRef.current.duration) * 100)
    }

    const handleSeek = (e) => {
      const newTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration
      videoRef.current.currentTime = newTime
      setProgress(e.target.value)
    }

    const toggleFullscreen = () => {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }

    const handlePlay = () => {
      if (!hasPlayed) {
        setHasPlayed(true)
      }
      videoRef.current.play().catch((err) => console.log("Playback failed:", err))
      setIsPlaying(true)
    }

    // Helper to format the countdown (negative minutes remaining)
    const formatCountdown = (remainingSeconds) => {
      if (remainingSeconds <= 0) return "0.00"
      return `-${(remainingSeconds / 60).toFixed(2)}`
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
      <div className="position-relative videoElement h-100" onClick={!isPlaying ? handlePlay : undefined}>
        <video
          ref={videoRef}
          className="custom-video"
          loop
          playsInline
          onLoadedMetadata={() => setDuration(videoRef.current.duration)}
          onTimeUpdate={handleProgress}
          onClick={togglePlay}
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay big play button when not playing */}
        {!isPlaying && !hasPlayed && (
          <Button
            className="position-absolute top-50 start-50 translate-middle customPlayerButton"
            onClick={(e) => {
              e.stopPropagation()
              handlePlay()
            }}
          >
            <PlayFill className="big-control-icon" />
          </Button>
        )}
        {/* Custom Controls */}
        {hasPlayed && (
          <div className="video-controls">
            {/* Left Group: Play/Pause and Volume */}
            <div className="left-group">
              <button onClick={togglePlay} className="control-btn">
                {isPlaying ? (
                  <PauseFill className="control-icon" />
                ) : (
                  <PlayFill className="control-icon" />
                )}
              </button>
              <div className="volume-container">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const newVolume = volume === 0 ? 1 : 0
                    videoRef.current.volume = newVolume
                    setVolume(newVolume)
                  }}
                  className="control-btn"
                >
                  {volume === 0 ? (
                    <VolumeMute className="control-icon" />
                  ) : (
                    <VolumeUp className="control-icon" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-control"
                />
              </div>
            </div>

            {/* Middle Group: Progress Control */}
            <div className="middle-group">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={handleSeek}
                className="progress-control"
              />
            </div>

            {/* Right Group: Timer and Fullscreen */}
            <div className="right-group">
              <span className="time-display" style={{
                transform: "translateY(3px)"
              }}>
                {formatCountdown(duration - currentTime)}
              </span>
              <button onClick={toggleFullscreen} className="control-btn">
                <ArrowsFullscreen className="control-icon"
                  style={{
                    fontSize: "0.6em"
                  }}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container py-4">
      {videoBanners.length > 0 && (
        <Swiper
          modules={[Navigation, A11y]}
          slidesPerView={1}
          spaceBetween={30}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            340: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 3.5,
            }
          }}
        >
          {videoBanners.map((video, index) => (
            <SwiperSlide key={index}>
              <Card className="h-100">
                <div style={{ aspectRatio: "3/5", overflow: "hidden" }}>
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

