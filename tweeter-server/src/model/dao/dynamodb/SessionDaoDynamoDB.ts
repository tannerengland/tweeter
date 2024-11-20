import { AuthTokenDto, FakeData } from "tweeter-shared";
import { SessionDao } from "../SessionDao";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class SessionDaoDynamoDB implements SessionDao {
    readonly tableName = "sessions";
    // readonly indexName = "alias";
    readonly token = "token";
    readonly timestamp = "timestamp"; 
    readonly alias = "alias";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    public async createSession(alias: string, authToken: AuthTokenDto): Promise<AuthTokenDto | null> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.token]: authToken.token,
                [this.timestamp]: authToken.timestamp,
                [this.alias]: alias
            },
        };
    
        try {
            await this.client.send(new PutCommand(params));
            // Return the created authToken
            return authToken;
        } catch (error) {
            // console.error("Failed to create session:", error);
            throw new Error("Failed to create session");

            return null;
        }
    }
    

    public async verifySession(token: string): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Key: { [this.token]: token }
        };
        
        try {
            const output = await this.client.send(new GetCommand(params));
            
            if (!output.Item) {
                return false;
            }

            if (output.Item[this.timestamp] < Date.now()) {
                this.deleteSession(token);
                return false;
            }

            await this.updateSession(token);
    
            return true;
        } catch (error) {
            // console.error("Error verifying session:", error);
            throw new Error("Error verifying session");

            return false;
        }
    }
    
    
    public async deleteSession(token: string): Promise<void> { 
        const params = {
            TableName: this.tableName,
            Key: { [this.token]: token }
          };
          try {
            await this.client.send(new DeleteCommand(params));
        } catch (error) {
            // console.error("Error deleting session:", error);
            throw new Error("Error deleting session");

        }
    }

    public async updateSession(token: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: { [this.token]: token },
            ExpressionAttributeValues: {
                ":expirationChange": Date.now() + 600000
            },
            UpdateExpression: "SET #timestamp = :expirationChange",
            ExpressionAttributeNames: {
                "#timestamp": this.timestamp
            }
        };

        try {
            await this.client.send(new UpdateCommand(params));
            // console.log("Session updated successfully");
        } catch (error) {
            // console.error("Error updating session:", error);
            throw new Error("Error updating session");

        }
    }

    public async getAliasFromSession(token: string): Promise<string | null> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.token]: token,
            },
        };
    
        try {
            const result = await this.client.send(new GetCommand(params));
            
            if (!result.Item) {
                console.warn("Session not found for token:", token);
                return null; // No session found
            }
    
            return result.Item[this.alias]; // Return the alias associated with the token
        } catch (error) {
            // console.error("Failed to get user alias:", error);
            throw new Error("Failed to get user alias");

            return null; // Return null on failure
        }
    }
    



}