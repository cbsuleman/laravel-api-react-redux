import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "./posts/postSlice.js";
import { useEffect } from "react";

function Home() {
  const { status } = useSelector((state) => state.auth);
  const { posts, status: postStatus } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  return (
    <>
      <h1 className="title">Latest Posts</h1>
      {status === "loading" ||
        (postStatus === "loading" && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
            <ClipLoader size={100} />
          </div>
        ))}

      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="mb-4 p-4 border rounded-md border-dashed border-slate-400"
          >
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h2 className="font-bold text-2xl">{post.title}</h2>
                <small className="text-xs text-slate-600">
                  Created by {post.user.name} on{" "}
                  {new Date(post.created_at).toLocaleTimeString()}
                </small>
              </div>
              <Link
                to={`/posts/${post.id}`}
                className="bg-blue-500 text-white text-sm rounded-lg px-3 py-1"
              >
                Read more
              </Link>
            </div>
            <p>{post.body}</p>
          </div>
        ))
      ) : (
        <p>There are no posts</p>
      )}
    </>
  );
}

export default Home;
