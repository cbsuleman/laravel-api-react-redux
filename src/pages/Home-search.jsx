import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  setCurrentPage,
  setPostsPerPage,
  setSearchTerm,
} from "./posts/postSlice.js";
import { useEffect } from "react";

function Home() {
  const { status } = useSelector((state) => state.auth);
  const {
    posts,
    status: postStatus,
    currentPage,
    postsPerPage,
    searchTerm,
  } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => dispatch(setCurrentPage(pageNumber));

  const handlePostsPerPageChange = (event) => {
    dispatch(setPostsPerPage(Number(event.target.value)));
  };

  const handleSearch = (e) => dispatch(setSearchTerm(e.target.value));

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <>
      <div className="flex flex-col gap-4 mb-4">
        <h1 className="title">Latest Posts</h1>

        <div className="flex justify-between items-center">
          {/* Search input */}

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="px-3 py-1 rounded border w-64"
            placeholder="Search posts..."
          />

          {/* Posts per page selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm">Posts per page:</label>
            <select
              value={postsPerPage}
              onChange={handlePostsPerPageChange}
              className="border rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>

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

          <div className="flex justify-center gap-2 my-4">
            <button
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 border rounded ${currentPage === number ? "bg-blue-500 text-white" : ""}`}
                >
                  {number}
                </button>
              ),
            )}

            <button
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
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
