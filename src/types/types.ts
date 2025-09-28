export interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Contract {
    logoUrl: String;
    name: String;
    createdAt: Date;
    updatedAt: Date;
    // Foreign key to User
    userId: number;
}

export interface Profile {
    createdAt: Date;
    updatedAt: Date;
    // Foreign key to User
    userId: number;
}

export interface Certificate {
    name: String;
    authority: String;
    licenseNo: String;
    createdAt: Date;
    updatedAt: Date;
    // Foreign key to User
    user: number;
}

export interface Badge {
    name: String;
    createdAt: Date;
    updatedAt: Date;
    // Foreign key to User
    userId: number;
}

export interface Project {
    name: String;
    description: String;
    createdAt: Date;
    updatedAt: Date;
    // Foreign key to User
    userId: number;
}