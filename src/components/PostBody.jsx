import ReactMarkdown from 'react-markdown'

function PostBody({ markdown }) {
  return (
    <div className="post-body">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  )
}

export default PostBody