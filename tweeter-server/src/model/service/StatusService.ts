import { AuthToken, Status, FakeData, StatusDto, User } from "tweeter-shared";

export class StatusService {
      public async loadMoreStoryItems (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]> {
        // TODO: Replace with the result of calling server
        // return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
        // return FakeData.instance.getPageOfStatuses(this.fromDto(lastItem), pageSize);
        return this.getFakeData(lastItem, pageSize);
      };
    
      public async loadMoreFeedItems (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize);
      };

  private async getFakeData(lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
  }

      public async postStatus (
        authToken: AuthToken,
        newStatus: Status
      ): Promise<void> {
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server to post the status
      };
}
