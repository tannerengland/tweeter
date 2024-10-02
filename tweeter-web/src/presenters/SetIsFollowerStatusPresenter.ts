import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface SetIsFollowerStatusView {
    displayErrorMessage: (message: string) => void,
    setIsFollower: (value: React.SetStateAction<boolean>) => void,
}

export class SetIsFollowerStatusPresenter {
    private userService: UserService;
    private view: SetIsFollowerStatusView; 

    public constructor(view: SetIsFollowerStatusView) {
        this.userService = new UserService();
        this.view = view;
    }
    
    public async setIsFollowerStatus (
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
      ) {
        // try {
          if (currentUser === displayedUser) {
            this.view.setIsFollower(false);
          } else {
            this.view.setIsFollower(
              await this.userService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
            );
          }
        // } catch (error) {
        //   displayErrorMessage(
        //     `Failed to determine follower status because of exception: ${error}`
        //   );
        // }
      };

    public displayErrorMessage(error: unknown) {
        this.view.displayErrorMessage(`Failed to determine follower status because of exception: ${error}`);
    }

}