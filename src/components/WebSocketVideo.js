// import React, { useEffect, useRef, useState } from 'react';
// import useWebSocket from 'react-use-websocket';

// const WebSocketVideo = () => {
//     const canvasRef = useRef(null);
//     const [faceDetected, setFaceDetected] = useState(false);
//     const { lastJsonMessage } = useWebSocket('ws://localhost:8000/ws/facedetection/', {
//         onOpen: () => console.log('WebSocket connection established.'),
//         onClose: () => console.log('WebSocket connection closed.'),
//         shouldReconnect: () => true,
//     });

//     useEffect(() => {
//         if (lastJsonMessage !== null) {
//             const image = new Image();
//             image.src = `data:image/jpeg;base64,${lastJsonMessage.image}`;
//             setFaceDetected(lastJsonMessage.face_detected);
//             image.onload = () => {
//                 const canvas = canvasRef.current;
//                 const ctx = canvas.getContext('2d');
//                 ctx.clearRect(0, 0, canvas.width, canvas.height);
//                 ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
//             };
//         }
//     }, [lastJsonMessage]);

//     return (
//         <div>
//             <canvas ref={canvasRef} width={640} height={480} />
//             <div>{faceDetected ? 'Face detection = True' : 'Face detection = False'}</div>
//         </div>
//     );
// };

// export default WebSocketVideo;





import React, { useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';

const WebSocketVideo = () => {
    const canvasRef = useRef(null);
    const [faceDetected, setFaceDetected] = useState(false);
    const { lastJsonMessage } = useWebSocket("ws://localhost:8000/ws/facedetection/", {
        onOpen: () => console.log('WebSocket connection established.'),
        onClose: () => console.log('WebSocket connection closed.'),
        shouldReconnect: () => true,
    });

    useEffect(() => {
        if (lastJsonMessage !== null) {
            const image = new Image();
            image.src = `data:image/jpeg;base64,${lastJsonMessage.image}`;
            setFaceDetected(lastJsonMessage.face_detected);
            image.onload = () => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            };
        }
    }, [lastJsonMessage]);

    return (
        <div>
            <canvas ref={canvasRef} width={640} height={480} />
            <div>{faceDetected ? 'Face detection = True' : 'Face detection = False'}</div>
        </div>
    );
};

export default WebSocketVideo;
