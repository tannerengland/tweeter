import { AuthToken, Status, FakeData, StatusDto, User } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { DaoFactory } from "../dao/DaoFactory";
import { FeedDao } from "../dao/FeedDao";
import { FollowDao } from "../dao/FollowDao";
import { SessionDao } from "../dao/SessionDao";
import { StoryDao } from "../dao/StoryDao";
import { UserDao } from "../dao/UserDao";

export class StatusService {

  // private factory: DaoFactory = new DaoFactory();
  // private sessionDao = this.factory.createSessionDao();
  // private storyDao = this.factory.createStoryDao();

  private factory: DaoFactory;
  private userDao: UserDao;
  private sessionDao: SessionDao;
  private followDao: FollowDao;
  private storyDao: StoryDao;
  private feedDao: FeedDao;



  constructor(daoFactory: DaoFactory) {
    this.factory = daoFactory;
    this.userDao = this.factory.createUserDao();
    this.sessionDao = this.factory.createSessionDao();
    this.followDao = this.factory.createFollowDao();
    this.storyDao= this.factory.createStoryDao();
    this.feedDao= this.factory.createFeedDao();
  }
  

  
  public async loadMoreStoryItems (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    // return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    // return FakeData.instance.getPageOfStatuses(this.fromDto(lastItem), pageSize);

    if (await this.sessionDao.verifySession(token) == false) {
      throw new Error("Not authorized");
    }


    let result = await this.storyDao.getStoriesPage(userAlias, pageSize, lastItem);

    return [result.values, result.hasMorePages];
    // return this.getFakeData(lastItem, pageSize);
  };

  public async loadMoreFeedItems (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server

    if (await this.sessionDao.verifySession(token) == false) {
      throw new Error("Not authorized");
    }

    let result = await this.feedDao.getFeedPage(userAlias, pageSize, lastItem);

    return [result.values, result.hasMorePages];
    // return this.getFakeData(lastItem, pageSize);
  };

  private async getFakeData(lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
  }

  public async postStatus (
    token: string,
    newStatus: StatusDto
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
    if (await this.sessionDao.verifySession(token) == false) {
      throw new Error("Not authorized");
    }

    // author_alias, timestamp, JSON.Stringify(newStatus)

    // await this.storyDao.postStory(newStatus);
    await this.storyDao.postStory(newStatus);
    await this.feedDao.postFeed(newStatus);

  };

}
