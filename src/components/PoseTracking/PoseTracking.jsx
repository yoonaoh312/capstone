import React, { useRef, useEffect, useState } from "react";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import FocusZone from "../FocusZone/FocusZone";

const PoseTracking = ({ onFocusChange }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [pose, setPose] = useState(null);
  const [inFocus, setInFocus] = useState(false);

  useEffect(() => {
    // PoseNet 모델 로드
    const loadModel = async () => {
      const net = await posenet.load();
      setModel(net);
      console.log("✅ PoseNet 모델 로드 완료!");
    };
    loadModel();
  }, []);

  useEffect(() => {
    // 웹캠 시작
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => videoRef.current.play();
        }
      } catch (err) {
        console.error("❌ 웹캠 로딩 오류:", err);
      }
    };
    startCamera();
  }, []);

  const detectPose = async () => {
    if (!model || !videoRef.current) return;

    const pose = await model.estimateSinglePose(videoRef.current, { flipHorizontal: false });
    setPose(pose);
    drawPose(pose);
  };

  const drawPose = (pose) => {
    if (!pose || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

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
    // 일정 주기로 자세 감지
    if (model) {
      const interval = setInterval(detectPose, 100);
      return () => clearInterval(interval);
    }
  }, [model]);

  useEffect(() => {
    // 코(코 keypoint) 좌표를 기준으로 inFocus 판별
    if (!pose) return;

    const nose = pose.keypoints.find((p) => p.part === "nose");
    if (!nose || nose.score < 0.5) return;

    const { x, y } = nose.position;
    const newInFocus = x > 220 && x < 420 && y > 140 && y < 340;

    if (newInFocus !== inFocus) {
      setInFocus(newInFocus);
      // 부모(AdminPanel) 등으로 현재 inFocus 상태를 전달
      onFocusChange(newInFocus);
    }
  }, [pose, inFocus, onFocusChange]);

  return (
    <div style={{ position: "relative", width: "640px", height: "480px" }}>
      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        playsInline
        style={{ position: "absolute" }}
      />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ position: "absolute", zIndex: 1 }}
      />
      <FocusZone pose={pose} />
      {/* 
        FocusTimer를 제거함으로써 중복 타이머 문제를 해결.
        이제 PoseTracking은 inFocus 상태만 계산하고,
        실제 타이머는 AdminPanel(부모)에서 <FocusTimer inFocus={inFocus} ...> 형태로 렌더링합니다.
      */}
    </div>
  );
};

export default PoseTracking;
