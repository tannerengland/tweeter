import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface SetNumbFollowersView {
    displayErrorMessage: (message: string) => void,
    setFollowerCount: (value: React.SetStateAction<number>) => void,
}

export class SetNumbFollowersPresenter {
    private userService: UserService;
    private view: SetNumbFollowersView; 

    public constructor(view: SetNumbFollowersView) {
        this.userService = new UserService();
        this.view = view;
    }
    
    public async setNumbFollowers (
        authToken: AuthToken,
        displayedUser: User
      ) {
        // try {
          this.view.setFollowerCount(await this.userService.getFollowerCount(authToken, displayedUser));
        // } catch (error) {
        //   displayErrorMessage(
        //     `Failed to get followees count because of exception: ${error}`
        //   );
        // }
      };

    public displayErrorMessage(error: unknown) {
        this.view.displayErrorMessage( `Failed to get followers count because of exception: ${error}`);
    }

}