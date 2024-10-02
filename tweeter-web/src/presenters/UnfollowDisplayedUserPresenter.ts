import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


export interface UnfollowDisplayedUserView {
    displayErrorMessage: (message: string) => void,
    setIsLoading: (value: React.SetStateAction<boolean>) => void,
    displayInfoMessage: (message: string, duration: number) => void,
    setIsFollower: (value: React.SetStateAction<boolean>) => void,
    setFollowerCount: (value: React.SetStateAction<number>) => void,
    setFolloweeCount: (value: React.SetStateAction<number>) => void,
    clearLastInfoMessage: () => void,

}

export class UnfollowDisplayedUserPresenter {

    private userService: UserService;
    private view: UnfollowDisplayedUserView; 

    public constructor(view: UnfollowDisplayedUserView) {
        this.userService = new UserService();
        this.view = view;
    }

    public async unfollowDisplayedUser (
        authToken: AuthToken, displayedUser: User
      ): Promise<void> {
    
        try {
          this.view.setIsLoading(true);
          this.view.displayInfoMessage(
            `Unfollowing ${displayedUser!.name}...`,
            0
          );
    
          const [followerCount, followeeCount] = await this.userService.unfollow(
            authToken!,
            displayedUser!
          );
    
          this.view.setIsFollower(false);
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
        this.view.displayErrorMessage(`Failed to unfollow user because of exception: ${error}`);
    }
    
}