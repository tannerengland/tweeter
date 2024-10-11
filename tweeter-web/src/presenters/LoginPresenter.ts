// import { useNavigate } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
// import useUserInfo from "../components/userInfo/userInfoHook";
// import { UserService } from "../model/service/UserService";
import { AuthenticatePresenter, AuthenticateView } from "./AuthenticatePresenter";
// import { View } from "./Presenter";

// export interface LoginView extends AuthenticateView {
//     // updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
//     authenticate: (currentUser: User, authToken: AuthToken) => void;
//     navigateTo: (url: string) => void;
//     // displayErrorMessage: (message: string) => void;

// }

export class LoginPresenter extends AuthenticatePresenter {
    // private setIsLoading = false;

    // private userService: UserService;

    // public constructor(view: LoginView) {
    //   super(view);

    //   this.userService = new UserService();
    // }

    public doLogin(alias: string, password: string, url: string | undefined): Promise<void>  {
      return this.doAuthenticate(() => this.service.login(alias, password), () => this.getNavigationFunction(url))
    }

    // protected doOperation(alias: string, password: string): Promise<[User, AuthToken]> {
    //   return this.service.login(alias, password);
    // }

    protected getOperationDescription(): string {
      return "log user in";
    }

    protected getNavigationFunction(originalUrl: string | undefined): void {
      if (!!originalUrl) {
        return this.view.navigateTo(originalUrl);
      } else {
        return this.view.navigateTo("/");
      }
    }
    

    // public async doLogin(alias: string, password: string, originalUrl?: string) {
    //     this.doFailureReportingWithPostTask(async () => {
    //       this.setIsLoading = true;
      
    //       const [user, authToken] = await this.userService.login(alias, password);
    
    //       this.view.authenticate(user, authToken);
    
    //       if (!!originalUrl) {
    //         this.view.navigateTo(originalUrl);
    //       } else {
    //         this.view.navigateTo("/");
    //       }

    //     }, "log user in", () => {
    //       this.setIsLoading = false;
    //     });
    // };
}
