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
import { FeedDao } from "../FeedDao";
import { DataPage } from "../DataPage";
import { UserDaoDynamoDB } from "./UserDaoDynamoDB";
import { DaoFactory } from "../DaoFactory";
import { DaoFactoryDynamoDB } from "./DaoFactoryDynamoDB";

export class FeedDaoDynamoDB implements FeedDao {
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
    private factory: DaoFactoryDynamoDB = new DaoFactoryDynamoDB();
    private userDao = this.factory.createUserDao();



    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    
    
    

}