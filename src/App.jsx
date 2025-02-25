import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import Create from "./pages/posts/Create.jsx";
import Show from "./pages/posts/Show.jsx";
import Update from "./pages/posts/Update.jsx";
import { useSelector } from "react-redux";
import NotFound from "./NotFound.jsx";

function App() {
  const { token, user } = useSelector((state) => state.auth);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="/register"
            element={token ? <Navigate to="/" replace /> : <Register />}
          />
          <Route
            path="/login"
            element={token ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/create"
            element={!token ? <Navigate to="/" replace /> : <Create />}
          />
          <Route path="/posts/:id" element={<Show />} />
          <Route
            path="/posts/update/:id"
            element={!token ? <Navigate to="/" replace /> : <Update />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
