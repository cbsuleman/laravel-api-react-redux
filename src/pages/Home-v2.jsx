import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  setCurrentPage,
  setPostsPerPage,
  setSearchTerm,
  setSorting,
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
    sortField,
    sortOrder,
  } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  // Filter posts based on search
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortField === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else {
      return sortOrder === "asc"
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at);
    }
  });

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => dispatch(setCurrentPage(pageNumber));

  // Change posts per page
  const handlePostsPerPageChange = (event) => {
    dispatch(setPostsPerPage(Number(event.target.value)));
  };

  // Handle search
  const handleSearch = (event) => {
    dispatch(setSearchTerm(event.target.value));
  };

  // Handle sort
  const handleSort = (field) => {
    dispatch(
      setSorting({
        field,
        order: field === sortField && sortOrder === "asc" ? "desc" : "asc",
      }),
    );
  };

  // Calculate total pages
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  return (
    <>
      <div className="flex flex-col gap-4 mb-4">
        <h1 className="title">Latest Posts</h1>

        <div className="flex justify-between items-center">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={handleSearch}
            className="border rounded px-3 py-1 w-64"
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

        {/* Sort buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSort("created_at")}
            className={`px-3 py-1 border rounded ${
              sortField === "created_at" ? "bg-blue-500 text-white" : ""
            }`}
          >
            Date{" "}
            {sortField === "created_at" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("title")}
            className={`px-3 py-1 border rounded ${
              sortField === "title" ? "bg-blue-500 text-white" : ""
            }`}
          >
            Title {sortField === "title" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {/* Rest of your existing JSX remains the same */}
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

          {/* Pagination */}
          <div className="flex justify-center gap-2 my-4">
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
        <p>No posts found</p>
      )}
    </>
  );
}

export default Home;
