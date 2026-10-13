import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Projects from './components/Projects.jsx'
import Blog from './components/Blog.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </BrowserRouter>
    {/*<App /> No longer needed after implementing Routes / react-router-dom*/}
  </StrictMode>,
)
