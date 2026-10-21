import { useRef, useState } from 'react'
import Header from '../components/Header'
import './Projects.css'

// List of projects, added as necessary.
// To add a new project, use the following skeleton:
/*{
  id: 'next-project',
  title: 'Project Name',
  tagline: 'One line describing it.',
  tech: ['Tech', 'Stack'],
  description: 'A couple sentences on what it does.',
  demo: 'link', // 'wasm' | 'link' | 'pdf' | 'gallery' | 'none',
  images: [{src: '/path', alt: '', caption: ''}, {src:, etc.}], (for galleries)
  demoUrl: 'https://example.com',
  repoUrl: 'https://github.com/your-username/project',
},*/
const projects = [
  {
    id: 'tetris',
    title: 'Example - Tetris',
    tagline: 'A classic Tetris clone written in C++, compiled to WebAssembly.',
    tech: ['C++', 'SDL2', 'Emscripten', 'WebAssembly'],
    description:
      'Originally a C++ build, compiled with Emscripten so it runs directly in the browser via canvas — no install required. Uses AWS Lambda for GET and POSTing scores from a AWS DynamoDB table.',
    demo: 'wasm',
    repoUrl: 'https://github.com/JacksonSeales22/WSL_Code_Projects/tree/main/Tetris',
  },
  {
    id: 'legacy-code-claude',
    title: 'Active Interview Service - Legacy Code',
    tagline: 'Modifying \'legacy code\' with Claude to evaluate effectiveness.',
    tech: ['Claude', 'Git', 'APIs', 'Workflows', 'Pipelines'],
    description: 'As a graduate course project, a team and I were given an existing project named AIS (Active Interview Service), which helped evaluate user\'s resume and give mock interviews. Given 16 main user stories, we divided the stories into GitHub issues. Using exclusively Claude Code, we attempted to implement features such as bias guardrails, OAuth, Interviewer and Candidate accounts, etc. By logging our results, we aimed to evaluate the effectiveness of an AI Agent in legacy code.',
    demo: 'pdf', // 'wasm' | 'link' | 'none'
    pdfUrl: '/projects/legacy-code-claude/claude-research.pdf',
    repoUrl: 'https://github.com/UCCS-CS4300-5300/Fall-25-CS-5300',
  },
  {
    id: 'car-shop',
    title: '1-Stop Car Shop',
    tagline: 'A consolidated site for all your car-shopping needs!',
    tech: ['Claude', 'Git', 'APIs', 'Workflows', 'Pipelines'],
    description: 'This free software combines “all present market listings” (simulated data) for new and used cars onto one website (by means of a large, constantly updating database of cars) with recently sold car prices included (if applicable) and provides a way to have your car’s price estimated instantly (with the help of MarketCheck’s Price Predictor API). This web service was created from scratch mainly as a team-based class project for CS3300 at the University of Colorado Colorado Springs by Computer Science students John Camargo, Jackson Seales, Kylie Sanchez, and Lucas Estevez',
    demo: 'gallery', // 'wasm' | 'link' | 'none'
    images: [{src: '/projects/car-shop/buypage.png', alt: 'Buy Page', caption: 'Lists market data for vehicles. Sortable by many factors and able to be saved for registered users.'},
      {src: '/projects/car-shop/price_estimator.png', alt: 'Price Estimator', caption: 'Using MarketCheck API to estimate the value of a given vehicle.'},
      {src: '/projects/car-shop/savedcars.png', alt: 'Saved Cars', caption: 'A users saved vehicles.'}],
    repoUrl: 'https://github.com/LucasJEstevez/CS3300-Semester-Project',
  },
  {
    id: 'react-site',
    title: 'React Website w/AWS (This!)',
    tagline: 'WIP',
    tech: ['Claude', 'Git', 'APIs', 'Workflows', 'Pipelines'],
    description: '',
    demo: 'gallery', // 'wasm' | 'link' | 'none'
    images: [{src: '/projects/react-site/aws_portfolio_site_architecture.png', alt: '', caption: ''},],
    repoUrl: 'https://github.com/JacksonSeales22/Portfolio_Website',
  },
]

function TetrisDemo() {
  const [loaded, setLoaded] = useState(false)
  const frameRef = useRef(null)

  return (
    <div className="demo-frame">
      {!loaded && (
        <div className="demo-placeholder">
          <p>Arrow keys to move, Z to rotate, X to hard drop.</p>
          <button className="btn btn-purple" onClick={() => setLoaded(true)}>
            Load game
          </button>
        </div>
      )}
      {loaded && (
        <iframe
          ref={frameRef}
          className="demo-iframe"
          src="/games/tetris/tetris.html"
          title="Tetris"
          onLoad={() => frameRef.current?.contentWindow?.focus()}
        />
      )}
    </div>
  )
}

// PDF preview. Loads only when asked
// "Open PDF" link that opens the file in a new tab
function PdfDemo({ url, title }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="demo-frame">
      {!loaded && (
        <div className="demo-placeholder">
          <p>Preview the PDF here, or open it in a new tab.</p>
          <button className="btn btn-purple" onClick={() => setLoaded(true)}>
            View PDF
          </button>
        </div>
      )}
      {loaded && <iframe className="demo-pdf" src={url} title={title} />}
    </div>
  )
}

// Screenshot carousel with a caption under each image. Buttons, or the left/right arrow keys
function GalleryDemo({ images }) {
  const [index, setIndex] = useState(0)
  const count = images?.length ?? 0
  if (count === 0) return null

  const current = images[index]
  const go = (delta) => setIndex((i) => (i + delta + count) % count)

  //Thank you Claude
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    }
  }

  return (
    <div
      className="demo-frame gallery"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-roledescription="carousel"
      aria-label="Project screenshots"
    >
      <div className="gallery-stage">
        <img src={current.src} alt={current.alt || current.caption || ''} />
        {count > 1 && (
          <>
            <button className="gallery-arrow gallery-prev" onClick={() => go(-1)} aria-label="Previous image">
              ‹
            </button>
            <button className="gallery-arrow gallery-next" onClick={() => go(1)} aria-label="Next image">
              ›
            </button>
          </>
        )}
      </div>

      <div className="gallery-caption">
        <p>{current.caption}</p>
        {count > 1 && (
          <span className="gallery-count">
            {index + 1} / {count}
          </span>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card-header">
        <h2>{project.title}</h2>
        <p className="project-tagline">{project.tagline}</p>
      </div>

      <ul className="project-tech">
        {project.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <p className="project-description">{project.description}</p>

      {project.demo === 'wasm' && <TetrisDemo />}
      {project.demo === 'pdf' && <PdfDemo url={project.pdfUrl} title={`${project.title} (PDF)`} />}
      {project.demo === 'gallery' && <GalleryDemo images={project.images} />}

      <div className="project-links">
        {project.demoUrl && (
          <a className="btn btn-purple" href={project.demoUrl} target="_blank" rel="noreferrer">
            View demo
          </a>
        )}
        {project.demo === 'pdf' && project.pdfUrl && (
          <a className="btn btn-purple" href={project.pdfUrl} target="_blank" rel="noreferrer">
            Open PDF
          </a>
        )}
        {project.repoUrl && (
          <a className="btn btn-ghost" href={project.repoUrl} target="_blank" rel="noreferrer">
            Source
          </a>
        )}
      </div>
    </article>
  )
}

function Projects() {
  return (
    <>
      <Header />
      <main className="projects-page">
        <section className="projects-intro">
          <h1 style={{ marginBottom: '40px' }}>Highlighted Projects</h1>
          <p>Code I've built. Some are playable, some are simply documented.</p>
        </section>

        <section className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      </main>
    </>
  )
}

export default Projects
