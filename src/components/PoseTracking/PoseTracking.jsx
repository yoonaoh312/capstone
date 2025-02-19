import React, { useRef, useEffect, useState } from "react";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import FocusZone from "../FocusZone/FocusZone";

const PoseTracking = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [pose, setPose] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      const net = await posenet.load();
      setModel(net);
      console.log("✅ PoseNet 모델 로드 완료!");
    };

    loadModel();
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };

    startCamera();
  }, []);

  const detectPose = async () => {
    if (!model || !videoRef.current) return;

    const pose = await model.estimateSinglePose(videoRef.current, {
      flipHorizontal: false,
    });

    setPose(pose);
    drawPose(pose);
  };

  const drawPose = (pose) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pose.keypoints.forEach((point) => {
      if (point.score > 0.5) {
        ctx.beginPath();
        ctx.arc(point.position.x, point.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });
  };

  useEffect(() => {
    if (model) {
      const interval = setInterval(detectPose, 100);
      return () => clearInterval(interval);
    }
  }, [model]);

  return (
    <div>
      <div style={{ position: "relative", width: "640px", height: "480px" }}>
        <video ref={videoRef} width="640" height="480" autoPlay playsInline style={{ position: "absolute" }} />
        <canvas ref={canvasRef} width="640" height="480" style={{ position: "absolute", zIndex: 1 }} />
        <FocusZone pose={pose} />
      </div>
    </div>
  );
};

export default PoseTracking;
