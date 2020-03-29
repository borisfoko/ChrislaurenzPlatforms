import { User } from "./user";

export class Blog {
    id: number;
    title?: string;
    body?: string;
    creation_timestamp?: Date;
    image?: string;
    user?: User;
    posts?: Post[];
}

export class Post {
    id: number;
    title?: string;
    body?: string;
    creation_timestamp?: Date;
    image?: string;
    is_active?: boolean;
    user?: User;
}