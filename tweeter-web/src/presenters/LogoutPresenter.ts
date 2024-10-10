import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";


export interface LogoutView extends View {
    // displayErrorMessage: (message: string) => void,
    clearLastInfoMessage: () => void,
    clearUserInfo: () => void,

}


export class LogoutPresenter extends Presenter<LogoutView> {

    private userService: UserService;
    // private view: LogoutView; 

    public constructor(view: LogoutView) {
        super(view);
        this.userService = new UserService();
        // this.view = view;
    }

    protected get view(): LogoutView {
        return super.view as LogoutView;
    }


    public async logOut(authToken: AuthToken)  {
        // displayInfoMessage("Logging Out...", 0);

        this.doFailureReportingOperation(async () => {
            await this.userService.logout(authToken!);

            this.view.clearLastInfoMessage();
            this.view.clearUserInfo();
        }, "log user out");

      };

}