import { User, AuthToken, FakeData, GetUserRequest, TweeterRequest, LoginRequest, LogoutRequest, RegisterRequest } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
  private currServerFacade = new ServerFacade();

    public async login (
        alias: string,
        password: string
      ): Promise<[User, AuthToken]> {
        // TODO: Replace with the result of calling the server
        // const user = FakeData.instance.firstUser;
    
        // if (user === null) {
        //   throw new Error("Invalid alias or password");
        // }
    
        // return [user, FakeData.instance.authToken];
        let request: LoginRequest = {
          alias: alias,
          password: password
        };


        return await this.currServerFacade.login(request);
      };

      public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
      ): Promise<[User, AuthToken]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64: string =
          Buffer.from(userImageBytes).toString("base64");
    
        // TODO: Replace with the result of calling the server
        // const user = FakeData.instance.firstUser;
    
        // if (user === null) {
        //   throw new Error("Invalid registration");
        // }

        let request: RegisterRequest = {
          firstName: firstName,
          lastName: lastName,
          alias: alias,
          password: password,
          userImageBytes: imageStringBase64,
          imageFileExtension: imageFileExtension
        };
    
        // return [user, FakeData.instance.authToken];
        return await this.currServerFacade.register(request);
      };

      public async getUser (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        // return FakeData.instance.findUserByAlias(alias);
        let request: GetUserRequest = {
          token: authToken.token,
          alias: alias
        };

        return await this.currServerFacade.getUser(request);
      };

      public async logout (authToken: AuthToken): Promise<void> {
        let request: LogoutRequest = {
          token: authToken.token
        }
        await this.currServerFacade.logout(request);

        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        // await new Promise((res) => setTimeout(res, 1000));
      };


}
