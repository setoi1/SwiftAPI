import "./css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useContext } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Header } from "../../Types";
import { ToastContainer } from "react-toastify";
import { SignedInContext } from "../../App";
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>("");
  const { signedIn, setSignedIn } = useContext(SignedInContext);

  const headerLinks = [
    {
      page: "Login",
      href: "/login",
      showWhenLoggedIn: false,
    },
    {
      page: "Register",
      href: "/register",
      showWhenLoggedIn: false,
    },
    {
      page: "Marketplace",
      href: "/marketplace",
      showWhenLoggedIn: true,
    },
    {
      page: "Dashboard",
      href: "/dashboard",
      showWhenLoggedIn: true,
    },
    {
      page: "Settings",
      href: "/settings",
      showWhenLoggedIn: true,
    },
  ] as Header[];

  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);  
  };

  const handleSearch = (e: string) => {
    if (e.length > 0 && e.length < 256) {
      navigate(`/marketplace?q=${searchValue}`);
      //eslint-disable-next-line
      location.reload();
    }
  };

  const handleEnterSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(searchValue);
  };

  const handleLogout = () => {
    navigate("/");
    axios({
      method: "POST",
      withCredentials: true,
      url: "/api/user/logout"
    })
    .then((res) => {
      console.log(res);
      setSignedIn(false);
      navigate("/");
    })
    .catch((err) => {
      console.log(err);
    })
  }

  return (
    <div className="navbar">
      <ToastContainer />
      <header className="navbar-content-container">
        <Link to={"/"} className="header-img-link">
          <img src="/swapi.png" alt="SwiftAPI" />
        </Link>
        <div className="navbar-search">
          <input
            type="text"
            className="navbar-search-field"
            placeholder="Search APIs"
            maxLength={255}
            value={searchValue}
            onChange={handleSearchValueChange}
            onKeyDown={handleEnterSearch}
          />
          <button
            type="submit"
            className="navbar-search-button"
            onClick={() => handleSearch(searchValue)}
          >
            <AiOutlineSearch color="black" size="22px" />
          </button>
        </div>
        <ul className="navbar-links">
          {signedIn && (
            <Link key={"Create"} to={"/list"} className="navbar-link create">
              <li>{"Create"}</li>
            </Link>
          )}
          {headerLinks
            .filter((header) => header.showWhenLoggedIn === signedIn)
            .map((value: Header) => {
              return (
                <Link key={value.page} to={value.href} className="navbar-link">
                  <li>{value.page}</li>
                </Link>
              );
            })}
          {signedIn && (
            <Link key={"Logout"} to={"/logout"} onClick={handleLogout} className="navbar-link">
              <li>{"Logout"}</li>
            </Link>
          )}
        </ul>
      </header>
    </div>
  );
};

export default Navbar;
