import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="902047965677-hbudjch49aghcfp9ri7a10d2p219hb98.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>,
)
