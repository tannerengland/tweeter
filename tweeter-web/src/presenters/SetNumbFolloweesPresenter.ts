import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface SetNumbFolloweesView {
    displayErrorMessage: (message: string) => void,
    setFolloweeCount: (value: React.SetStateAction<number>) => void,
}

export class SetNumbFolloweesPresenter {
    private userService: UserService;
    private view: SetNumbFolloweesView; 

    public constructor(view: SetNumbFolloweesView) {
        this.userService = new UserService();
        this.view = view;
    }
    
    public async setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User
      ) {
        // try {
          this.view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
        // } catch (error) {
        //   displayErrorMessage(
        //     `Failed to get followees count because of exception: ${error}`
        //   );
        // }
      };

    public displayErrorMessage(error: unknown) {
        this.view.displayErrorMessage(`Failed to get followees count because of exception: ${error}`);
    }

}