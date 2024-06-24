
// =-------Code with socket - io ---------------------


import React from 'react';
import FaceDetection from './components/FaceDetection';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Face Detection App</h1>
                <FaceDetection />
            </header>
        </div>
    );
}

export default App;










// ----------------- old code without socket  io 0------------------
// import React from 'react';
// import WebcamVideo from './components/WebcamVideo';
// import WebSocketVideo from './components/WebSocketVideo';
// import './App.css';

// const App = () => {
//     return (
//         <div className="App">
//             <h1>Live Face Detection</h1>
//             <div className="video-container">
//                 <div>
//                     <h2>Front-end Video</h2>
//                     <WebcamVideo />
//                 </div>
//                 <div>
//                     <h2>Processed Video</h2>
//                     <WebSocketVideo />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default App;
