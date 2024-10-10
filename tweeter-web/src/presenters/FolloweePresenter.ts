import { AuthToken, User } from "tweeter-shared";
import { PAGE_SIZE } from "./PagedItemPresenter";
// import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter } from "./UserItemPresenter";

// export const PAGE_SIZE = 10;

export class FolloweePresenter extends UserItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowees (
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }
  
  protected getItemDescription(): string {
    return "load followees";
  }
    // private service: FollowService;


    // protected constructor(view: UserItemView) {
    //     super(view);
    //     // this.service = new FollowService();
    // }

    // protected get view(): UserItemView {
    //   return super.view as UserItemView;
    // }

  // public async loadMoreItems(authToken: AuthToken, userAlias: string) {
  //   this.doFailureReportingOperation(async () => {
  //     const [newItems, hasMore] = await this.service.loadMoreFollowees (
  //       authToken,
  //       userAlias,
  //       PAGE_SIZE,
  //       this.lastItem
  //     );

  //     this.hasMoreItems = hasMore;
  //     this.lastItem = newItems[newItems.length - 1];
  //     this.view.addItems(newItems);
  //   }, "load followees");
  // };
}
