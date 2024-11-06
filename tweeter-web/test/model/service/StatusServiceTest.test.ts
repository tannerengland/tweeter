// npm test? npm run test
// make a request, make serverfacade, check the response (make sure it is there using expect(result.response, true) and expect(result.user.notToBeNull) )
// if has more items = true than it should be 10 
// another request if it has more items,

import "isomorphic-fetch";
import { StatusService } from "../../../src/model/service/StatusService";
import { instance, mock, verify, spy, when } from "ts-mockito";
import { AuthToken, GetFollowCountRequest, PagedUserItemRequest, RegisterRequest, UserDto } from "tweeter-shared";
import { ServerFacade } from "../../../src/network/ServerFacade";

describe("StatusService", () => {
    let currStatusService = new StatusService();

    it("correctly retrives stories", async () => {
        const authToken = new AuthToken("abc123", Date.now());

        const [statuses, hasMore] = await currStatusService.loadMoreStoryItems(authToken, "guy", 10, null);

        expect(statuses).not.toBeNull();
    });

});