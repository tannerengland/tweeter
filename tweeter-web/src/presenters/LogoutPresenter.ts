import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


export interface LogoutView {
    displayErrorMessage: (message: string) => void,
    clearLastInfoMessage: () => void,
    clearUserInfo: () => void,

}


export class LogoutPresenter {

    private userService: UserService;
    private view: LogoutView; 

    public constructor(view: LogoutView) {
        this.userService = new UserService();
        this.view = view;
    }


    public async logOut(authToken: AuthToken)  {
        // displayInfoMessage("Logging Out...", 0);
    
        // try {
        await this.userService.logout(authToken!);

        this.view.clearLastInfoMessage();
        this.view.clearUserInfo();
          
        // } catch (error) {
        //   displayErrorMessage(
        //     `Failed to log user out because of exception: ${error}`
        //   );
        // }
      };

    public displayErrorMessage(error: unknown) {
        this.view.displayErrorMessage(`Failed to log user out because of exception: ${error}`);
    }
}