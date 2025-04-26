export interface PublicUser {
    id: number;
    firstName: string;
    lastName: string;
    middleName?: string;
    login: string;
}

export interface NewUserInput {
    firstName: string;
    lastName: string;
    middleName?: string;
    login: string;
    password: string;
}

export interface FullUser extends PublicUser {
    createdAt: Date;
    updatedAt: Date;
    managerId?: number;
}

export interface Assignee {
    id: number,
    name: string,
} 