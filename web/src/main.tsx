import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ActivationGate } from './Activation';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ActivationGate><App /></ActivationGate>
  </React.StrictMode>,
);
