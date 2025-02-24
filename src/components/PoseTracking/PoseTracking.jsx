import React, { useRef, useEffect, useState } from "react";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import FocusZone from "../FocusZone/FocusZone";
import "./PoseTracking.scss";

const PoseTracking = ({ onFocusChange }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [pose, setPose] = useState(null);
  const [inFocus, setInFocus] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const net = await posenet.load();
        setModel(net);
      } catch (error) {
        console.error("error:", error);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            videoRef.current.width = 640;
            videoRef.current.height = 480;

            if (model) {
              detectPose();
            }
            const interval = setInterval(detectPose, 100);
            return () => clearInterval(interval);
          };
        }
      } catch (err) {
        console.error("error:", error);
      }
    };

    if (model) {
      startCamera();
    }
  }, [model]);

  const detectPose = async () => {
    if (!model || !videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn("It is too early to detect pose. Try again later.");
      return;
    }
    try {
      const poseResult = await model.estimateSinglePose(video, { flipHorizontal: false });
      setPose(poseResult);
      drawPose(poseResult);
    } catch (error) {
      console.error("error:", error);
    }
  };

  const drawPose = (pose) => {
    if (!pose || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    pose.keypoints.forEach((point) => {
      if (point.score > 0.5) {
        ctx.beginPath();
        ctx.arc(point.position.x, point.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "lime";
        ctx.fill();
      }
    });
  };

  useEffect(() => {
    if (!pose) return;
    const nose = pose.keypoints.find((p) => p.part === "nose");
    if (!nose || nose.score < 0.5) return;
    const { x, y } = nose.position;
    const newInFocus = x > 220 && x < 420 && y > 140 && y < 340;
    if (newInFocus !== inFocus) {
      setInFocus(newInFocus);
      onFocusChange(newInFocus);
    }
  }, [pose, inFocus, onFocusChange]);

  return (
    <div className="pose-tracking-container">
      <video
        ref={videoRef}
        className="pose-tracking-video"
        autoPlay
        playsInline
      />
      <canvas
        ref={canvasRef}
        className="pose-tracking-canvas"
        width="640"
        height="480"
      />
      <FocusZone pose={pose} />
    </div>
  );
};

export default PoseTracking;
