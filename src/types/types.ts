export interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Certificate {
    name: String
    authority: String
    licenseNo: String
    createdAt: Date;
    updatedAt: Date;
    // Foreign key to User
    user: number;
}