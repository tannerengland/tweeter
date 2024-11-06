import "isomorphic-fetch";
import { instance, mock, verify, spy, when } from "ts-mockito";
import { AuthToken, GetFollowCountRequest, PagedUserItemRequest, RegisterRequest, UserDto } from "tweeter-shared";
import { ServerFacade } from "../../../src/network/ServerFacade";

describe("ServerFacade", () => {
    let currServerFacade = new ServerFacade();

    it("correctly registers a user", async () => {
        let request: RegisterRequest = {
            firstName: "John",
            lastName: "Doe",
            alias: "johnDoe123",
            password: "securePassword123",
            userImageBytes: "aW1hZ2VCeXRlcyBhcyBhIHN0cmluZw==",
            imageFileExtension: "jpg"
        }

        const [user, authToken] = await currServerFacade.register(request);

        expect(user).not.toBeNull();
        expect(authToken).not.toBeNull();
    });

    it("correctly gets followers", async () => {
        let currUser: UserDto = {
            alias: "userAlias123",
            firstName: "John",
            lastName: "Doe",
            imageUrl: "https://example.com/userImage.jpg"
          }

        let request: PagedUserItemRequest = {
            token: "secret",
            userAlias: "dude",
            pageSize: 10,
            lastItem: currUser
        }

        const [users, hasMore] = await currServerFacade.getMoreFollowees(request);

        expect(users).not.toBeNull();
    });

    it("correctly gets follower/following count", async () => {
        let currUser: UserDto = {
            alias: "userAlias123",
            firstName: "John",
            lastName: "Doe",
            imageUrl: "https://example.com/userImage.jpg"
          }


        let request: GetFollowCountRequest = {
            token: "beans",
            user: currUser
        }

        const followerCount = await currServerFacade.getFollowerCount(request);

        const followeeCount = await currServerFacade.getFolloweeCount(request);

        expect(followerCount).not.toBeNull();
        expect(typeof followerCount).toBe('number');
        expect(followeeCount).not.toBeNull();
        expect(typeof followeeCount).toBe('number');

    });
});

// functionality, tests, 2 end to end componenet presenter webservice serfacade clientcomm lambda serverservice