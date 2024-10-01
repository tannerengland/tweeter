import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface RegisterView {
    authenticate: (currentUser: User, authToken: AuthToken) => void;
    navigateTo: (url: string) => void;
    displayErrorMessage: (message: string) => void;
}

export class RegisterPresenter {

    private setIsLoading = false;

    private userService: UserService;
    private view: RegisterView;

    public constructor(view: RegisterView) {
        this.userService = new UserService();
        this.view = view;
    }

    public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string) {
        try {
          this.setIsLoading = true;
    
          const [user, authToken] = await this.userService.register(
            firstName,
            lastName,
            alias,
            password,
            imageBytes,
            imageFileExtension
          );
    
          this.view.authenticate(user, authToken);
          this.view.navigateTo("/");
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to register user because of exception: ${error}`
          );
        } finally {
            this.setIsLoading = false;
        }
      };

}