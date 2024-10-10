import { AuthToken, Status } from "tweeter-shared";
import { PAGE_SIZE } from "./PagedItemPresenter";
// import { StatusService } from "../model/service/StatusService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

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
    //     const [newItems, hasMore] = await this.service.loadMoreStoryItems (
    //       authToken,
    //       userAlias,
    //       PAGE_SIZE,
    //       this.lastItem
    //     );
  
    //     this.hasMoreItems = hasMore;
    //     this.lastItem = newItems[newItems.length - 1];
    //     this.view.addItems(newItems);
    //   }, "load story items")          
    //   };
}