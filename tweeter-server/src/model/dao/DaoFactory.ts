import { S3DaoDynamoDB } from "./dynamodb/S3DaoDynamoDB";
import { SessionDaoDynamoDB } from "./dynamodb/SessionDaoDynamoDB";
import { UserDaoDynamoDB } from "./dynamodb/UserDaoDynamoDB";
import { StoryDaoDynamoDB } from "./dynamodb/StoryDaoDynamoDB";
import { FollowDaoDynamoDB } from "./dynamodb/FollowDaoDynamoDB";
import { FeedDaoDynamoDB } from "./dynamodb/FeedDaoDynamoDB";
import { SqsDaoDynamoDB } from "./dynamodb/SqsDaoDynamoDB";

export interface DaoFactory {
    createUserDao(): UserDaoDynamoDB;
    createSessionDao(): SessionDaoDynamoDB;
    createS3Dao(): S3DaoDynamoDB;
    createStoryDao(): StoryDaoDynamoDB;
    createFollowDao(): FollowDaoDynamoDB;
    createFeedDao(): FeedDaoDynamoDB;
    createSqsDao(): SqsDaoDynamoDB;
}
