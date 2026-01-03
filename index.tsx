
console.log("App is starting..."); // Debug log for deployment troubleshooting

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to. Ensure <div id='root'></div> exists in index.html.");
}

// Ensure the loader fades out or is replaced gracefully
const hideLoader = () => {
    const loader = document.getElementById('loader-container');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Small delay to ensure the first render is complete before hiding the loader
setTimeout(hideLoader, 100);
