import { User, AuthToken, FakeData, UserDto, AuthTokenDto } from "tweeter-shared";
import { Buffer } from "buffer";
import { DaoFactory } from "../dao/DaoFactory";
import { UserDao } from "../dao/UserDao";
import { SessionDao } from "../dao/SessionDao";
import { FollowDao } from "../dao/FollowDao";
import { StoryDao } from "../dao/StoryDao";
import { S3Dao } from "../dao/S3Dao";
// import bcrypt from 'bcryptjs';
// import {SHA256} from "crypto-js";
// import {genSalt, hash} from "bcryptjs";


export class UserService {

  // private factory: DaoFactory = new DaoFactory();
  // private userDao = this.factory.createUserDao();
  // private sessionDao = this.factory.createSessionDao();
  // private s3Dao = this.factory.createS3Dao();
  private factory: DaoFactory;
  private userDao: UserDao;
  private sessionDao: SessionDao;
  private followDao: FollowDao;
  private storyDao: StoryDao;
  private s3Dao: S3Dao;


  constructor(daoFactory: DaoFactory) {
    this.factory = daoFactory;
    this.userDao = this.factory.createUserDao();
    this.sessionDao = this.factory.createSessionDao();
    this.followDao = this.factory.createFollowDao();
    this.storyDao = this.factory.createStoryDao();
    this.s3Dao = this.factory.createS3Dao();
  }

    public async login (
        alias: string,
        password: string
      ): Promise<[UserDto, AuthTokenDto]> {
        // TODO: Replace with the result of calling the server
        // const user = FakeData.instance.firstUser;

        // let realPassword = await this.userDao.getUserPassword(alias);

        // console.log("real PAssword" + realPassword);

        // let user = await this.userDao.getUser(alias);

        // const [user, realPassword] = await this.userDao.loginUser(alias);
        const result = await this.userDao.loginUser(alias);
    
    
        if (result === null) {
          throw new Error("Invalid alias or password");
        }

        const [ currUser, currPassword ] = result;

        // hash the password passed in
        // const hashedPassword = SHA256(password).toString();
        if (password != currPassword) {
          throw new Error("Invalid alias or password");
        }

        let auth = AuthToken.Generate();

        // let authTokenDto: AuthTokenDto = {
        //   token: AuthToken.gener,
        //   timestamp: 1234
        // }

        // set expiration
        auth.timestamp = auth.timestamp + 600000;

        let currAuth = await this.sessionDao.createSession(alias, auth.dto);

        if (currAuth === null) {
          throw new Error("Unable to create session");
        }

        //SessionDao.createSession(alias, password) => authToken
        //UserDao.getUser(alias) => user
        return [currUser, currAuth];
      };

      public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string,
        imageFileExtension: string
      ): Promise<[UserDto, AuthTokenDto]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        // const imageStringBase64: string =
        //   Buffer.from(userImageBytes).toString("base64");
    
        // TODO: Replace with the result of calling the server


        // const user = FakeData.instance.firstUser;
    
        // if (user === null) {
        //   throw new Error("Invalid registration");
        // }

        // const authToken = FakeData.instance.authToken;

        // UserDao.createUser(user) => user
        // SessionDao.createSession(alias, password) => authToken
        
        let imageUrl: string = await this.s3Dao.putImage(alias, userImageBytes);

        let userDto: UserDto = {
          firstName: firstName,
          lastName: lastName,
          alias: alias,
          imageUrl: imageUrl
        }

        // var bcrypt = require('bcryptjs');
        // var salt = bcrypt.genSaltSync(10);
        // var hash = this.hashPassword(password);
        // var salt = bcrypt.genSaltSync(10);
        // var hash = bcrypt.hashSync(password, salt);

        // let aliasCheck = await this.userDao.getUser(alias);

        // if (aliasCheck != null) {
        //   throw new Error("Alias already taken");
        // }

        // have createuser return a user or null

        //cryptojs
        // const CryptoJS = require("crypto-js");
        // const hashedPassword = SHA256(password).toString();

        // const salt = await genSalt(10);
        // const hashedPassword = await hash(password, salt);

        let currUser = await this.userDao.registerUser(userDto, password);
        // let currUser = await this.userDao.getUser(alias);

        if (currUser === null) {
          throw new Error("Invalid registration");
          // delete s3
        }


        // pass in alias and authtoken
        let auth = AuthToken.Generate();

        // let authTokenDto: AuthTokenDto = {
        //   token: AuthToken.gener,
        //   timestamp: 1234
        // }

        // set expiration
        auth.timestamp = auth.timestamp + 600000;

        let currAuth = await this.sessionDao.createSession(alias, auth.dto);

        if (currAuth === null) {
          throw new Error("Unable to create session");
        }

        return [currUser, currAuth];
      };

      public async getUser (
        token: string,
        alias: string
      ): Promise<UserDto | null> {
        // TODO: Replace with the result of calling server
                
        if (await this.sessionDao.verifySession(token) == false) {
          throw new Error("Not authorized");
        }

        // console.log(await this.sessionDao.verifySession(token));
        // console.log("alias passed into service "+alias);

        // return FakeData.instance.findUserByAlias(alias);

        // const user: UserDto | null = await this.userDao.getUser(alias);

        // return user ? user : null;
        const user = await this.userDao.getUser(alias);
        // console.log("service user " + user)

        return user; // Directly return user or null
      };

      public async logout (token: string): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        // await new Promise((res) => setTimeout(res, 1000));

        await this.sessionDao.deleteSession(token);
      };



}
