import { AuthToken, Status } from "tweeter-shared";
// import { StatusService } from "../model/service/StatusService";
import { PAGE_SIZE } from "./PagedItemPresenter";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

// export const PAGE_SIZE = 10;

export class FeedPresenter extends StatusItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
    return this.service.loadMoreFeedItems (
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }
  protected getItemDescription(): string {
    return "load feed items";
  }
    // private storyService: StatusService;


    // protected constructor(view: StatusItemView) {
    //     super(view);
    //     // this.storyService = new StatusService();
    // }

    // protected get view(): StatusItemView {
    //   return super.view as StatusItemView;
    // }

    // public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    //   this.doFailureReportingOperation(async () => {          
    //     const [newItems, hasMore] = await this.service.loadMoreFeedItems (
    //     authToken,
    //     userAlias,
    //     PAGE_SIZE,
    //     this.lastItem
    //   );

    //   this.hasMoreItems = hasMore;
    //   this.lastItem = newItems[newItems.length - 1];
    //   this.view.addItems(newItems);}, "load feed items")
    //   };
}