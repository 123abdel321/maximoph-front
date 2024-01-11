const accessToken = JSON.parse(localStorage.getItem("authUser")) ? JSON.parse(localStorage.getItem("authUser")).session_token : "";

export default accessToken

