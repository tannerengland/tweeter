import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";


export interface UserInfoView {
    displayErrorMessage: (message: string) => void,
    setIsLoading: (value: React.SetStateAction<boolean>) => void,
    displayInfoMessage: (message: string, duration: number) => void,
    setIsFollower: (value: React.SetStateAction<boolean>) => void,
    setFollowerCount: (value: React.SetStateAction<number>) => void,
    setFolloweeCount: (value: React.SetStateAction<number>) => void,
    clearLastInfoMessage: () => void,

}

export class UserInfoPresenter {
    private followService: FollowService;
    private view: UserInfoView; 

    public constructor(view: UserInfoView) {
        this.followService = new FollowService();
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
    
          const [followerCount, followeeCount] = await this.followService.unfollow(
            authToken!,
            displayedUser!
          );
    
          this.view.setIsFollower(false);
          this.view.setFollowerCount(followerCount);
          this.view.setFolloweeCount(followeeCount);
        } catch (error) {
          this.view.displayErrorMessage(`Failed to unfollow user because of exception: ${error}`);
        } finally {
          this.view.clearLastInfoMessage();
          this.view.setIsLoading(false);
        }
      };

      public async setIsFollowerStatus (
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
      ) {
        try {
          if (currentUser === displayedUser) {
            this.view.setIsFollower(false);
          } else {
            this.view.setIsFollower(
              await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
            );
          }
        } catch (error) {
          // displayErrorMessage(
          //   `Failed to determine follower status because of exception: ${error}`
          // );
          this.view.displayErrorMessage(`Failed to determine follower status because of exception: ${error}`);
        }
      };

      public async followDisplayedUser (
        authToken: AuthToken, displayedUser: User
      ): Promise<void> {
        // event.preventDefault();
    
        try {
          this.view.setIsLoading(true);
          this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);
    
          const [followerCount, followeeCount] = await this.followService.follow(
            authToken!,
            displayedUser!
          );
    
          this.view.setIsFollower(true);
          this.view.setFollowerCount(followerCount);
          this.view.setFolloweeCount(followeeCount);
        } catch (error) {
          this.view.displayErrorMessage(`Failed to follow user because of exception: ${error}`);
        } finally {
          this.view.clearLastInfoMessage();
          this.view.setIsLoading(false);
        }
      };

      public async setNumbFollowers (
        authToken: AuthToken,
        displayedUser: User
      ) {
        try {
          this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
        } catch (error) {
          // displayErrorMessage(
          //   `Failed to get followees count because of exception: ${error}`
          // );
          this.view.displayErrorMessage( `Failed to get followers count because of exception: ${error}`);
        }
      };

      public async setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User
      ) {
        try {
          this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
        } catch (error) {
          // displayErrorMessage(
          //   `Failed to get followees count because of exception: ${error}`
          // );
          this.view.displayErrorMessage(`Failed to get followees count because of exception: ${error}`);

        }
      };



}