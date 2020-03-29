import { Customer } from "./customer";
import { GenderType } from "./signup-info";

export class User {
    id: number;
    email: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    gender: GenderType;
    birthday: Date;
    is_activ: boolean;
    creation_timestamp: Date;
    customers?: Customer[];
}
