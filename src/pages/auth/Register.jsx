import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearErrors, registerUser } from "./authSlice.js";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const dispatch = useDispatch();
  const { user, status, errors } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(result)) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    dispatch(clearErrors());
  }, []);

  return (
    <>
      <h1 className="title">Register a new account</h1>

      <form onSubmit={handleSubmit} className="w-1/2 mx-auto space-y-6">
        <div>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />
          {errors && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />
          {errors && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {errors && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm password"
            value={formData.password_confirmation}
            onChange={(e) =>
              setFormData({
                ...formData,
                password_confirmation: e.target.value,
              })
            }
          />
        </div>

        <button className="primary-btn">Register</button>
      </form>
    </>
  );
}

export default Register;
