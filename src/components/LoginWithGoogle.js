import React from "react";
import { GoogleLogin } from "react-google-login";
import { useDispatch } from "react-redux";
import {FcGoogle} from "react-icons/fc"
import { signinGoogle } from "../store/auth";

const LoginWithGoogle = () => {
	const dispatch = useDispatch();

	const handleSuccess = async ({profileObj}) => dispatch(signinGoogle(profileObj))

	const handleFailure = (responseGoogle) => {
		console.log(responseGoogle);
	};
	return (
		<GoogleLogin
			clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
			render={renderProps => (
		      <button onClick={renderProps.onClick} disabled={renderProps.disabled} 
		      className="btn btn-primary w-100"><FcGoogle className="mx-2"/> Login with Google</button>
		    )}
			buttonText="Login with Google"
			onSuccess={handleSuccess}
			onFailure={handleFailure}
			cookiePolicy={"single_host_origin"}
		/>
	);
};

export default LoginWithGoogle;
