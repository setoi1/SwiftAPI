import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/ListDialog.css";

const ListDialog = (props: {token: string, api_unique_id: string}) => {

  let navigate = useNavigate();

  const closeDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/dashboard');
  }


  return (
    <dialog id="listDialog">
      <div className="list-dialog-steps">
        <h4>Your listing is almost done! Complete the next steps to finish listing your API</h4>
        <p>Here is your unique, personal API authentication key (don't share it or lose it):</p>
        <p>{props.token}</p>
        <p>Here is the unique identifier for this API, to be used by users:</p>
        <p>{props.api_unique_id}</p>
        <p>In order for your API to be listed you must authenticate with Swift API servers.</p>
        <p>To do this, you'll need to send a POST request to our servers in your server startup script.</p>
        <p>Send a POST request with the following information when your server boots up:</p>
        <p>POST swiftAPIurl.com/api/apistatus/auth</p>
        <p>Headers:</p>
        <p>api_access_token: YOUR_UNIQUE_TOKEN</p>
        <p>If successful, you will get a 200 OK response and your API will be listed on Swift API.</p>
        <p>If unsuccessful, you will get a 400 Bad Request response and you'll need to try again.</p>
      </div>
      <button id="closeButton" onClick={closeDialog}>Ok</button>
    </dialog>
  );
}

export default ListDialog;