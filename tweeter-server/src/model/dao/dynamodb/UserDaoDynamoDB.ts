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

export class UserDaoDynamoDB implements UserDao {
    readonly tableName = "users";
    // readonly indexName = "alias";
    readonly alias = "alias";
    readonly firstName = "firstName"; 
    readonly lastName = "lastName";
    readonly imageUrl = "imageUrl";
    readonly password = "password";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    // public async getUser(alias: string): Promise<UserDto | null> {
    //     const params = {
    //         TableName: this.tableName,
    //         Key: {[this.alias]: alias,},
    //       };
    //       const output = await this.client.send(new GetCommand(params));
    //       return output.Item == null
    //         ? null
    //         : new User(
    //             output.Item[this.firstName],
    //             output.Item[this.lastName],
    //             output.Item[this.alias],
    //             output.Item[this.imageUrl]
    //           ).dto;
    // }
    public async getUser(alias: string): Promise<UserDto | null> {
        const params = {
            TableName: this.tableName,
            Key: { [this.alias]: alias }, // Ensure correct key setup
        };

        // console.log("alias passed into dao " + alias)
        
        try {
            const output = await this.client.send(new GetCommand(params));
    
            // Ensure output.Item is valid and contains expected fields
            if (!output.Item) {
                return null;
            }
    
            // Map the DynamoDB item to a UserDto object
            const user = new User(
                output.Item[this.firstName],
                output.Item[this.lastName],
                output.Item[this.alias],
                output.Item[this.imageUrl]
            ).dto;

            // console.log("dao " + user);
    
            return user; // Return the UserDto
        } catch (error) {
            // console.error("Error fetching user from DynamoDB:", error);
            throw new Error("Error fetching user from DynamoDB");

            return null; // Return null on error
        }
    }
    

  //   public async getUserPassword(alias: string): Promise<string | null> {
  //     const params = {
  //         TableName: this.tableName,
  //         Key: { [this.alias]: alias },
  //         ProjectionExpression: this.password // Retrieve only the password attribute
  //     };
  //     const output = await this.client.send(new GetCommand(params));
  
  //     // Return the password if found, otherwise return null
  //     return output.Item ? output.Item[this.password] : null;
  // }
  

    // public async createUser(user: UserDto, password: string): Promise<void> {
    //     const params = {
    //         TableName: this.tableName,
    //         Item: {
    //           [this.alias]: user.alias,
    //           [this.firstName]: user.firstName,
    //           [this.lastName]: user.lastName,
    //           [this.imageUrl]: user.imageUrl,
    //           [this.password]: password
    //         },
    //       };
    //       await this.client.send(new PutCommand(params));    }

    public async loginUser(alias: string): Promise<[ user: UserDto, password: string ] | null> {
      const params = {
          TableName: this.tableName,
          Key: { [this.alias]: alias },
          ProjectionExpression: `${this.alias}, ${this.firstName}, ${this.lastName}, ${this.imageUrl}, ${this.password}`
      };

        try {
      const output = await this.client.send(new GetCommand(params));
      

  
      if (output.Item == null) {
          return null;
      }
  
      // Extract user data and password
      const user: UserDto = {
          alias: output.Item[this.alias],
          firstName: output.Item[this.firstName],
          lastName: output.Item[this.lastName],
          imageUrl: output.Item[this.imageUrl],
      };
      const password: string = output.Item[this.password];
  
      return  [user, password];
    } catch (error) {
        // console.error("Error logging in user:", error);
        throw new Error("Error logging in user");

        return null;
    }
  }
  

//     public async registerUser(user: UserDto, password: string): Promise<UserDto | null> {
//       const params = {
//           TableName: this.tableName,
//           Item: {
//               alias: user.alias,
//               firstName: user.firstName,
//               lastName: user.lastName,
//               imageUrl: user.imageUrl,
//               password: password
//           },
//       };
  
//       try {
//           await this.client.send(new PutCommand(params));
          
//           // Return the UserDto fields
//           return user;
//       } catch (error) {
//           console.error("Failed to create user:", error);
//           return null;
//       }
//   }

public async registerUser(user: UserDto, password: string): Promise<UserDto | null> {
    // Check if user already exists
    const getParams = {
        TableName: this.tableName,
        Key: { alias: user.alias },
    };

    try {
        const getResult = await this.client.send(new GetCommand(getParams));

        if (getResult.Item) {
            // User with this alias already exists, throw an error
            throw new Error(`User with alias "${user.alias}" already exists.`);
        }

        // User does not exist, so create a new user
        const putParams = {
            TableName: this.tableName,
            Item: {
                alias: user.alias,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl,
                password: password
            },
        };

        await this.client.send(new PutCommand(putParams));
        
        // Return the UserDto fields
        return user;
    } catch (error) {
        // console.error("Failed to register user:", error);
        throw new Error("Failed to register user");

        return null;
    }
}

  
  
}