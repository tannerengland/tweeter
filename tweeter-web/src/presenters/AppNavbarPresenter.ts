import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter, View } from "./Presenter";


export interface AppNavbarView extends MessageView  {
    clearUserInfo: () => void,
}


export class AppNavbarPresenter extends Presenter<AppNavbarView> {

    private _userService: UserService;
    // private view: LogoutView; 

    public constructor(view: AppNavbarView) {
        super(view);
        this._userService = new UserService();
        // this.view = view;
    }

    // protected get view(): LogoutView {
    //     return super.view as LogoutView;
    // }

    public get userService() {
        return this._userService;
    }

    public async logout(authToken: AuthToken)  {
        this.view.displayInfoMessage("Logging Out...", 0);

        this.doFailureReportingOperation(async () => {
            await this.userService.logout(authToken!);

            this.view.clearLastInfoMessage();
            this.view.clearUserInfo();
        }, "log user out");

      };

}