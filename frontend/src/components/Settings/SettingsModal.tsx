import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/Settings.css";

const SettingsModal = () => {

  const handleSettingsUpdateOnClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    const currentPassword: HTMLInputElement = document.getElementById(
      "current-password"
    ) as HTMLInputElement;

    const password: HTMLInputElement = document.getElementById(
      "new-password"
    ) as HTMLInputElement;

    const confirmPassword: HTMLInputElement = document.getElementById(
      "confirm-password"
    ) as HTMLInputElement;

    if (password.value !== confirmPassword.value) {
      toast.error("Passwords do not match");
      return;
    }

    const data = {
      newPassword: password.value,
      currentPassword: currentPassword.value,
    };

    axios({
      method: "POST",
      data: data,
      withCredentials: true,
      url: "/api/settings/update",
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Password updated, please login again.");
        } else {
          toast.warning(res.data.message);
        }
      })
      .catch((err) => {
        toast.success(err.response.data.message);
      });
  };

  const settingsData = [
    {
      title: "Change Password",
      input: [
        {
          label: "Current Password",
          placeholder: "Current Password",
          type: "password",
          id: "current-password",
        },
        {
          label: "New Password",
          placeholder: "New Password",
          type: "password",
          id: "new-password",
        },
        {
          label: "Confirm Password",
          placeholder: "Confirm Password",
          type: "password",
          id: "confirm-password",
        },
      ],
      button: {
        label: "Save",
        onClick: (e: React.MouseEvent<HTMLButtonElement>) =>
          handleSettingsUpdateOnClick(e),
      },
    },
  ];

  return (
    <div className="settings-container">
      <ToastContainer />
      <div className="settings">
        {settingsData.map((val) => {
          return (
            <>
              <h3>{val.title}</h3>
              <div className="settings-input">
                {val.input.map((v) => {
                  return (
                    <>
                      <label>{v.label}</label>
                      <input
                        type={v.type}
                        placeholder={v.placeholder}
                        id={v.id}
                        name={v.id}
                      />
                    </>
                  );
                })}
                <div className="settings-button">
                  <button onClick={val.button.onClick}>
                    {val.button.label}
                  </button>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsModal;
