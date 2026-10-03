import meImg from './assets/grad.jpg'
import './App.css'
import './Landing.css'
import Navigation from './components/Navigation'
import Header from './components/Header'

function App() {
  return (
    <>
    <Header/>
      <main className="landing">
        <section id="intro" className="landing-intro">
          <img src={meImg} className="me-img" width="276" height="334" alt="" />
          <h1 className="intro-name">Jackson Seales</h1>
          <p className="intro-tagline">A bit about me.</p>
        </section>
        <Navigation />
      </main>
    </> 
  )
}

export default App
