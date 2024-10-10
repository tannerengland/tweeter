import { AuthToken, User } from "tweeter-shared";
import { PAGE_SIZE } from "./PagedItemPresenter";
// import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

// export const PAGE_SIZE = 10;

export class FollowerPresenter extends UserItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowers (
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }

  protected getItemDescription(): string {
    return "load followers";
  }
    // private followService: FollowService;


  //   protected constructor(view: UserItemView) {
  //       super(view);
  //       // this.followService = new FollowService();
  //   }

  //   protected get view(): UserItemView {
  //     return super.view as UserItemView;
  //   }

  // public async loadMoreItems(authToken: AuthToken, userAlias: string) {
  //   this.doFailureReportingOperation(async () => {      
  //     const [newItems, hasMore] = await this.service.loadMoreFollowers (
  //     authToken,
  //     userAlias,
  //     PAGE_SIZE,
  //     this.lastItem
  //   );

  //   this.hasMoreItems = hasMore;
  //   this.lastItem = newItems[newItems.length - 1];
  //   this.view.addItems(newItems);}, "load followers");
  // };
}
