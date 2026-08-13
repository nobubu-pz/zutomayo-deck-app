import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { CollectionProvider } from './contexts/CollectionContext'
import { DeckProvider } from './contexts/DeckContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CollectionProvider>
        <DeckProvider>
          <App />
        </DeckProvider>
      </CollectionProvider>
    </AuthProvider>
  </StrictMode>,
)
