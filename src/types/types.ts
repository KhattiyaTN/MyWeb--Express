export interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Contract {
    logoUrl: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    // Foreign key to User
    userId: number;
}

export interface Certificate {
    name: string;
    authority: string;
    licenseNo: string;
    createdAt: Date;
    updatedAt: Date;
    // Foreign key to User
    userId: number;
}

export interface Badge {
    name: string;
    createdAt: Date;
    updatedAt: Date;
    // Foreign key to User
    userId: number;
}

export interface Project {
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    // Foreign key to User
    userId: number;
}

export interface Image {
    url: string;
    createdAt: Date;
    updatedAt: Date;
    // Foreign keys
    badgeId?: number;
    certificationId?: number;
    contractId?: number;
    profileId?: number;
    projectId?: number;
    userId?: number;
}