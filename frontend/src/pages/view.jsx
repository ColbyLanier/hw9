import {useEffect} from "react";
import {useState} from "react";
import {Link} from "react-router-dom";

export function View() {
  const [posts, setPosts] = useState([]);
  const [editingTitle, setEditingTitle] = useState(null);
  useEffect(() => {
    (async function () {
      const req = await fetch("http://localhost:3000/blog/");
      const json = await req.json();
      setPosts(json);
    })();
  }, []);
  async function deletePost(title) {
    const resp = fetch("http://localhost:3000/blog/delete-post/", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({title})
    });
    const json = await resp.json()
    setPosts(json);
  }
  async function editPost(title) {
    setEditingTitle(title);
  }
  return (
    <div>
      <Link to="/"> Home</Link>
      <div>
        {editingTitle&&
          <EditPost 
          title={editingTitle} 
          updatePosts={(json) => {
            setEditingTitle(null);
            setPosts(json);
            }}/>}
      </div>
      <div>
        {posts.map((post) => (
          <div
            key={post.title}
            style={{
              border: "2px solid",
              width: "50vw",
              margin: "auto",
              textAlign: "center",
            }}
          >
            <h2 style={{margin: "0.2rem"}}>{post.title}</h2>
            <div>{post.content}</div>
            <div>
              <button onClick={() => {
                editPost(post.title);
              }}>Edit</button>
              <button onClick={() => {
                deletePost(post.title);
              }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditPost({title: oldTitle, updatePosts}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const requestData = JSON.stringify({title, content, password, oldTitle});
    const headers = {"content-type": "application/json"};
    const resp = await fetch("http://localhost:3000/blog/edit-post", {
      method: "post",
      headers,
      body: requestData,
    });

    const json = await resp.json();

    if (json.error) {
      setError(json.error);
      return;
    }

    updatePosts(json)
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>Editing Post: {oldTitle}</div>
      <input
        placeholder="Edit Title"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
      />
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
        ></textarea>
      </div>
      <div>
        <input
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          type="password"/>
      </div>
      <button>Post</button>
      {error&&<div>{error}</div>}
    </form>
  );
}