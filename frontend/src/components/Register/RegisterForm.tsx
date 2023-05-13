import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = () => {
  const navigate = useNavigate();

  const [isDeveloper, setIsDeveloper] = useState<boolean>(false);
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDeveloper(!isDeveloper);
  }

  const handleRegistrationOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const email: HTMLInputElement = document.getElementById("email") as HTMLInputElement;

    if (email.value === "") {
      toast.error("Enter a valid email address.");
      return;
    }

    const username: HTMLInputElement = document.getElementById("username") as HTMLInputElement;

    if (username.value === "") {
      toast.error("Enter a username.");
      return;
    }

    const password: HTMLInputElement = document.getElementById("password") as HTMLInputElement;

    if (password.value === "") {
      toast.error("Enter a password.");
      return;
    }

    const data = {
      username: username.value,
      password: password.value,
      email: email.value,
      developer: isDeveloper,
    };

    axios({
      method: "POST",
      data: data,
      withCredentials: true,
      url: "/api/user/register"
    })
      .then(res => {
        console.log(res);
        toast.success('Registration complete!');
        navigate('/login');
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
        <div className="list_title">
          <h1>Register</h1>
        </div>
        <div className="list_form">
          <label>Email</label>
          <input type="text" id="email" name="email" />

          <label>Username</label>
          <input type="text" id="username" name="username" />

          <label>Password</label>
          <input type="password" id="password" name="password" />
          
          <label>Are you a developer?</label>
          <div onChange={handleRadioChange} className="register-radio">
            <input type="radio" value="Yes" name="developer" /> Yes
            <input type="radio" value="No" name="developer" /> No
          </div>
          
          <div className="list_form_button">
            <p style={{padding: "0px"}}>Already have an account? <a href="/login">Login</a></p>
            <button
              onClick={handleRegistrationOnClick}
              className="api-list-button"
              name="api-list-button"
            >
              Register
            </button>
          </div>
        </div>
    </div>

  );
}

export default RegisterForm;