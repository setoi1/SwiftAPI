import "./css/ApiCard.css";
import { useNavigate } from "react-router-dom";
import { ApiCardData } from "../../Types";

const ApiCard = (props: {data: ApiCardData}) => {
  const navigate = useNavigate();
  
  return (
    <div className="api-card" onClick={(e) => navigate(`/api/${props.data.api_id}`)}>
      <div className="api-card-image">img placeholder</div>
      <div className="api-card-content">
        <div className="api-card-title">{props.data.api_name}</div>
        {props.data.api_access_token ? (<div className="api-card-title">API Key: {props.data.api_access_token}</div>) : <></>} 
        <div className="api-card-description">{props.data.api_description}</div>
      </div>
    </div>
  );
};

export default ApiCard;
