import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import PostBody from '../components/PostBody.jsx'
import { getPostBySlug } from '../lib/posts.js'
import './Blog.css'

function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <>
        <Header />
        <main className="blog-page">
          <p>Post not found. <Link to="/blog">Back to blog</Link></p>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="blog-page">
        <article>
          <h1>{post.title}</h1>
          <time className="post-date" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
            })}
          </time>
          <PostBody markdown={post.body} />
        </article>
      </main>
    </>
  )
}

export default BlogPost
