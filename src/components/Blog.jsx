import { useState } from 'react'
import Header from '../components/Header.jsx'
import { getAllPosts } from '../lib/posts.js'
import './Blog.css'

const posts = getAllPosts()

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    timeZone: 'UTC',
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
