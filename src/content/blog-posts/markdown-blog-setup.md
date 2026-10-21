---
title: "Moving this blog from a hardcoded array to markdown files"
date: "2026-10-16"
excerpt: "How I replaced the posts const in my React blog page with a folder of markdown files."
---

## The goal

- One `.md` file per post, in a folder
- Metadata (title, date, excerpt) at the top of each file
- Multiple paragraphs, headings, code, and images in the body
- The newest post shows as "featured" without me ordering anything by hand

## Writing a post

Each file starts with a small frontmatter block, then regular markdown:

```markdown
---
title: "Getting collision detection right"
date: "2026-09-26"
excerpt: "Wall kicks turned out to be the hard part."
---

First paragraph.

![Alt text](/blog-images/wall-kicks.png)

## A heading

More text.
```

The filename becomes the URL slug, so `my-first-post.md` is served at `/blog/my-first-post`.

## Loading the posts

`src/lib/posts.js` uses Vite's `import.meta.glob` to pull in every markdown file as raw text, splits off the frontmatter, and sorts by date.

```javascript
import fm from 'front-matter'

const modules = import.meta.glob('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const posts = Object.entries(modules)
  .map(([path, raw]) => {
    try {
      const { attributes, body } = fm(raw)
      return {
        slug: path.split('/').pop().replace('.md', ''),
        ...attributes,
        body,
      }
    } catch (err) {
      console.error(`Failed to parse ${path}:`, err)
      return null
    }
  })
  .filter(Boolean)
  .sort((a, b) => new Date(b.date) - new Date(a.date))

export function getAllPosts() {
  return posts
}

export function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug)
}
```

`Blog.jsx` now just calls `getAllPosts()` instead of defining its own array. The rest of the component didn't change.

## Rendering the body

The post page uses `react-markdown` to turn the body string into HTML:

```javascript
import ReactMarkdown from 'react-markdown'

function PostBody({ markdown }) {
  return (
    <div className="post-body">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  )
}
```

`BlogPost.jsx` looks up the post by slug from the URL and passes `post.body` in as the `markdown` prop. A route like `/blog/:slug` points at it.

## Adding a post now

1. Create a new `.md` file in `src/content/posts/`
2. Add the frontmatter with a quoted title, quoted date, and excerpt
3. Write the post, with images in `public/blog-images/`
4. Save. It shows up as the featured post if it's the newest

No code changes, which was the whole point. Makes it super easy to move files over from my Obsidian vault with minimal changes.