// import { useState } from "react";

interface Props {
    // loginOrRegister: () => Promise<void>;
    setAlias: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    loginOrRegister: (event: React.KeyboardEvent<HTMLElement>) => void;

}

const AuthenticationFields = (props: Props) => {

    // const checkSubmitButtonStatus = (): boolean => {
    //     return !alias || !password;
    // };

    // const actionOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    //     if (event.key == "Enter" && !props.checkSubmitStatus()) {
    //       props.loginOrRegister;
    //     }
    // };

    return (
        <>
            <div className="form-floating">
                <input
                type="text"
                className="form-control"
                size={50}
                id="aliasInput"
                aria-label="alias"
                placeholder="name@example.com"
                // onKeyDown={actionOnEnter}
                onKeyDown={props.loginOrRegister}
                onChange={(event) => props.setAlias(event.target.value)}
                />
                <label htmlFor="aliasInput">Alias</label>
            </div>
            <div className="form-floating">
                <input
                type="password"
                className="form-control"
                id="passwordInput"
                aria-label="password"
                placeholder="Password"
                // onKeyDown={actionOnEnter}
                onKeyDown={props.loginOrRegister}
                onChange={(event) => props.setPassword(event.target.value)}
                />
                <label htmlFor="passwordInput">Password</label>
            </div>
        </>
    )
}

export default AuthenticationFields;