import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
// import { useContext } from "react";
// import { UserInfoContext } from "../../userInfo/UserInfoProvider";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, User } from "tweeter-shared";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/userInfoHook";
import { LoginPresenter } from "../../../presenters/LoginPresenter";
import { AuthenticateView } from "../../../presenters/AuthenticatePresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const listener: AuthenticateView = {
    authenticate: (user: User, authToken: AuthToken) => {updateUserInfo(user, user, authToken, rememberMe)},
    navigateTo: (url: string) => {navigate(url)},
    displayErrorMessage: displayErrorMessage,
  }

  const [presenter] = useState(props.presenter ?? new LoginPresenter(listener));

  const doLogin = async () => {
    presenter.doLogin(alias, password, props.originalUrl);

    
    // try {
    //   setIsLoading(true);

    //   const [user, authToken] = await login(alias, password);

    //   updateUserInfo(user, user, authToken, rememberMe);

    //   if (!!props.originalUrl) {
    //     navigate(props.originalUrl);
    //   } else {
    //     navigate("/");
    //   }
    // } catch (error) {
    //   displayErrorMessage(
    //     `Failed to log user in because of exception: ${error}`
    //   );
    // } finally {
    //   setIsLoading(false);
    // }
  };



  // const login = async (
  //   alias: string,
  //   password: string
  // ): Promise<[User, AuthToken]> => {
  //   // TODO: Replace with the result of calling the server
  //   const user = FakeData.instance.firstUser;

  //   if (user === null) {
  //     throw new Error("Invalid alias or password");
  //   }

  //   return [user, FakeData.instance.authToken];
  // };

  const inputFieldGenerator = () => {
    return (
      <>
        {/* <AuthenticationFields loginOrRegister={doLogin} setAlias={setAlias} setPassword={setPassword} checkSubmitStatus={checkSubmitButtonStatus}/> */}

        <AuthenticationFields loginOrRegister={loginOnEnter} setAlias={setAlias} setPassword={setPassword} />

        {/* <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            placeholder="name@example.com"
            onKeyDown={loginOnEnter}
            onChange={(event) => setAlias(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control bottom"
            id="passwordInput"
            placeholder="Password"
            onKeyDown={loginOnEnter}
            onChange={(event) => setPassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div> */}
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
