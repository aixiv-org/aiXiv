import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkProviderWrapper } from './ClerkProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProviderWrapper>
      <App />
    </ClerkProviderWrapper>
  </React.StrictMode>
);
