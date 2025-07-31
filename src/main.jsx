import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AppRoutes from"./config/routes.jsx";
import { BrowserRouter} from 'react-router';
import { Toaster } from 'react-hot-toast';
import { ChatProvider } from './context/ChatContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <BrowserRouter> 
  <ChatProvider>
    <AppRoutes/> 
  </ChatProvider>
        </BrowserRouter>
      <Toaster position="top-center" />
  </StrictMode>,
);
