import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { deletePost, fetchPost } from "./postSlice.js";
import { fetchUser } from "../auth/authSlice.js";
import { ClipLoader } from "react-spinners";

function Show() {
  const { id } = useParams();
  const { post, status } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();
    const result = await dispatch(deletePost(id));
    if (deletePost.fulfilled.match(result)) {
      navigate("/");
    }
  };

  useEffect(() => {
    if (!user) dispatch(fetchUser());
    dispatch(fetchPost(id));
  }, []);

  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
        <ClipLoader size={100} />
      </div>
    );
  }
  return (
    <>
      {post ? (
        <div className="mt-4 p-4 border rounded-md border-dashed border-slate-400">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h2 className="font-bold text-2xl">{post.title}</h2>
              <small className="text-xs text-slate-600">
                Created by {post.user.name} on{" "}
                {new Date(post.created_at).toLocaleTimeString()}
              </small>
            </div>
          </div>
          <p>Post body</p>
          {user && post.user_id === user.id && (
            <div className="flex items-center justify-end gap-4">
              <Link
                to={`/posts/update/${id}`}
                className="bg-green-500 text-white text-sm rounded-md px-3 py-1"
              >
                Update
              </Link>

              <form onSubmit={handleDelete}>
                <button className="bg-red-500 text-white text-sm rounded-md px-3 py-1 cursor-pointer">
                  Delete
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <p className="title">Post not found</p>
      )}
    </>
  );
}

export default Show;
