import React, { useRef, useEffect } from 'react';

const WebcamVideo = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play().catch(error => {
                        console.error('Error attempting to play video:', error);
                    });
                };
            })
            .catch((err) => {
                console.error("Error accessing webcam: ", err);
            });
    }, []);

    return <video ref={videoRef} width={640} height={480} />;
};

export default WebcamVideo;
