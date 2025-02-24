import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchUser } from "../auth/authSlice.js";
import { fetchPost, updatePost } from "./postSlice.js";
import { ClipLoader } from "react-spinners";
import error from "eslint-plugin-react/lib/util/error.js";

function Update() {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const { id } = useParams();
  const { post, status, errors } = useSelector((state) => state.post);
  const {
    user,
    token,
    status: userStatus,
  } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchPost(id));
  }, []);
  useEffect(() => {
    if (post && user) {
      if (post.user_id !== user.id) {
        navigate("/");
        return;
      }

      setFormData({
        ...formData,
        title: post.title,
        body: post.body,
      });
    }
  }, [user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const result = await dispatch(updatePost({ formData, id }));
    if (updatePost.fulfilled.match(result)) {
      navigate("/");
    }
  };

  if (status === "loading" || userStatus === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
        <ClipLoader size={100} />
      </div>
    );
  }

  return (
    <>
      <h1 className="title">Update post</h1>

      <form className="w-1/2 mx-auto space-y-6" onSubmit={handleUpdate}>
        <div>
          <input
            type="text"
            placeholder="Post Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          {errors.title && <p className="error">{errors.title}</p>}
        </div>

        <div>
          <textarea
            rows="6"
            placeholder="Post Content"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          />
          {errors.body && <p className="error">{errors.body}</p>}
        </div>

        <button className="primary-btn">Update</button>
      </form>
    </>
  );
}

export default Update;
