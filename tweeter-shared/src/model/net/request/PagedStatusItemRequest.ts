import { StatusDto } from "../../dto/StatusDto";
import { UserDto } from "../../dto/UserDto";

export interface PagedStatusItemRequest {
    readonly token: string,
    readonly userAlias: string,
    readonly pageSize: number,
    readonly lastItem: StatusDto | null
}