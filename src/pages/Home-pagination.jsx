import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, setCurrentPage } from "./posts/postSlice.js";
import { useEffect } from "react";

function Home() {
  const { status } = useSelector((state) => state.auth);
  const {
    posts,
    status: postStatus,
    currentPage,
    postsPerPage,
  } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => dispatch(setCurrentPage(pageNumber));

  // Calculate total pages
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <>
      <h1 className="title">Latest Posts</h1>

      {(status === "loading" || postStatus === "loading") && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
          <ClipLoader size={100} />
        </div>
      )}

      {currentPosts.length > 0 ? (
        <>
          {currentPosts.map((post) => (
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
          ))}

          {/* Simple Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === number ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {number}
                </button>
              ),
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>There are no posts</p>
      )}
    </>
  );
}

export default Home;
