export { };

declare global {

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IUser {
        id: number;
        email: string;
        fullName: string;
        avatarUrl: string;
        role: string;
    }

    interface ILogin {
        user: IUser;
        permissions: string[];
        access_token: string;
    }

    interface IRegister {
        _id: string;
        email: string;
        fullName: string;
    }

    interface IRegisterPayload {
        fullName: string;
        email: string;
        password: string;
        phone: string;
        address: string;
        age: number;
        role: {
            id: 3 | 4;
        };
    }

    interface IFetchAccount {
        user: IUser
    }

}