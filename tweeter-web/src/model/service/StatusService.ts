// import { request } from "http";
import { AuthToken, Status, FakeData, PagedStatusItemRequest, PostStatusRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
  private currServerFacade = new ServerFacade();

      public async loadMoreStoryItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        // return FakeData.instance.getPageOfStatuses(lastItem, pageSize);

        let request: PagedStatusItemRequest = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem == null ? lastItem: lastItem.dto
        };
        return await this.currServerFacade.getMoreStories(request);
      };
    
      public async loadMoreFeedItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        // return FakeData.instance.getPageOfStatuses(lastItem, pageSize);

        let request: PagedStatusItemRequest = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem == null ? lastItem: lastItem.dto
        };
        return await this.currServerFacade.getMoreFeed(request);
      };

      public async postStatus (
        authToken: AuthToken,
        newStatus: Status
      ): Promise<void> {
        // Pause so we can see the logging out message. Remove when connected to the server
        // await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server to post the status

        let request: PostStatusRequest = {
          token: authToken.token,
          newStatus: newStatus.dto
        }
        await await this.currServerFacade.postStatus(request);
      };
}
