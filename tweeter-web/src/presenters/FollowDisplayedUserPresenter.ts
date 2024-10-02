import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface FollowDisplayedUserView {
    displayErrorMessage: (message: string) => void,
    setIsLoading: (value: React.SetStateAction<boolean>) => void,
    displayInfoMessage: (message: string, duration: number) => void,
    setIsFollower: (value: React.SetStateAction<boolean>) => void,
    setFollowerCount: (value: React.SetStateAction<number>) => void,
    setFolloweeCount: (value: React.SetStateAction<number>) => void,
    clearLastInfoMessage: () => void,
}

export class FollowDisplayedUserPresenter {
    private userService: UserService;
    private view: FollowDisplayedUserView; 

    public constructor(view: FollowDisplayedUserView) {
        this.userService = new UserService();
        this.view = view;
    }
    
    public async followDisplayedUser (
        authToken: AuthToken, displayedUser: User
      ): Promise<void> {
        // event.preventDefault();
    
        try {
          this.view.setIsLoading(true);
          this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);
    
          const [followerCount, followeeCount] = await this.userService.follow(
            authToken!,
            displayedUser!
          );
    
          this.view.setIsFollower(true);
          this.view.setFollowerCount(followerCount);
          this.view.setFolloweeCount(followeeCount);
        } catch (error) {
          this.displayErrorMessage(error);
        } finally {
          this.view.clearLastInfoMessage();
          this.view.setIsLoading(false);
        }
      };

    public displayErrorMessage(error: unknown) {
        this.view.displayErrorMessage(`Failed to follow user because of exception: ${error}`);
    }

}