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
  private userDao: UserDao;
  private sessionDao: SessionDao;
  private followDao: FollowDao;


  constructor(daoFactory: DaoFactory) {
    this.factory = daoFactory;
    this.userDao = this.factory.createUserDao();
    this.sessionDao = this.factory.createSessionDao();
    this.followDao = this.factory.createFollowDao();
  }
  

  public async loadMoreItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
    fetchItems: (userAlias: string, pageSize: number, lastAlias: string | undefined) => Promise<{ values: string[]; hasMorePages: boolean }>
  ): Promise<[UserDto[], boolean]> {
    if (!(await this.sessionDao.verifySession(token))) {
      throw new Error("Not authorized");
    }
  
    try {
      const lastAlias = lastItem ? lastItem.alias : undefined;
      const result = await fetchItems(userAlias, pageSize, lastAlias);

    
      const users: UserDto[] = [];
      for (const item of result.values) {
        const user = await this.userDao.getUser(item); // Ensure async handling
        if (user) {
          users.push(user);
        }
      }
    
      return [users, result.hasMorePages];

    }
    catch {
      throw new Error("Error getting follow items");

    }
  }
  
  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.loadMoreItems(token, userAlias, pageSize, lastItem, this.followDao.getPageOfFollowers.bind(this.followDao));
  }
  
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.loadMoreItems(token, userAlias, pageSize, lastItem, this.followDao.getPageOfFollowees.bind(this.followDao));
  }
  

    // public async loadMoreFollowers (
    //     token: string,
    //     userAlias: string,
    //     pageSize: number,
    //     lastItem: UserDto | null
    //   ): Promise<[UserDto[], boolean]> {
    //     // TODO: Replace with the result of calling server
    //     if (await this.sessionDao.verifySession(token) == false) {
    //       throw new Error("Not authorized");
    //     }

    //     const lastFollowerAlias = lastItem ? lastItem.alias : undefined;
    

    //     const result = await this.followDao.getPageOfFollowers(userAlias, pageSize, lastFollowerAlias);

    //     // if (data.Items) {
    //     //   const aliasToFetch = keyAlias === this.followerAlias ? this.followeeAlias : this.followerAlias;

    //     //   for (const item of data.Items) {
    //     //       const user = await this.userDao.getUser(item[aliasToFetch]); // Ensure async handling
    //     //       if (user) {
    //     //           items.push(user);
    //     //       }
    //     //   }
    //     // }

    //     let users: UserDto[] = [];

    //     for (const item of result.values) {
    //         const user = await this.userDao.getUser(item); // Ensure async handling
    //         if (user) {
    //           users.push(user);
    //         }
    //     }

    
    //     return [users, result.hasMorePages];

    //     // return this.getFakeData(lastItem, pageSize, userAlias);
    //   };
    
    // public async loadMoreFollowees (
    //     token: string,
    //     userAlias: string,
    //     pageSize: number,
    //     lastItem: UserDto | null
    //   ): Promise<[UserDto[], boolean]> {
    //     // TODO: Replace with the result of calling server
    //       if (await this.sessionDao.verifySession(token) == false) {
    //         throw new Error("Not authorized");
    //       }
    
    //     const lastFolloweeAlias = lastItem ? lastItem.alias : undefined;
    
    //     const result = await this.followDao.getPageOfFollowees(userAlias, pageSize, lastFolloweeAlias);
    //     let users: UserDto[] = [];

    //     for (const item of result.values) {
    //         const user = await this.userDao.getUser(item); // Ensure async handling
    //         if (user) {
    //           users.push(user);
    //         }
    //     }

    
    //     return [users, result.hasMorePages];
    
    //     // return [result.values, result.hasMorePages];
    //     // return this.getFakeData(lastItem, pageSize, userAlias);
    //   };

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

        try {
          return await this.followDao.getIsFollowerStatus(user.alias, selectedUser.alias);
        }
        catch {
          throw new Error("Error getting follower status");

        }

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

        try {

          return await this.followDao.getFolloweeCount(user.alias);
        }
        catch {
          throw new Error("Error getting followee count");

        }


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

        try {
          return await this.followDao.getFollowerCount(user.alias);
        }
        catch {
          throw new Error("Error getting follower count");

        }

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

      try {

        let currAlias: string | null = await this.sessionDao.getAliasFromSession(token);

        if (currAlias == null) {
          throw new Error("Not authorized");
        }

        // let currUser: UserDto|null = await this.userDao.getUser(currAlias);

        // if (currUser == null) {
        //   throw new Error("Not authorized");
        // }

        await this.followDao.followUser(currAlias, userToFollow.alias);

      }
      catch {
        throw new Error("Error following user");
      }
    
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


      try {
        let currAlias: string | null = await this.sessionDao.getAliasFromSession(token);

        if (currAlias == null) {
          throw new Error("Not authorized");
        }

        await this.followDao.unfollowUser(currAlias, userToUnfollow.alias);
      }
      catch {
        throw new Error("Error unfollowing user");
      }


        // TODO: Call the server
    
        const followerCount = await this.getFollowerCount(token, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
    
        return [followerCount, followeeCount];
      };
}
