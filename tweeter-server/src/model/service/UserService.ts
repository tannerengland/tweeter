import { User, AuthToken, FakeData, UserDto, AuthTokenDto } from "tweeter-shared";
import { Buffer } from "buffer";

export class UserService {

    public async login (
        alias: string,
        password: string
      ): Promise<[UserDto, AuthTokenDto]> {
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;
    
        if (user === null) {
          throw new Error("Invalid alias or password");
        }

        const authToken = FakeData.instance.authToken;
    
        return [user.dto, authToken.dto];
      };

      public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string,
        imageFileExtension: string
      ): Promise<[UserDto, AuthTokenDto]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        // const imageStringBase64: string =
        //   Buffer.from(userImageBytes).toString("base64");
    
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;
    
        if (user === null) {
          throw new Error("Invalid registration");
        }

        const authToken = FakeData.instance.authToken;

        return [user.dto, authToken.dto];
      };

      public async getUser (
        token: string,
        alias: string
      ): Promise<UserDto | null> {
        // TODO: Replace with the result of calling server

        // return FakeData.instance.findUserByAlias(alias);
        const user = FakeData.instance.findUserByAlias(alias);
        return user ? user.dto : null;
      };

      public async logout (token: string): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        // await new Promise((res) => setTimeout(res, 1000));

      };


}
