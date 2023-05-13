import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./css/Product.css";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    title: "",
    user: "",
    description: "",
    price: "",
    stripeProductID: "",
    path: "",
    proxy_accessor: "",
  });
  const [personalToken, setPersonalToken] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isPublic, setPublic] = useState(false);

  useEffect(() => {
    fetch("/api/api/retrieve", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        ID: id,
      }),
    })
      .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
      .then(function (obj) {
        if (obj.status === 200) {
          setData(obj.body.data);
          setPublic(obj.body.data.visible);
          setLoading(false);
        } else {
          navigate("/");
        }
      });
    checkOwnership();
    checkSubscription();
  }, [id, navigate]);

  const checkOwnership = () => {
    axios.post("/api/api/is-owner", {data: {api_id: id}}).then((response) => {
      setIsOwner(response.data.owner);
      console.log("is owner? " + response.data.owner)
    })
  }

  const checkSubscription = () => {
    axios.post("/api/api/is-subscribed", {data: {api_id: id}}).then((res) => {
      console.log(res.data.key);
      setPersonalToken(res.data.key)
    })
  }

  const toggleVisibility = (e: any) => {
    e.preventDefault();
    axios.post("/api/api/change-vis", {data: {api_id: id, toggleStatus: !isPublic}})
    .then((res) => {
      if(res.status === 200) setPublic(res.data.visible);
    })
  }

  const onSubscribeClick = async () => {
    await checkOwnership();
    fetch("/api/subscription/subscribe", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        stripeProductID: data.stripeProductID,
      }),
    })
      .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
      .then(function (obj) {
        if (obj.status === 303) {
          window.location.href = obj.body.url;
        } else {
          toast.error(obj.body.message);
        }
      });
  };

  return !loading ? (
    <div className="product">
      <ToastContainer />

      <div className="product_area">
        <hr className="separator" />
        <div className="product_title">
          <h2>{data.title}</h2>
          <h5>Developed by: {data.user}</h5>
        </div>

        <p>{data.description}</p>
        <div className="usage">
          <p>GET - {data.path.startsWith("/") ? data.path : `/${data.path}`}</p>
          <p>Headers:</p>
          <p>api_access_token: {personalToken}</p>
          <p>api_unique_id: {data.proxy_accessor}</p>
        </div>
        <div className="product_pricing">
          <h4>${data.price} / month</h4>
          {!isOwner ? <button onClick={onSubscribeClick}>Subscribe</button>
          : <div className="toggleStuff">
              <input type="checkbox" checked={isPublic || false} onChange={toggleVisibility} />
              <div style={{color: "white"}}>Toggle Public Visibility</div>
            </div>}
        </div>
        <hr className="separator" />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Product;
