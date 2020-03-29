import { Customer } from "./customer";

export type GenderType = 'M' | 'F' | 'U';

export class SignUpInfo {
    email: string;
    firstname: string;
    middlename?: string;
    lastname: string
    gender: GenderType;
    birthday: Date;
    roles: string[];
    password: string;
    customer?: Customer;
    lang?: string;
 
    constructor(email: string, firstname: string, lastname: string, gender: GenderType, birthday: Date, password: string, middlename?: string, customer?: Customer, lang?: string) {
        this.email = email;
        this.firstname = firstname;
        this.middlename = middlename;
        this.lastname = lastname;
        this.gender = gender;
        this.birthday = birthday;
        this.password = password;
        this.roles = ['user'];
        this.customer = customer;
        this.lang = lang;
    }
}