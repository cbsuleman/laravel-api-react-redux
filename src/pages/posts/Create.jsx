import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "./postSlice.js";
import { useNavigate } from "react-router-dom";

function Create() {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const { errors, status } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await dispatch(createPost(formData));
    if (createPost.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div>
      <>
        <h1 className="title">Create a new post</h1>

        <form className="w-1/2 mx-auto space-y-6" onSubmit={handleCreate}>
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
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
            />
            {errors.body && <p className="error">{errors.body}</p>}
          </div>

          <button className="primary-btn">Create</button>
        </form>
      </>
    </div>
  );
}

export default Create;
