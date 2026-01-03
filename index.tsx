
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to. Ensure <div id='root'></div> exists in index.html.");
}

// Remove the loader if it exists when the app starts mounting
const loader = document.getElementById('loader-container');
if (loader) {
    // We don't remove it immediately to allow React to render the first frame
    // but React's render will replace the children of #root anyway.
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
