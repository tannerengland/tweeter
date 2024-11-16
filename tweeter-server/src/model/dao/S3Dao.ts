import { User, UserDto } from "tweeter-shared";

export interface S3Dao {
    putImage: (fileName: string, imageStringBase64Encoded: string) => Promise<string>;
    // getImage: 
}