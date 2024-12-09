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
  import { DynamoDBClient, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { FollowDao } from "../FollowDao";
import { DataPage } from "../../util/DataPage";
import { UserDaoDynamoDB } from "./UserDaoDynamoDB";
import { DaoFactory } from "../DaoFactory";
import { DaoFactoryDynamoDB } from "./DaoFactoryDynamoDB";

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
    // private factory: DaoFactoryDynamoDB = new DaoFactoryDynamoDB();
    // private userDao = this.factory.createUserDao();



    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    private batchSize: number = 25;

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
            // console.error("Error following user:", error);
            throw new Error("Error following user");

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
            // console.error("Error unfollowing user:", error);
            throw new Error("Error unfollowing user");

            throw error; // Re-throw the error for higher-level handling
        }
    }

    // public async getFollowerCount(userAlias: string): Promise<number> {
    //     const params = {
    //         TableName: this.tableName,
    //         IndexName: this.indexName, // Use the GSI if followers are indexed by followee_handle
    //         KeyConditionExpression: `${this.followeeAlias} = :userAlias`,
    //         ExpressionAttributeValues: {
    //             ":userAlias": userAlias,
    //         },
    //         // Select: "COUNT", // Only return the count, not the items
    //     };
    
    //     try {
    //         const result = await this.client.send(new QueryCommand(params));
    //         return result.Count || 0;
    //     } catch (error) {
    //         // console.error("Error getting follower count:", error);
    //         throw new Error("Error getting follower count");

    //         throw error;
    //     }
    // }
    
    // public async getFolloweeCount(userAlias: string): Promise<number> {
    //     const params = {
    //         TableName: this.tableName,
    //         KeyConditionExpression: `${this.followerAlias} = :userAlias`,
    //         ExpressionAttributeValues: {
    //             ":userAlias": userAlias,
    //         },
    //         // Select: "COUNT", // Only return the count, not the items
    //     };
    
    //     try {
    //         const result = await this.client.send(new QueryCommand(params));
    //         return result.Count || 0;
    //     } catch (error) {
    //         // console.error("Error getting followee count:", error);
    //         throw new Error("Error getting followee count");

    //         throw error;
    //     }
    // }
    
    private async getCount(keyAlias: string, keyAliasValue: string, indexName?: string): Promise<number> {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: `${keyAlias} = :key_value`,
            ExpressionAttributeValues: {
                ":key_value": keyAliasValue,
            },
            IndexName: indexName,
        };
    
        try {
            const result = await this.client.send(new QueryCommand(params));
            return result.Count || 0;
        } catch (error) {
            throw new Error(`Error getting count for ${keyAlias}: ${error}`);
        }
    }
    
    public async getFollowerCount(userAlias: string): Promise<number> {
        return this.getCount(this.followeeAlias, userAlias, this.indexName);
    }
    
    public async getFolloweeCount(userAlias: string): Promise<number> {
        return this.getCount(this.followerAlias, userAlias);
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
            // console.error("Error checking follower status:", error);
            throw new Error("Error checking follower status");

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

    // public async getPageOfFollowees(
    //     followerAlias: string, 
    //     pageSize: number, 
    //     lastFolloweeAlias?: string
    // ): Promise<DataPage<UserDto>> {
    //     const params = {
    //         TableName: this.tableName,
    //         KeyConditionExpression: `${this.followerAlias} = :follower_handle`,
    //         ExpressionAttributeValues: {
    //             ":follower_handle": followerAlias,
    //         },
    //         Limit: pageSize,
    //         ExclusiveStartKey: lastFolloweeAlias
    //             ? {
    //                 [this.followerAlias]: followerAlias,
    //                 [this.followeeAlias]: lastFolloweeAlias
    //             }
    //             : undefined,
    //     };
    
    //     const items: UserDto[] = [];
    
    //     try {
    //         const data = await this.client.send(new QueryCommand(params));
    //         const hasMorePages = data.LastEvaluatedKey !== undefined;
    
    //         if (data.Items) {
    //             for (const item of data.Items) {
    //                 const user = await this.userDao.getUser(item[this.followeeAlias]); // Ensure async handling
    //                 if (user) {
    //                     items.push(user);
    //                 }
    //             }
    //         }
    
    //         return new DataPage<UserDto>(items, hasMorePages);
    
    //     } catch (error) {
    //         // console.error("Error fetching followees:", error);
    //         throw new Error("Error fetching followees");

    //         throw error; // Rethrow error to let the calling function handle it
    //     }
    // }

    // public async getPageOfFollowers(
    //     followeeAlias: string, 
    //     pageSize: number, 
    //     lastFollowerAlias?: string
    // ): Promise<DataPage<UserDto>> {
    //     const params = {
    //         KeyConditionExpression: this.followeeAlias + " = :loc",
    //         ExpressionAttributeValues: {
    //           ":loc": followeeAlias,
    //         },
    //         TableName: this.tableName,
    //         IndexName: this.indexName,
    //         Limit: pageSize,
    //         ExclusiveStartKey:
    //         lastFollowerAlias === undefined
    //             ? undefined
    //             : {
    //                 [this.followerAlias]: lastFollowerAlias,
    //                 [this.followeeAlias]: followeeAlias,
    //               },
    //       };
    
    //     const items: UserDto[] = [];
    
    //     try {
    //         const data = await this.client.send(new QueryCommand(params));
    //         const hasMorePages = data.LastEvaluatedKey !== undefined;
    
    //         if (data.Items) {
    //             for (const item of data.Items) {
    //                 const user = await this.userDao.getUser(item[this.followerAlias]); // Fetch user info
    //                 if (user) {
    //                     items.push(user);
    //                 }
    //             }
    //         }
    
    //         return new DataPage<UserDto>(items, hasMorePages);
    
    //     } catch (error) {
    //         // console.error("Error fetching followers:", error);
    //         throw new Error("Error fetching followers");

    //         throw error;
    //     }
    // }

    private async getPage(
        keyAlias: string,
        keyAliasValue: string,
        pageSize: number,
        indexName?: string,
        lastAliasKey?: string,
        lastAliasValue?: string
    ): Promise<DataPage<string>> {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: `${keyAlias} = :key_value`,
            ExpressionAttributeValues: {
                ":key_value": keyAliasValue,
            },
            IndexName: indexName,
            Limit: pageSize,
            ExclusiveStartKey: lastAliasKey && lastAliasValue
                ? {
                    [keyAlias]: keyAliasValue,
                    [lastAliasKey]: lastAliasValue,
                }
                : undefined,
        };
    
        const items: string[] = [];
    
        try {
            const data = await this.client.send(new QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey !== undefined;

            if (data.Items) {
                const aliasToFetch = keyAlias === this.followerAlias ? this.followeeAlias : this.followerAlias;

                for (const item of data.Items) {
                    items.push(item[aliasToFetch]);
                }
            }

                    // if (data.Items) {
        //   const aliasToFetch = keyAlias === this.followerAlias ? this.followeeAlias : this.followerAlias;

        //   for (const item of data.Items) {
        //       const user = await this.userDao.getUser(item[aliasToFetch]); // Ensure async handling
        //       if (user) {
        //           items.push(user);
        //       }
        //   }
        // }
            const dataItems = data.Items ? items : []; // Convert to string[] or empty array



            return new DataPage<string>(dataItems, hasMorePages);
    

            // console.log("dao hasMore: " + hasMorePages);

    
            // return new DataPage<UserDto>(items, hasMorePages);
        } catch (error) {
            throw new Error(`Error fetching ${keyAlias}: ${error}`);
        }
    }
    
    public async getPageOfFollowees(
        followerAlias: string,
        pageSize: number,
        lastFolloweeAlias?: string
    ): Promise<DataPage<string>> {
        return this.getPage(
            this.followerAlias,
            followerAlias,
            pageSize,
            undefined,
            this.followeeAlias,
            lastFolloweeAlias
        );
    }
    
    public async getPageOfFollowers(
        followeeAlias: string,
        pageSize: number,
        lastFollowerAlias?: string
    ): Promise<DataPage<string>> {
        return this.getPage(
            this.followeeAlias,
            followeeAlias,
            pageSize,
            this.indexName,
            this.followerAlias,
            lastFollowerAlias
        );
    }
    

    // public async getFollowers(userAlias: string): Promise<string[]> {
    //     const params = {
    //         TableName: this.tableName,
    //         IndexName: this.indexName,
    //         KeyConditionExpression: `${this.followeeAlias} = :userAlias`,
    //         ExpressionAttributeValues: {
    //             ":userAlias": userAlias,
    //         },
    //     };
    
    //     const followers: string[] = [];
    
    //     try {
    //         const data = await this.client.send(new QueryCommand(params));
    
    //         if (data.Items) {
    //             for (const item of data.Items) {
    //                 // Fetch each user's details using UserDao and convert to UserDto
    //                 // const user = await this.userDao.getUser(item[this.followerAlias]);
    //                 // if (user) {
    //                     followers.push(item[this.followerAlias]);
    //                 // }
    //             }
    //         }
    
    //         return followers;
    //     } catch (error) {
    //         // console.error("Error fetching followers:", error);
    //         throw new Error("Error fetching followers");

    //         // throw error;
    //     }
    // }

    public async getFollowers(followeeAlias: string, lastFollower?: Record<string, any>): Promise<[string[],  Record<string, any> | undefined, boolean]> {
        const params = {
            TableName: this.tableName,
            IndexName: this.indexName,
            KeyConditionExpression: `${this.followeeAlias} = :userAlias`,
            ExpressionAttributeValues: {
                ":userAlias": followeeAlias,
            },
            Limit: 25,
            ...(lastFollower ? { ExclusiveStartKey: lastFollower } :{})
        };
    
    
        try {
            const data = await this.client.send(new QueryCommand(params));
    
            // if (data.Items) {
                // for (const item of data.Items) {
                //     // Fetch each user's details using UserDao and convert to UserDto
                //     // const user = await this.userDao.getUser(item[this.followerAlias]);
                //     // if (user) {
                //         followers.push(item[this.followerAlias]);
                //     // }
                // }
                const followers = data.Items?.map(
                    item => item[this.followerAlias]
                ) || [];

                const hasMore = !!data.LastEvaluatedKey;

                return [
                    followers,
                    data.LastEvaluatedKey,
                    hasMore
                ];

            // }
    
        } catch (error) {
            // console.error("Error fetching followers:", error);
            throw new Error("Error fetching followers");

            // throw error;
        }
    }

    // public async getFollowers(userAlias: string): Promise<string[]> {
    //     const followers: string[] = [];
    //     let lastEvaluatedKey: Record<string, any> | undefined = undefined;

    //     try {
    //         do {
    //             const params: QueryCommandInput = {
    //                 TableName: this.tableName,
    //                 IndexName: this.indexName,
    //                 KeyConditionExpression: `${this.followeeAlias} = :userAlias`,
    //                 ExpressionAttributeValues: {
    //                     ":userAlias": { S: userAlias }, // Wrapping the string in an AttributeValue
    //                 },
    //                 ExclusiveStartKey: lastEvaluatedKey, // For paginated queries
    //             };

    //             const data = await this.client.send(new QueryCommand(params));

    //             if (data.Items) {
    //                 followers.push(
    //                     ...data.Items.map((item) => item[this.followerAlias]?.S as string) // Extract string value
    //                 );
    //             }

    //             lastEvaluatedKey = data.LastEvaluatedKey; // Prepare for the next iteration
    //         } while (lastEvaluatedKey);

    //         return followers;
    //     } catch (error) {
    //         console.error("Error fetching followers:", error);
    //         throw new Error("Error fetching followers");
    //     }
    // }

    // public async getFollowers(userAlias: string): Promise<string[]> {
    //     const followers: string[] = [];
    //     let lastEvaluatedKey: Record<string, any> | undefined = undefined;

    //     try {
    //         do {
    //             const params: QueryCommandInput = {
    //                 TableName: this.tableName,
    //                 IndexName: this.indexName,
    //                 KeyConditionExpression: `${this.followeeAlias} = :userAlias`,
    //                 ExpressionAttributeValues: {
    //                     ":userAlias": userAlias, // Use plain string if using DynamoDBDocumentClient
    //                 },
    //                 ExclusiveStartKey: lastEvaluatedKey, // Pagination key
    //             };

    //             const data = await this.client.send(new QueryCommand(params));

    //             if (data.Items) {
    //                 followers.push(
    //                     ...data.Items.map((item) => item[this.followerAlias] as string)
    //                 );
    //             }

    //             lastEvaluatedKey = data.LastEvaluatedKey; // Prepare for the next iteration
    //         } while (lastEvaluatedKey);

    //         return followers;
    //     } catch (error) {
    //         console.error("Error fetching followers:", error);
    //         throw new Error("Error fetching followers");
    //     }
    // }
    
    
    
    // public async getFollowers(userAlias: string): Promise<string[]> {
    //     const followers: string[] = [];
    //     let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    
    //     try {
    //         do {
    //             const params: QueryCommandInput = {
    //                 TableName: this.tableName,
    //                 IndexName: this.indexName,
    //                 KeyConditionExpression: `${this.followeeAlias} = :userAlias`,
    //                 ExpressionAttributeValues: {
    //                     ":userAlias": { S: userAlias },
    //                 },
    //                 Limit: this.batchSize,
    //                 ExclusiveStartKey: lastEvaluatedKey,
    //             };
    
    //             const data = await this.client.send(new QueryCommand(params));
    
    //             if (data.Items) {
    //                 for (const item of data.Items) {
    //                     if (item[this.followerAlias] && item[this.followerAlias].S) {
    //                         followers.push(item[this.followerAlias].S);
    //                     }
    //                 }
    //             }
    
    //             lastEvaluatedKey = data.LastEvaluatedKey;
    //         } while (lastEvaluatedKey);
    
    //         return followers;
    //     } catch (error) {
    //         console.error("Error fetching followers:", error);
    //         throw new Error("Error fetching followers");
    //     }
    // }
    

}