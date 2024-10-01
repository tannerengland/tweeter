import { AuthToken } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export const PAGE_SIZE = 10;

export class FeedPresenter extends StatusItemPresenter {
    private storyService: StatusService;


    public constructor(view: StatusItemView) {
        super(view);
        this.storyService = new StatusService();
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
        try {
            
          const [newItems, hasMore] = await this.storyService.loadMoreFeedItems (
            authToken,
            userAlias,
            PAGE_SIZE,
            this.lastItem
          );
    
          this.hasMoreItems = hasMore;
          this.lastItem = newItems[newItems.length - 1];
          this.view.addItems(newItems);
        //   setChangedDisplayedUser(false)
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to load feed items because of exception: ${error}`
          );
        }
      };
}