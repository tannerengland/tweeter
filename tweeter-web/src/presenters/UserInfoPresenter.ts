import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { Presenter, View } from "./Presenter";


export interface UserInfoView extends View {
    // displayErrorMessage: (message: string) => void,
    setIsLoading: (value: React.SetStateAction<boolean>) => void,
    displayInfoMessage: (message: string, duration: number) => void,
    setIsFollower: (value: React.SetStateAction<boolean>) => void,
    setFollowerCount: (value: React.SetStateAction<number>) => void,
    setFolloweeCount: (value: React.SetStateAction<number>) => void,
    clearLastInfoMessage: () => void,

}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private followService: FollowService;
    // private view: UserInfoView; 

    public constructor(view: UserInfoView) {
      // this.view = view;
      super(view);
      this.followService = new FollowService();
    }

    protected get view(): UserInfoView {
      return super.view as UserInfoView;
    }

    public async unfollowDisplayedUser (
        authToken: AuthToken, displayedUser: User
      ): Promise<void> {
    
        try {
          this.doFailureReportingOperation(async () => {
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

          }, "unfollow user");
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

        this.doFailureReportingOperation(async () => {
          if (currentUser === displayedUser) {
            this.view.setIsFollower(false);
          } else {
            this.view.setIsFollower(
              await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
            );
          }
        }, "determine follower status")
      };

      public async followDisplayedUser (
        authToken: AuthToken, displayedUser: User
      ): Promise<void> {
        // event.preventDefault();
    
        try {
          this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);
            this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);
      
            const [followerCount, followeeCount] = await this.followService.follow(
              authToken!,
              displayedUser!
            );
      
            this.view.setIsFollower(true);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
          }, "follow user");
        } finally {
          this.view.clearLastInfoMessage();
          this.view.setIsLoading(false);
        }
      };

      public async setNumbFollowers (
        authToken: AuthToken,
        displayedUser: User
      ) {

        this.doFailureReportingOperation(async () => {
          this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
        }, "get followers count");

      };

      public async setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User
      ) {

        this.doFailureReportingOperation(async () => {
          this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
        }, "get followees count")

      };



}