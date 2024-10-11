import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
// import { useContext } from "react";
// import { UserInfoContext } from "../../userInfo/UserInfoProvider";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, User } from "tweeter-shared";
// import { Buffer } from "buffer";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/userInfoHook";
import { RegisterPresenter, RegisterView } from "../../../presenters/RegisterPresenter";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFileExtension, setImageFileExtension] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  // const getFileExtension = (file: File): string | undefined => {
  //   return file.name.split(".").pop();
  // };

  const listener: RegisterView = {
    authenticate: (user: User, authToken: AuthToken) => {updateUserInfo(user, user, authToken, rememberMe)},
    navigateTo: (url: string) => {navigate(url)},
    displayErrorMessage: displayErrorMessage,
    setImageUrl: setImageUrl,
    setImageBytes: setImageBytes,
    setImageFileExtension: setImageFileExtension,
  }

  

  const [presenter] = useState(new RegisterPresenter(listener));

  const checkSubmitButtonStatus = (): boolean => {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !imageFileExtension
    );
  };

  const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doRegister();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    presenter.handleImageFile(file);
  };

  const doRegister = async () => {
    // try {
    //   setIsLoading(true);
      presenter.doRegister(firstName, lastName, alias, password, imageBytes, imageFileExtension);
    // } finally {
    //   setIsLoading(false);
    // }

    // try {
    //   setIsLoading(true);

    //   const [user, authToken] = await register(
        // firstName,
        // lastName,
        // alias,
        // password,
        // imageBytes,
        // imageFileExtension
    //   );

    //   updateUserInfo(user, user, authToken, rememberMe);
    //   navigate("/");
    // } catch (error) {
    //   displayErrorMessage(
    //     `Failed to register user because of exception: ${error}`
    //   );
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // const register = async (
  //   firstName: string,
  //   lastName: string,
  //   alias: string,
  //   password: string,
  //   userImageBytes: Uint8Array,
  //   imageFileExtension: string
  // ): Promise<[User, AuthToken]> => {
  //   // Not neded now, but will be needed when you make the request to the server in milestone 3
  //   const imageStringBase64: string =
  //     Buffer.from(userImageBytes).toString("base64");

  //   // TODO: Replace with the result of calling the server
  //   const user = FakeData.instance.firstUser;

  //   if (user === null) {
  //     throw new Error("Invalid registration");
  //   }

  //   return [user, FakeData.instance.authToken];
  // };

  const inputFieldGenerator = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => setLastName(event.target.value)}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>
        {/* <AuthenticationFields loginOrRegister={doRegister} setAlias={setAlias} setPassword={setPassword} checkSubmitStatus={checkSubmitButtonStatus}/> */}
        <AuthenticationFields loginOrRegister={registerOnEnter} setAlias={setAlias} setPassword={setPassword} />
        {/* <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            placeholder="name@example.com"
            onKeyDown={registerOnEnter}
            onChange={(event) => setAlias(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="passwordInput"
            placeholder="Password"
            onKeyDown={registerOnEnter}
            onChange={(event) => setPassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div> */}
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onKeyDown={registerOnEnter}
            onChange={handleFileChange}
          />
          <label htmlFor="imageFileInput">User Image</label>
          <img src={imageUrl} className="img-thumbnail" alt=""></img>
        </div>
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Algready registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doRegister}
    />
  );
};

export default Register;
