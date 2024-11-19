import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { DaoFactoryDynamoDB } from "../../model/dao/dynamodb/DaoFactoryDynamoDB";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
    const statusService = new StatusService(new DaoFactoryDynamoDB);
    const [items, hasMore] = await statusService.loadMoreStoryItems(request.token, request.userAlias, request.pageSize, request.lastItem);
    
    return {
        success: true,
        message: undefined,
        items: items,
        hasMore: hasMore
    }
}