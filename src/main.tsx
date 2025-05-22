import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CookieBuilder from './App.tsx'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <CookieBuilder>
        <h1 className="cookie-builder-headline">
          🍪 Chocolate Chip Cookie Builder
        </h1>
        <CookieBuilder.SizeSelector options={["small", "medium", "large"]} />
        <CookieBuilder.ToppingSelector options={["candy", "zigzag", "sprinkles"]} />
        <CookieBuilder.Preview />
      </CookieBuilder>
    </App>
  </StrictMode>
);
