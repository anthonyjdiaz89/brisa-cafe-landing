import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './nucleo/tokens.css';
import Producto360 from './plantillas/Producto360.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Producto360 />
  </StrictMode>
);
