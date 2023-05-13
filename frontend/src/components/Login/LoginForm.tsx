import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SignedInContext } from '../../App';

// eslint-disable-next-line no-useless-escape
const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

const validateEmail = (e: string) => {
  return emailRegex.test(e);
}

const validatePw = (p: string) => {
  return p.length >= 3;
}

const LoginForm = () => {
  let navigate = useNavigate();
  
  const [loginValues, setLoginValues] = useState({email: "", password: ""})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLoginValues({
      ...loginValues,
      [e.target.name]: value,
    })
  }
  
  const {setSignedIn} = useContext(SignedInContext)

  const handleLoginOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateEmail(loginValues.email) || !validatePw(loginValues.password)) {
      toast.error("Please check your login credentials and try again");
      return;
    }
    
    axios({
      method: "POST",
      data: loginValues,
      withCredentials: true,
      url: "/api/user/login" 
    })
      .then(res => {
        setSignedIn(true);
        navigate("/dashboard");
      })
      .catch(err => {
        console.log(err);
        toast.error('Login failed! Check your email or password, then try again.');
      }); 
  };

  return (
    <form>
      <div className="list_title">
       <h1>Login</h1> 
      </div>
      
      <div className="list_form">
        <label>Email</label>
        <input type="text" id="email" name="email" value={loginValues.email} onChange={handleInputChange} maxLength={255}/>
        <label>Password</label>
        <input type="password" id="password" value={loginValues.password} onChange={handleInputChange} name="password" />
        <div className="list_form_button">
          <p style={{padding: "0px"}}>Don't have an account? <a href="/register">Register</a></p>
          <button
            onClick={handleLoginOnClick}
            className="submit-button"
            name="api-list-button"
          >
            Login
          </button>
        </div>
      </div>
    </form>
 );
}

export default LoginForm;