// import { request } from "http";
import { AuthToken, User, FakeData, PagedUserItemRequest, GetIsFollowerStatusRequest, GetFollowCountRequest, FollowRequest, UnfollowRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
  private currServerFacade = new ServerFacade();

    public async loadMoreFollowers (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        // return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
        let request: PagedUserItemRequest = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem == null ? lastItem: lastItem.dto
        };
        return await this.currServerFacade.getMoreFollowers(request);
      };
    
    public async loadMoreFollowees (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        // return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
        let request: PagedUserItemRequest = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem == null ? lastItem: lastItem.dto
        };
        return await this.currServerFacade.getMoreFollowees(request);
      };

      public async getIsFollowerStatus (
        authToken: AuthToken,
        user: User,
        selectedUser: User
      ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        // return FakeData.instance.isFollower();
        let request: GetIsFollowerStatusRequest = {
          token: authToken.token,
          user: user.dto,
          selectedUser: selectedUser.dto
        };
        return await this.currServerFacade.getIsFollowerStatus(request);
      };

      public async getFolloweeCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        // return FakeData.instance.getFolloweeCount(user.alias);
        let request: GetFollowCountRequest = {
          token: authToken.token,
          user: user.dto
        };

        return await this.currServerFacade.getFolloweeCount(request);
      };


      public async getFollowerCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        // return FakeData.instance.getFollowerCount(user.alias);
        let request: GetFollowCountRequest = {
          token: authToken.token,
          user: user.dto
        };

        // return this.currServerFacade.getFollowerCount(user.alias);
        return await this.currServerFacade.getFollowerCount(request);
      };

      public async follow (
        authToken: AuthToken,
        userToFollow: User
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the follow message. Remove when connected to the server
        // await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        // const followerCount = await this.getFollowerCount(authToken, userToFollow);
        // const followeeCount = await this.getFolloweeCount(authToken, userToFollow);
    
        // return [followerCount, followeeCount];
        let request: FollowRequest = {
          token: authToken.token,
          userToFollow: userToFollow.dto
        };

        return await this.currServerFacade.follow(request);
      };


      public async unfollow (
        authToken: AuthToken,
        userToUnfollow: User
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        // await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        // const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
        // const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);
    
        // return [followerCount, followeeCount];

        let request: UnfollowRequest = {
          token: authToken.token,
          userToUnfollow: userToUnfollow.dto
        };

        return await this.currServerFacade.unfollow(request);

      };
}
