// import { useNavigate } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
// import useUserInfo from "../components/userInfo/userInfoHook";
import { UserService } from "../model/service/UserService";

export interface LoginView {
    // updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
    authenticate: (currentUser: User, authToken: AuthToken) => void;
    navigateTo: (url: string) => void;
    displayErrorMessage: (message: string) => void;

}

export class LoginPresenter {
    private setIsLoading = false;
    // private updateUserInfo = useUserInfo();
    // private navigate = useNavigate();
    // private alias = "";
    // private password = "";
    // private rememberMe = false;

    private userService: UserService;
    private view: LoginView;

    public constructor(view: LoginView) {
        this.userService = new UserService();
        this.view = view;
    }
    

    public async doLogin(alias: string, password: string, originalUrl?: string) {
        try {
          this.setIsLoading = true;
    
          const [user, authToken] = await this.userService.login(alias, password);
    
          this.view.authenticate(user, authToken);
    
          if (!!originalUrl) {
            this.view.navigateTo(originalUrl);
          } else {
            this.view.navigateTo("/");
          }
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to log user in because of exception: ${error}`
          );
        } finally {
          this.setIsLoading = false;
        }
      };
}