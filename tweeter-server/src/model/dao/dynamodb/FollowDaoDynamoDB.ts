import { FakeData, Follow, User, UserDto } from "tweeter-shared";
import { UserDao } from "../UserDao";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FollowDao } from "../FollowDao";
import { DataPage } from "../DataPage";
import { UserDaoDynamoDB } from "./UserDaoDynamoDB";
import { DaoFactory } from "../DaoFactory";

export class FollowDaoDynamoDB implements FollowDao {
    readonly tableName = "follows";
    readonly indexName = "follows_index";
    readonly followeeAlias = "followee_handle"; 
    readonly followerAlias = "follower_handle"; 
    // readonly followeeFirstName = "followee_first_name";
    // readonly followeeLastName = "followee_last_name";
    // readonly followerFirstName = "follower_first_name";
    // readonly followerLastName = "follower_last_name";
    // readonly followerImageUrl = "follower_image";
    // readonly followeeImageUrl = "followee_image";
    private factory: DaoFactory = new DaoFactory();
    private userDao = this.factory.createUserDao();



    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    public async followUser(userAlias: string, userToFollowAlias: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.followerAlias]: userAlias,        // Partition key
                [this.followeeAlias]: userToFollowAlias // Sort key
                // [this.followeeAlias]: "goose" // Sort key

            },
        };
    
        try {
            await this.client.send(new PutCommand(params));
            console.log(`User ${userAlias} successfully followed ${userAlias}`);
        } catch (error) {
            console.error("Error following user:", error);
            throw error; // Re-throw the error for higher-level handling
        }
    }
    

    public async unfollowUser(userAlias: string, userToUnfollowAlias: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.followerAlias]: userAlias,         // Partition key
                [this.followeeAlias]: userToUnfollowAlias // Sort key
                // [this.followeeAlias]: "goose" 

            },
        };
    
        try {
            await this.client.send(new DeleteCommand(params));
            console.log(`User ${userAlias} successfully unfollowed ${userToUnfollowAlias}`);
        } catch (error) {
            console.error("Error unfollowing user:", error);
            throw error; // Re-throw the error for higher-level handling
        }
    }

    public async getFollowerCount(userAlias: string): Promise<number> {
        const params = {
            TableName: this.tableName,
            IndexName: this.indexName, // Use the GSI if followers are indexed by followee_handle
            KeyConditionExpression: `${this.followeeAlias} = :userAlias`,
            ExpressionAttributeValues: {
                ":userAlias": userAlias,
            },
            // Select: "COUNT", // Only return the count, not the items
        };
    
        try {
            const result = await this.client.send(new QueryCommand(params));
            return result.Count || 0;
        } catch (error) {
            console.error("Error getting follower count:", error);
            throw error;
        }
    }
    
    public async getFolloweeCount(userAlias: string): Promise<number> {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: `${this.followerAlias} = :userAlias`,
            ExpressionAttributeValues: {
                ":userAlias": userAlias,
            },
            // Select: "COUNT", // Only return the count, not the items
        };
    
        try {
            const result = await this.client.send(new QueryCommand(params));
            return result.Count || 0;
        } catch (error) {
            console.error("Error getting followee count:", error);
            throw error;
        }
    }

    public async getIsFollowerStatus(userAlias: string, selectedUserAlias: string): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.followerAlias]: userAlias,         // Partition key
                [this.followeeAlias]: selectedUserAlias // Sort key
            },
        };
    
        try {
            const output = await this.client.send(new GetCommand(params));
            // If no item is found, output.Item will be undefined
            return !!output.Item;
        } catch (error) {
            console.error("Error checking follower status:", error);
            throw error; // Re-throw error for higher-level handling
        }
    }
    
    // public async getPageOfFollowees(
    //     followerAlias: string, 
    //     pageSize: number, 
    //     lastFolloweeAlias?: string
    //   ): Promise<DataPage<UserDto>> { 
    //     const params = {
    //       TableName: this.tableName,
    //       KeyConditionExpression: `${this.followerAlias} = :follower_handle`,
    //       ExpressionAttributeValues: {
    //         ":follower_handle": followerAlias,
    //       },
    //       Limit: pageSize,
    //       ExclusiveStartKey: lastFolloweeAlias
    //         ? {
    //           [this.followerAlias]: followerAlias,
    //           [this.followeeAlias]: lastFolloweeAlias,
    //         }
    //         : undefined,
    //     };
      
    //     const items: UserDto[] = [];
      
    //     try {
    //       const data = await this.client.send(new QueryCommand(params));
    //       const hasMorePages = data.LastEvaluatedKey !== undefined;

      
    //     //   data.Items?.forEach((item) =>
    //     //     let currUser: User = await this.userDao.getUser(item[this.followeeAlias]).dto
            
    //     //     items.push(
    //     //       new User(
    //     //         item[this.followeeAlias],
    //     //         item[this.followeeHandle],
    //     //         item[this.followerName],
    //     //         item[this.followeeName]
    //     //       ).dto
    //     //     )
    //     //   );
    //         if (data.Items) {
    //             for (const item of data.Items) {
    //                 const user = await this.userDao.getUser(item[this.followeeAlias]); // Ensure asynchronous handling
    //                 items.push(user!); // Assuming `user.dto` is a `UserDto`
    //             }
    //         }
      
    //       return new DataPage<UserDto>(items, hasMorePages);
      
    //     } catch (error) {
    //       console.error("Error fetching followees:", error);
    //       throw error; // Rethrow error to let calling function handle it
    //     }
    //   }

    public async getPageOfFollowees(
        followerAlias: string, 
        pageSize: number, 
        lastFolloweeAlias?: string
    ): Promise<DataPage<UserDto>> {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: `${this.followerAlias} = :follower_handle`,
            ExpressionAttributeValues: {
                ":follower_handle": followerAlias,
            },
            Limit: pageSize,
            ExclusiveStartKey: lastFolloweeAlias
                ? {
                    [this.followerAlias]: followerAlias,
                    [this.followeeAlias]: lastFolloweeAlias
                }
                : undefined,
        };
    
        const items: UserDto[] = [];
    
        try {
            const data = await this.client.send(new QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey !== undefined;
    
            if (data.Items) {
                for (const item of data.Items) {
                    const user = await this.userDao.getUser(item[this.followeeAlias]); // Ensure async handling
                    if (user) {
                        items.push(user);
                    }
                }
            }
    
            return new DataPage<UserDto>(items, hasMorePages);
    
        } catch (error) {
            console.error("Error fetching followees:", error);
            throw error; // Rethrow error to let the calling function handle it
        }
    }
    

}