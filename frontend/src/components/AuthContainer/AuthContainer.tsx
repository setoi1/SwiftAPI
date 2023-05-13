import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignedInContext } from "../../App";
import "./Auth.css";

const AuthContainer = (props: {form: any}) => {
    const navigate = useNavigate();
    const loggedIn = useContext(SignedInContext);
    useEffect(() => {
        // eslint-disable-next-line
        if(loggedIn.signedIn)  navigate(window.location.pathname)
    }, [loggedIn]);
    return(
        <div className="container">
            <div className="form-container">
                {props.form}
            </div>
        </div>
    )
}

export default AuthContainer;