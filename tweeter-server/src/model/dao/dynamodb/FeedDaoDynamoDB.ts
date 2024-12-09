import { FakeData, Follow, Status, StatusDto, User, UserDto } from "tweeter-shared";
import { UserDao } from "../UserDao";
import {
    BatchWriteCommand,
    BatchWriteCommandInput,
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FeedDao } from "../FeedDao";
import { DataPage } from "../../util/DataPage";
import { UserDaoDynamoDB } from "./UserDaoDynamoDB";
import { DaoFactory } from "../DaoFactory";
import { DaoFactoryDynamoDB } from "./DaoFactoryDynamoDB";
import { StatusItem } from "../../util/StatusItem";

export class FeedDaoDynamoDB implements FeedDao {
    readonly tableName = "feed";
    // readonly indexName = "follows_index";
    readonly receiverAlias = "receiver_alias"; 
    readonly timestamp = "timestamp"; 
    readonly authorAlias = "author_alias";
    readonly post = "post";

    // readonly followeeFirstName = "followee_first_name";
    // readonly followeeLastName = "followee_last_name";
    // readonly followerFirstName = "follower_first_name";
    // readonly followerLastName = "follower_last_name";
    // readonly followerImageUrl = "follower_image";
    // readonly followeeImageUrl = "followee_image";
    // private factory: DaoFactoryDynamoDB = new DaoFactoryDynamoDB();
    // private userDao = this.factory.createUserDao();
    // private followDao = this.factory.createFollowDao();


    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    // public async postFeed(newStatus: StatusDto, followers: UserDto[]): Promise<void> {
    //     try {
    //             // let followers = await this.followDao.getFollowers(newStatus.user.alias);
    //             for (const follower of followers) {
    //                 const params = {
    //                     TableName: this.tableName,
    //                     Item: {
    //                         [this.receiverAlias]: follower.alias,
    //                         [this.timestamp]: newStatus.timestamp,
    //                         [this.post]: newStatus.post,
    //                         [this.authorAlias]: newStatus.user.alias
    //                     },
    //                 };
    //                 try {
    //                     await this.client.send(new PutCommand(params));
    //                 } catch (error) {
    //                     console.error("Failed to post feed to a user", error);
    //                 }
    //         }
    //     }
    //     catch(error) {
    //         // console.error("Error posting feed", error);
    //         throw new Error("Error posting feed");

    //         // throw error;
    //     }
    // }

    // public async postFeed(newStatus: StatusDto, followers: string[]): Promise<void> {
    //     try {
    //             // let followers = await this.followDao.getFollowers(newStatus.user.alias);
    //             for (const follower of followers) {
    //                 const params = {
    //                     TableName: this.tableName,
    //                     Item: {
    //                         [this.receiverAlias]: follower,
    //                         [this.timestamp]: newStatus.timestamp,
    //                         [this.post]: newStatus.post,
    //                         [this.authorAlias]: newStatus.user.alias
    //                     },
    //                 };
    //                 try {
    //                     await this.client.send(new PutCommand(params));
    //                 } catch (error) {
    //                     console.error("Failed to post feed to a user", error);
    //                 }
    //         }
    //     }
    //     catch(error) {
    //         // console.error("Error posting feed", error);
    //         throw new Error("Error posting feed");

    //         // throw error;
    //     }
    // }

    public async postFeed(newStatus: StatusDto, followers: string[]): Promise<void> {
        try {
            const BATCH_SIZE = 25;
    
            // Break followers into batches of 25
            for (let i = 0; i < followers.length; i += BATCH_SIZE) {
                const batch = followers.slice(i, i + BATCH_SIZE);
    
                // Create the batch write request
                const writeRequests = batch.map((follower) => ({
                    PutRequest: {
                        Item: {
                            [this.receiverAlias]: follower,
                            [this.timestamp]: newStatus.timestamp,
                            [this.post]: newStatus.post,
                            [this.authorAlias]: newStatus.user.alias,
                        },
                    },
                }));
    
                const params = {
                    RequestItems: {
                        [this.tableName]: writeRequests,
                    },
                };
    
                try {
                    // Send the batch write command
                    await this.client.send(new BatchWriteCommand(params));
                    console.log(`Batch of ${batch.length} written successfully.`);
                } catch (error) {
                    console.error("Failed to write batch to DynamoDB", error);
                }
            }
        } catch (error) {
            console.error("Error posting feed", error);
            throw new Error("Error posting feed");
        }
    }

    // public async postFeed(newStatus: StatusDto, followers: string[]): Promise<void> {
    //     try {
    //         const items = followers.map((follower) => ({
    //             PutRequest: {
    //                 Item: {
    //                     [this.receiverAlias]: follower,
    //                     [this.timestamp]: newStatus.timestamp,
    //                     [this.post]: newStatus.post,
    //                     [this.authorAlias]: newStatus.user.alias,
    //                 },
    //             },
    //         }));

    //         // Break items into batches of 25
    //         const batches = this.chunkArray(items, 25);

    //         for (const batch of batches) {
    //             const params: BatchWriteCommandInput = {
    //                 RequestItems: {
    //                     [this.tableName]: batch,
    //                 },
    //             };

    //             try {
    //                 const result = await this.client.send(new BatchWriteCommand(params));
    //                 if (result.UnprocessedItems && Object.keys(result.UnprocessedItems).length > 0) {
    //                     console.error("Some items were not processed:", result.UnprocessedItems);
    //                     // Handle retries here if needed
    //                 }
    //             } catch (error) {
    //                 console.error("Failed to batch write items", error);
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Error posting feed", error);
    //         throw new Error("Error posting feed");
    //     }
    // }

    // // Utility function to split array into chunks
    // private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    //     const chunks: T[][] = [];
    //     for (let i = 0; i < array.length; i += chunkSize) {
    //         chunks.push(array.slice(i, i + chunkSize));
    //     }
    //     return chunks;
    // }

    // public async postFeed(newStatus: StatusDto, followers: string[]): Promise<void> {
    //     try {
    //         // Create items for each follower
    //         const items = followers.map((follower) => ({
    //             PutRequest: {
    //                 Item: {
    //                     [this.receiverAlias]: follower,
    //                     [this.timestamp]: newStatus.timestamp,
    //                     [this.post]: newStatus.post,
    //                     [this.authorAlias]: newStatus.user.alias,
    //                 },
    //             },
    //         }));
    
    //         // Break items into batches of 25
    //         const batches = this.chunkArray(items, 25);
    
    //         for (const batch of batches) {
    //             const params: BatchWriteCommandInput = {
    //                 RequestItems: {
    //                     [this.tableName]: batch,
    //                 },
    //             };
    
    //             try {
    //                 const result = await this.client.send(new BatchWriteCommand(params));
    //                 if (result.UnprocessedItems && Object.keys(result.UnprocessedItems).length > 0) {
    //                     console.warn("Some items were not processed:", result.UnprocessedItems);
    //                     // Optionally retry unprocessed items here
    //                 }
    //             } catch (error) {
    //                 console.error("Error writing batch to DynamoDB:", error);
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Error posting feed:", error);
    //         throw new Error("Error posting feed");
    //     }
    // }
    
    // // Utility function to split an array into chunks
    // private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    //     const chunks: T[][] = [];
    //     for (let i = 0; i < array.length; i += chunkSize) {
    //         chunks.push(array.slice(i, i + chunkSize));
    //     }
    //     return chunks;
    // }

    // public async getFeedPage(
    //     receiver_alias: string, 
    //     pageSize: number, 
    //     lastItem: StatusDto | null
    // ): Promise<DataPage<StatusDto>> {
    //     const params = {
    //         TableName: this.tableName,
    //         KeyConditionExpression: `${this.receiverAlias} = :receiver_alias`,
    //         ExpressionAttributeValues: {
    //             ":receiver_alias": receiver_alias,
    //         },
    //         Limit: pageSize,
    //         ScanIndexForward: false, // Reverse the order to descending
    //         ExclusiveStartKey: lastItem
    //             ? {
    //                 [this.authorAlias]: lastItem.user.alias,
    //                 [this.timestamp]: lastItem.timestamp,
    //             }
    //             : undefined,
    //     };
    
    //     const items: StatusDto[] = [];
    //     console.log("Query parameters:", params); // Debug log
    
    //     try {
    //         const data = await this.client.send(new QueryCommand(params));
    //         console.log("Fetched items:", data.Items); // Debug log
    //         const hasMorePages = data.LastEvaluatedKey !== undefined;
    
    //         data.Items?.forEach(async (item) => {
                
    //             const currUserDto: UserDto | null = await this.userDao.getUser(item.author_alias);

    //             let currUser: User | null = User.fromDto(currUserDto);

    //             if (currUserDto != null && currUser != null) {

    //                 items.push(
    //                     new Status(
    //                         item[this.post],
    //                         currUser,
    //                         item[this.timestamp]
    //                     ).dto
    //                 );
    //             }
    //             else {
    //                 console.error("Error fetching status for:" + item.author_alias);
    //             }
    //         });
    
    //         return new DataPage<StatusDto>(items, hasMorePages);
    //     } catch (error) {
    //         console.error("Error fetching feed:", error);
    //         throw error; // Rethrow error to let calling function handle it
    //     }
    // }
    public async getFeedPage(
        receiver_alias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<DataPage<StatusItem>> {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: `${this.receiverAlias} = :receiver_alias`,
            ExpressionAttributeValues: {
                ":receiver_alias": receiver_alias,
            },
            Limit: pageSize,
            ScanIndexForward: false, // Reverse order to descending
            ExclusiveStartKey: lastItem
                ? {
                    [this.receiverAlias]: receiver_alias, // Partition key
                    [this.timestamp]: lastItem.timestamp, // Sort key
                }
                : undefined,
        };
    
        const items: string[] = [];
        console.log("Query parameters:", params); // Debug log
    
        try {
            const data = await this.client.send(new QueryCommand(params));
            console.log("Fetched items:", data.Items); // Debug log
    
            const hasMorePages = data.LastEvaluatedKey !== undefined;

            // if (data.Items != null) {
            //     return new DataPage<Record<string, any>[]>(data.Items, hasMorePages);
            // }



            // data.Items?.forEach((item) => {
            //     // console.log("timestamp:" + item[this.timestamp]);
            //     // console.log("post:" + item[this.post]);
            //     // console.log("alias:" + item[this.authorAlias]);

                

            //     statusItems.push(item[this.timestamp], item[this.post], item[this.authorAlias])
            //     // console.log(statusItems);
            // });
            const statusItems: StatusItem[] = data.Items?.map(item => ({
                timestamp: item[this.timestamp],
                post: item[this.post],
                author_alias: item[this.authorAlias],
            })) || []; 

            return new DataPage<StatusItem>(statusItems, hasMorePages);

    
            // if (data.Items) {
            //     for (const item of data.Items) {

            //         // items.push(item[this.authorAlias]);
            //         const currUserDto: UserDto | null = await this.userDao.getUser(item[this.authorAlias]);
            //         const currUser: User|null = User.fromDto(currUserDto);

            //         if (currUserDto && currUser) {
    
            //             items.push(
            //                 new Status(
            //                     item[this.post],
            //                     currUser,
            //                     item[this.timestamp]
            //                 ).dto
            //             );
            //         } else {
            //             console.error("Error fetching user for status:", item[this.authorAlias]);
            //         }
            //     }
            // }
    
            // return new DataPage<string>(items, hasMorePages);
        } catch (error) {
            // console.error("Error fetching feed:", error);
            throw new Error("Error fetching feed");

            throw error; // Rethrow error to let the calling function handle it
        }
    }
    

}