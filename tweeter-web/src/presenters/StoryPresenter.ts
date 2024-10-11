import { AuthToken, Status } from "tweeter-shared";
import { PAGE_SIZE } from "./PagedItemPresenter";
// import { StatusService } from "../model/service/StatusService";
import { StatusItemPresenter } from "./StatusItemPresenter";

// export const PAGE_SIZE = 10;

export class StoryPresenter extends StatusItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
    return this.service.loadMoreStoryItems (
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );;
  }
  
  protected getItemDescription(): string {
    return "load story items";
  }

}