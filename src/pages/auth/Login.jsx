import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loginUser } from "./authSlice.js";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { user, status, errors } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(result)) {
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
      <h1 className="title">Login to your account</h1>

      <form onSubmit={handleLogin} className="w-1/2 mx-auto space-y-6">
        <div>
          <input
            type="text"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && <p className="error">{errors.email}</p>}
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
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button className="primary-btn">Login</button>
      </form>
    </>
  );
}

export default Login;
