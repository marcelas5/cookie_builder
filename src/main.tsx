import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CookieBuilder from './App.tsx'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <CookieBuilder>
        <CookieBuilder.SizeSelector options={["small", "medium", "large"]} />
        <CookieBuilder.ToppingSelector options={["cheese", "mushrooms", "tomato"]} />
        <CookieBuilder.Preview />
      </CookieBuilder>
    </App>
  </StrictMode>
);
