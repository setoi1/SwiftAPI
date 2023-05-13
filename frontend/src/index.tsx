import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { RequireAuth } from "./components/RequireAuth";
import Home from "./components/Home/Home";
import List from "./components/Dashboard/List";
import Dashboard from "./components/Dashboard/Dashboard";
import Marketplace from "./components/Marketplace/Marketplace";
import Product from "./components/Home/Product";
import AuthContainer from "./components/AuthContainer/AuthContainer";
import SettingsModal from "./components/Settings/SettingsModal";
import Success from "./components/Home/Success";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Login/LoginForm";
import RegisterForm from "./components/Register/RegisterForm";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route
          path="register"
          element={
              <AuthContainer form={<RegisterForm />} />
          }
        />
        <Route
          path="login"
          element={
              <AuthContainer form={<LoginForm />} />
          }
        />
        <Route index element={<Home />} />
        <Route
          path="list"
          element={
            <RequireAuth>
              <List />
            </RequireAuth>
          }
        />
        <Route path="marketplace" element={<Marketplace />} />
        <Route
          path="dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="settings"
          element={
            <RequireAuth>
              <SettingsModal />
            </RequireAuth>
          }
        />
        <Route
          path="success"
          element={
              <Success />
          }
        />
        <Route path="api/:id" element={<Product />} />
      </Route>
    </Routes>
  </BrowserRouter>
);