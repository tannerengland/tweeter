import { UserDto } from "tweeter-shared";
import { AuthToken, User, FakeData } from "tweeter-shared";
import { DaoFactory } from "../dao/DaoFactory";
import { DaoFactoryDynamoDB } from "../dao/dynamodb/DaoFactoryDynamoDB";
import { FollowDao } from "../dao/FollowDao";
import { SessionDao } from "../dao/SessionDao";
import { UserDao } from "../dao/UserDao";

export class FollowService {
  // private factory: DaoFactory = new DaoFactory();
  private factory: DaoFactory;
  // private userDao: UserDao;
  private sessionDao: SessionDao;
  private followDao: FollowDao;


  constructor(daoFactory: DaoFactory) {
    this.factory = daoFactory;
    // this.userDao = this.factory.createUserDao();
    this.sessionDao = this.factory.createSessionDao();
    this.followDao = this.factory.createFollowDao();
  }
  


    public async loadMoreFollowers (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        if (await this.sessionDao.verifySession(token) == false) {
          throw new Error("Not authorized");
        }

        const lastFollowerAlias = lastItem ? lastItem.alias : undefined;
    
        const result = await this.followDao.getPageOfFollowers(userAlias, pageSize, lastFollowerAlias);
    
        return [result.values, result.hasMorePages];

        // return this.getFakeData(lastItem, pageSize, userAlias);
      };
    
    public async loadMoreFollowees (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
          if (await this.sessionDao.verifySession(token) == false) {
            throw new Error("Not authorized");
          }
    
        const lastFolloweeAlias = lastItem ? lastItem.alias : undefined;
    
        const result = await this.followDao.getPageOfFollowees(userAlias, pageSize, lastFolloweeAlias);
    
        return [result.values, result.hasMorePages];
        // return this.getFakeData(lastItem, pageSize, userAlias);
      };

  // private async getFakeData(lastItem: any, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
  //   const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
  //   const dtos = items.map((user: User) => user.dto);
  //   return [dtos, hasMore];
  // }

      public async getIsFollowerStatus (
        token: string,
        user: UserDto,
        selectedUser: UserDto
      ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        if (await this.sessionDao.verifySession(token) == false) {
          throw new Error("Not authorized");
        }


        return await this.followDao.getIsFollowerStatus(user.alias, selectedUser.alias);

        // return FakeData.instance.isFollower();
      };

      public async getFolloweeCount (
        token: string,
        user: UserDto
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        if (await this.sessionDao.verifySession(token) == false) {
          throw new Error("Not authorized");
        }

        return await this.followDao.getFolloweeCount(user.alias);


        // return FakeData.instance.getFolloweeCount(user.alias);
      };


      public async getFollowerCount (
        token: string,
        user: UserDto
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        if (await this.sessionDao.verifySession(token) == false) {
          throw new Error("Not authorized");
        }

        return await this.followDao.getFollowerCount(user.alias);

        // return FakeData.instance.getFollowerCount(user.alias);
      };

      public async follow (
        token: string,
        userToFollow: UserDto
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the follow message. Remove when connected to the server
        // await new Promise((f) => setTimeout(f, 2000));
        if (await this.sessionDao.verifySession(token) == false) {
          throw new Error("Not authorized");
        }

        let currAlias: string | null = await this.sessionDao.getAliasFromSession(token);

        if (currAlias == null) {
          throw new Error("Not authorized");
        }

        // let currUser: UserDto|null = await this.userDao.getUser(currAlias);

        // if (currUser == null) {
        //   throw new Error("Not authorized");
        // }

        await this.followDao.followUser(currAlias, userToFollow.alias);
    
        // TODO: Call the server
    
        const followerCount = await this.getFollowerCount(token, userToFollow);
        const followeeCount = await this.getFolloweeCount(token, userToFollow);
    
        return [followerCount, followeeCount];
      };


      public async unfollow (
        token: string,
        userToUnfollow: UserDto
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        // await new Promise((f) => setTimeout(f, 2000));

        if (await this.sessionDao.verifySession(token) == false) {
          throw new Error("Not authorized");
        }

        let currAlias: string | null = await this.sessionDao.getAliasFromSession(token);

        if (currAlias == null) {
          throw new Error("Not authorized");
        }

        await this.followDao.unfollowUser(currAlias, userToUnfollow.alias);

    
        // TODO: Call the server
    
        const followerCount = await this.getFollowerCount(token, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
    
        return [followerCount, followeeCount];
      };
}
