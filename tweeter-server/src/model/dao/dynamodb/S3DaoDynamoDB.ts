import { AuthTokenDto, FakeData } from "tweeter-shared";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
  import {
    S3Client,
    PutObjectCommand,
    ObjectCannedACL,
  } from "@aws-sdk/client-s3";
  
import { S3Dao } from "../S3Dao";

export class S3DaoDynamoDB implements S3Dao {

    async putImage(
        fileName: string,
        imageStringBase64Encoded: string
      ): Promise<string> {
        let decodedImageBuffer: Buffer = Buffer.from(
          imageStringBase64Encoded,
          "base64"
        );
        const s3Params = {
          Bucket: "profilepicturebucketcs340",
          Key: "image/" + fileName,
          Body: decodedImageBuffer,
          ContentType: "image/png",
          ACL: ObjectCannedACL.public_read,
        };
        const c = new PutObjectCommand(s3Params);
        const client = new S3Client({ region: "us-east-2" });
        try {
          await client.send(c);
          return (
          `https://profilepicturebucketcs340.s3.us-east-2.amazonaws.com/image/${fileName}`
          );
        } catch (error) {
          throw Error("s3 put image failed with: " + error);
        }
      }


}