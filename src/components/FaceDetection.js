//------------------------------------Proper working code 99.99%---------------------------------------

import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

const mimeType = "video/webm";

const FaceDetection = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const socketRef = useRef(null);
    const imageRef = useRef(new Image());

    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedVideo, setRecordedVideo] = useState(null);
    const [videoChunks, setVideoChunks] = useState([]);
    const mediaRecorder = useRef(null);
    const intervalRef = useRef(null);
    const [lastFrame, setLastFrame] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws/facedetection/');
        socketRef.current = ws;

        ws.onopen = () => {
            console.log('Connected to WebSocket');
        };

        ws.onmessage = (event) => {
            const frameData = JSON.parse(event.data);
            console.log("FrameData", frameData.processedFrame);

            const image = imageRef.current;
            image.onload = () => {
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);
            };
            image.src = frameData.processedFrame;
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket');
        };

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    useEffect(() => {
        let intervalId;
        if (isRecording) {
            intervalId = setInterval(captureFrame, 150); // Capture and send frame every 150ms
        }
        return () => clearInterval(intervalId);
    }, [isRecording]);

    const toggleCamera = () => {
        setIsCameraOn(prev => !prev);
        if (!isCameraOn) {
            startVideo();
        } else {
            stopVideo();
        }
    };

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setIsCameraOn(true);
            })
            .catch(err => console.error('Error accessing webcam:', err));
    };

    const stopVideo = () => {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
        setIsCameraOn(false);
    };

    const captureFrame = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;

            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const base64data = reader.result;
                    setLastFrame(base64data); 
                    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                        socketRef.current.send(JSON.stringify({ image: base64data }));
                    }
                };
            }, 'image/jpeg');
        }
    };

    const startRecording = () => {
        setIsRecording(true);
        setVideoChunks([]);

        const stream = videoRef.current.srcObject;
        const media = new MediaRecorder(stream, { mimeType });
        mediaRecorder.current = media;

        mediaRecorder.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                setVideoChunks(prev => [...prev, event.data]);
            }
        };

        mediaRecorder.current.start();
    };

    const stopRecording = async () => {
        setIsRecording(false);

        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            mediaRecorder.current.onstop = () => {
                const videoBlob = new Blob(videoChunks, { type: mimeType });
                const videoUrl = URL.createObjectURL(videoBlob);
                setRecordedVideo(videoUrl);
            };
        }

        if (lastFrame) {
            try {
                await fetch('http://127.0.0.1:8000/finalize_video', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image: lastFrame }),
                });
            } catch (error) {
                console.error('Error sending last frame to finalize_video endpoint:', error);
            }
        }
    };

    return (
        <div>
            <video ref={videoRef} width="640" height="480" style={{ display: isCameraOn ? 'block' : 'none' }} />
            <canvas ref={canvasRef} width="640" height="480" />
            <button onClick={toggleCamera}>
                {isCameraOn ? 'Stop Camera' : 'Start Camera'}
            </button>
            <button onClick={startRecording} disabled={isRecording || !isCameraOn}>
                Start Recording
            </button>
            <button onClick={stopRecording} disabled={!isRecording}>
                Stop Recording
            </button>
            {recordedVideo && (
                <div>
                    <h3>Recorded Video</h3>
                    <video controls src={recordedVideo} style={{ height: '300px' }}></video>
                </div>
            )}
        </div>
    );
};

export default FaceDetection;



