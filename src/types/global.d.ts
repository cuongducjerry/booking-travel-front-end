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

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    interface IProperty {
        id: number;
        title: string;
        address: string;
        pricePerNight: number;
        images: string[];
    }

    interface IPropertyDetail {
        id: number;
        title: string;
        description: string;
        address: string;
        city: string;

        pricePerNight: number;
        currency: string;
        maxGuests: number;

        status: string;

        createdAt: string;
        updatedAt: string;

        images: string[];

        amenities: IAmenity[];
        reviews: IReview[] | null;

        propertyType: string;

        host: IHostInfo;
    }

    interface IHostInfo {
        hostId: number;
        hostName: string;
        avatarUrl: string | null;
        bio: string | null;
        address: string;
    }

    interface IAmenity {
        id: number;
        name: string;
        icon?: string;
    }

    interface IReview {
        id: number;
        rating: number;
        comment: string;
        createdAt: string;
        user: {
            id: number;
            fullName: string;
            avatarUrl: string | null;
        };
    }

}