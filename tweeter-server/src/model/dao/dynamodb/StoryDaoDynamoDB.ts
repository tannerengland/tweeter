import { FakeData, Follow, Status, StatusDto, User, UserDto } from "tweeter-shared";
import { UserDao } from "../UserDao";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
    ScanCommand
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { StoryDao } from "../StoryDao";
import { DataPage } from "../DataPage";

export class StoryDaoDynamoDB implements StoryDao {
    readonly tableName = "stories";

    readonly timestamp = "timestamp"; 
    readonly post = "post";
    readonly firstName = "firstName";
    readonly lastName = "lastName";
    readonly author_alias = "author_alias";
    readonly imageUrl = "imageUrl";
    // readonly author_alias = "author_alias";
    // readonly timestamp = "timestamp"; 
    // readonly status = "status";
    // readonly firstName = "firstName";
    // readonly lastName = "lastName";
    // readonly imageUrl = "imageUrl";


    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    public async postStory(currStatus: StatusDto): Promise<void>{
        const params = {
            TableName: this.tableName,
            Item: {
                [this.author_alias]: currStatus.user.alias,
                [this.timestamp]: currStatus.timestamp,
                [this.post]: currStatus.post,
                [this.firstName]: currStatus.user.firstName,
                [this.lastName]: currStatus.user.lastName,
                [this.imageUrl]: currStatus.user.imageUrl

            },
        };
    
        try {
            await this.client.send(new PutCommand(params));
            // Return the created authToken
        } catch (error) {
            console.error("Failed to post story", error);
        }
        
    };

    // public async getStoriesPage(authorAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<DataPage<Status>> {
    //   const params = {
    //     TableName: this.tableName,
    //     Key: {[this.author_alias]: authorAlias},
    //   };
    //   const stories: StatusDto[] = []


    //   try {
    //     const output = await this.client.send(new ScanCommand(params));
        
    //     if (output.Items == null) {
    //       return null;
    //     }

    //     // const stories: StatusDto[] = []



    //     const currUser: User = new User(
    //       output.Items[0][this.firstName],
    //       output.Items[0][this.lastName],
    //       output.Items[0][this.author_alias],
    //       output.Items[0][this.imageUrl]
    //       );

    //     for (const item of output.Items) {
    //       const currStory: StatusDto = new Status(
    //         item[this.post],
    //         currUser,
    //         item[this.timestamp]
    //         ).dto;

    //         // JSON.parse([item.status])

          
    //       stories.push(currStory);
    //     }

    //     return stories;

    //   }
    //   catch (error) {
    //     console.error("Failed to get stories", error);
    //   }
    //   return stories;

    // }

    // public async getStoriesPage(author_alias: string, pageSize: number, lastItem: StatusDto | null): Promise<DataPage<StatusDto>> {
    //   const params = {
    //     TableName: this.tableName,
    //     KeyConditionExpression: `${this.author_alias} = :author_alias`,
    //     ExpressionAttributeValues: {
    //       ":author_alias": author_alias,
    //     },
    //     Limit: pageSize,
    //     ExclusiveStartKey: lastItem
    //       ? {
    //         [this.author_alias]: lastItem.user.alias,
    //         [this.timestamp]: lastItem.timestamp,
    //       }
    //       : undefined,
    //   };
    
    //   const items: StatusDto[] = [];
    
    //   try {
    //     const data = await this.client.send(new QueryCommand(params));
    //     const hasMorePages = data.LastEvaluatedKey !== undefined;

    //     let currUser: User;

    //     if (data.Items != null){
    //         currUser = new User(
    //         data.Items[0][this.firstName],
    //         data.Items[0][this.lastName],
    //         data.Items[0][this.author_alias],
    //         data.Items[0][this.imageUrl]
    //       );
    //     }

    //     data.Items?.forEach((item) => 

    //       items.push(
    //         new Status(
    //           item[this.post],
    //           currUser,
    //           item[this.timestamp]
    //         ).dto
    //       )
    //     );
    
    //     return new DataPage<StatusDto>(items, hasMorePages);
    
    //   } catch (error) {
    //     console.error("Error fetching stories:", error);
    //     throw error; // Rethrow error to let calling function handle it
    //   }

    // }

    public async getStoriesPage(author_alias: string, pageSize: number, lastItem: StatusDto | null): Promise<DataPage<StatusDto>> {
      const params = {
          TableName: this.tableName,
          KeyConditionExpression: `${this.author_alias} = :author_alias`,
          ExpressionAttributeValues: {
              ":author_alias": author_alias,
          },
          Limit: pageSize,
          ExclusiveStartKey: lastItem
              ? {
                  [this.author_alias]: lastItem.user.alias,
                  [this.timestamp]: lastItem.timestamp,
              }
              : undefined,
      };
  
      const items: StatusDto[] = [];
      console.log("Query parameters:", params); // Debug log
  
      try {
          const data = await this.client.send(new QueryCommand(params));
          console.log("Fetched items:", data.Items); // Debug log
          const hasMorePages = data.LastEvaluatedKey !== undefined;
  
          data.Items?.forEach((item) => {
              const currUser = new User(
                  item[this.firstName],
                  item[this.lastName],
                  item[this.author_alias],
                  item[this.imageUrl]
              );
  
              items.push(
                  new Status(
                      item[this.post],
                      currUser,
                      item[this.timestamp]
                  ).dto
              );
          });
  
          // Deduplicate items
          // const uniqueItems = Array.from(
          //     new Map(
          //         items.map((item) => [`${item.user.alias}-${item.timestamp}`, item])
          //     ).values()
          // );
  
          return new DataPage<StatusDto>(items, hasMorePages);
      } catch (error) {
          console.error("Error fetching stories:", error);
          throw error; // Rethrow error to let calling function handle it
      }
  }
  
  

  
  
}