import "./css/Loading.css";

const LoadingAnimation = () => {
    return (
        <div className="loadingContainer">
            <div className="loadingBar"></div> 
            <div className="loadingBar stagnate-2"></div> 
            <div className="loadingBar stagnate-4"></div> 
            <div className="loadingBar stagnate-6"></div> 
        </div>
    )
}

export default LoadingAnimation;