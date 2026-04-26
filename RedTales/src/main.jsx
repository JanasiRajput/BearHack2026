import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-dpgwg8lk3nj72ovn.ca.auth0.com"
      clientId="fcNFGX8qhL1jWXP4CaMu99BC5QY43mFF"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://dev-dpgwg8lk3nj72ovn.ca.auth0.com/api/v2/",
        scope: "openid profile email https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/calendar",
        connection: 'google-oauth2',
        prompt: 'consent',
        access_type: 'offline'
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
