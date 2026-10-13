import { useState } from 'react'
import Header from '../components/Header'
import './Blog.css'

// Swap this for a fetch() against a posts.json / API once you have one.
// Newest post should stay first — it's what renders as "featured."
const posts = [
  {
    slug: 'tetris-collision-detection',
    title: 'Getting collision detection right in the Tetris build',
    date: '2026-09-26',
    excerpt:
      'Spent the week on piece rotation edge cases — wall kicks turned out to be the hard part, not the collision check itself.',
    body: 'Full post content goes here once wired to real content.',
  },
  {
    slug: 'wasm-build-pipeline',
    title: 'Getting Emscripten into a GitHub Actions pipeline',
    date: '2026-09-18',
    excerpt:
      'Automating the C++ to WASM build step so it compiles on every push instead of me doing it locally and forgetting.',
    body: 'Full post content goes here once wired to real content.',
  },
  {
    slug: 'aws-static-site-setup',
    title: 'Standing up S3 + CloudFront for this site',
    date: '2026-09-02',
    excerpt:
      'Notes from setting up the static hosting pipeline, including the OAC bucket policy gotcha that cost me an afternoon.',
    body: 'Full post content goes here once wired to real content.',
  },
]

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function Blog() {
  const [visibleCount, setVisibleCount] = useState(4)

  const [featured, ...rest] = posts
  const archive = rest.slice(0, visibleCount)
  const hasMore = visibleCount < rest.length

  return (
    <>
      <Header />
      <main className="blog-page">
        <section className="blog-intro">
          <h1>Blog</h1>
          <p>Daily-ish notes on what I'm building and what I'm learning from it.</p>
        </section>

        {featured && (
          <section className="featured-post">
            <span className="post-label">Latest</span>
            <h2>{featured.title}</h2>
            <time className="post-date" dateTime={featured.date}>
              {formatDate(featured.date)}
            </time>
            <p className="post-excerpt">{featured.excerpt}</p>
            <a className="btn-read" href={`/blog/${featured.slug}`}>
              Read post
            </a>
          </section>
        )}

        <section className="archive">
          <h3 className="archive-heading">Previous posts</h3>
          <ul className="archive-list">
            {archive.map((post) => (
              <li key={post.slug} className="archive-item">
                <a href={`/blog/${post.slug}`}>
                  <span className="archive-title">{post.title}</span>
                  <time className="archive-date" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                </a>
              </li>
            ))}
          </ul>

          {hasMore && (
            <button className="btn-more" onClick={() => setVisibleCount((n) => n + 4)}>
              Show more posts
            </button>
          )}
        </section>
      </main>
    </>
  )
}

export default Blog
