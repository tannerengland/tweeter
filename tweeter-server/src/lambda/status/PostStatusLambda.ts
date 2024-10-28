

export const handler = async (request: PostItemRequest): Promise<PostItemResponse> => {
    const statusService = new StatusService;
    const [items, hasMore] = await statusService.loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem);
    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}