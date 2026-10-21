import fm from 'front-matter'

const modules = import.meta.glob('../content/blog-posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const { attributes, body } = fm(raw)
    return {
      slug: path.split('/').pop().replace('.md', ''),
      ...attributes,
      body, // now a markdown string
    }
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date))

export function getAllPosts() {
  return posts
}

export function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug)
}