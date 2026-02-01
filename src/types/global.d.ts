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

        bookings: IBooking[];
    }

    interface IBooking {
        checkIn: date;   // "2026-02-05"
        checkOut: date;  // "2026-02-10"
    }


    interface IHostInfo {
        hostId: number;
        hostName: string;
        avatarUrl: string | null;
        bio: string | null;
        address: string;
    }

    interface IAmenity {
        amenityId: number;
        amenityName: string;
        amenityIcon: string;
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

    interface IUserDetail {
        id: number;
        email: string;
        fullName: string;
        phone: string;
        address: string;
        bio: string;
        age: number;
        avatarUrl: string;
        status: string;
        role: {
            id: number;
            name: string;
        };
    }

    interface IReqUpdateProfileUser {
        id: number;
        fullName: string;
        phone: string;
        bio?: string;
        address?: string;
        age: number;
    }

    interface IReqUpdatePassword {
        oldPassword: string;
        newPassword: string;
    }

    interface IPaginationMeta {
        current: number;
        pageSize: number;
        total: number;
        pages: number;
    }

    interface IPropertyResponse {
        result: IProperty[];
        meta: IPaginationMeta;
    }

}