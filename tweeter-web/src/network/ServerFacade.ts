import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
    PagedUserItemRequest,
    PagedUserItemResponse,
    Status,
    User,
    UserDto,
  } from "tweeter-shared";
  import { ClientCommunicator } from "./ClientCommunicator";
  
  export class ServerFacade {
    private SERVER_URL = "https://j5cqzfbiee.execute-api.us-east-2.amazonaws.com/dev";
  
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);
  
    // User Service Calls
    public async getMoreFollowees(
      request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedUserItemRequest,
        PagedUserItemResponse
      >(request, "/followee/list");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto) => User.fromDto(dto) as User)
          : null;
  
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No followees found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message);
      }
    }

    public async getMoreFollowers(
      request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedUserItemRequest,
        PagedUserItemResponse
      >(request, "/follower/list");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto) => User.fromDto(dto) as User)
          : null;
  
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No followers found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message);
      }
    }

    public async getMoreStories(
      request: PagedStatusItemRequest
    ): Promise<[Status[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedStatusItemRequest,
        PagedStatusItemResponse
      >(request, "/story/list");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: Status[] | null =
        response.success && response.items
          ? response.items.map((dto) => Status.fromDto(dto) as Status)
          : null;
  
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No stories found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message);
      }
    }

    public async getMoreFeed(
      request: PagedStatusItemRequest
    ): Promise<[Status[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedStatusItemRequest,
        PagedStatusItemResponse
      >(request, "/feed/list");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: Status[] | null =
        response.success && response.items
          ? response.items.map((dto) => Status.fromDto(dto) as Status)
          : null;
  
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No feed found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message);
      }
    }

    
  }