import type { NotificationType } from "@/utils/constants/notification.type";

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
        dateOfBirth?: string;
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
        images: IPropertyImage[];
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

        amenities: IAmenityDTO[];
        reviews: IReview[] | null;

        propertyType: string;

        host: IHostInfo;

        bookings: IBooking[];
        latitude: number;
        longitude: number;
    }

    interface IBooking {
        checkIn: string;   // "2026-02-05"
        checkOut: string;  // "2026-02-10"
    }


    interface IHostInfo {
        hostId: number;
        hostName: string;
        avatarUrl: string | null;
        bio: string | null;
        address: string;
    }

    interface IAmenityDTO {
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
        dateOfBirth?: string;
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
        dateOfBirth?: string;
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

    type BookingStatus = "NEW" | "CONFIRMED" | "CANCELLED" | "DONE" | "PENDING" | "CANCEL_REQUESTED";

    interface IBookingDetail {
        id: number;

        checkIn: string;   // ISO date
        checkOut: string;
        nights: number;

        pricePerNightSnapshot: number;
        currency: string;

        grossAmount: number;
        commissionRate: number;
        commissionFee: number;
        hostEarning: number;

        status: BookingStatus;

        createdAt: string;
        updatedAt: string;

        // ---- User info ----
        userId: number;
        userName: string;
        userEmail: string;

        // ---- Property info ----
        propertyId: number;
        propertyName: string;

        review?: {
            id: number;
            rating: number;
            comment: string;
        } | null;
    }

    interface IUserTable {
        id: number;
        email: string;
        fullName: string;
        phone?: string;
        address?: string;
        bio?: string;
        dateOfBirth?: string;
        avatarUrl?: string;

        status: string;

        role: {
            id: number;
            name: string;
        };

        createdAt?: string;
        updatedAt?: string;
        createdBy?: string;
        updatedBy?: string;
    }

    interface ICreateUserReq {
        email: string,
        password: string,
        fullName: string,
        phone: string,
        address: string,
        dateOfBirth?: string;
        role: {
            id: number
        }
    }

    interface IRole {
        id: number;
        name: string;
        description: string;
        createdAt?: string;
        updatedAt?: string;
        permissions: IPermission[];
    }

    interface IPermission {
        id: number;
        code: string;
    }

    interface ICreateRoleReq {
        name: string;
        description?: string;
        permissionIds: number[];
    }

    interface IAmenity {
        id: number;
        name: string;
        icon: string;
        createdAt?: string;
        updatedAt?: string;
        createdBy?: string;
        updatedBy?: string;
    }

    interface ICreateAmenityReq {
        name: string;
        icon: AmenityIconKey;
    }

    interface IPropertyType {
        id: number;
        name: string;
        createdAt: string;
        updatedAt: string;
        createdBy: string;
        updatedBy: string;
    }

    interface IFetchHostBookingReq {
        page?: number;
        size?: number;
        status?: "NEW" | "PENDING" | "CONFIRMED" | "CANCEL_REQUESTED" | "CANCELLED" | "DONE";
        sort?: string;
    }

    interface IHostContractTable {
        id: number;
        contractCode: string;
        status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'TERMINATED';
        commissionRate: number;

        startDate: string;
        endDate: string;
        signedAt?: string;
        terminatedAt?: string;
        terminationReason?: string;

        active: boolean;
        createdAt: string;
        updatedAt: string;

        hostId: number;
        hostName: string;

        properties?: {
            id: number;
            title: string;
            propertyTypeName: string;
            address: string;
        }[];
    }

    interface ICreateHostContractReq {
        expectedCommissionRate: number; // 0.15 = 15%
        startDate: string;              // yyyy-MM-dd
        endDate: string;                // yyyy-MM-dd
        propertyIds?: number[];
    }

    interface IPropertyCheck {
        id: number;
        title: string;
        hasActiveContract: boolean;
    }

    interface IPropertyTable {
        // basic
        id: number;
        title: string;
        description: string;
        address: string;
        city: string;

        pricePerNight: number;
        currency: string;
        maxGuests: number;

        // property type
        propertyTypeId: number;
        propertyTypeName: string;

        // media + booking 
        images: IPropertyImage[];
        imageDrafts?: IPropertyImage[];
        bookings: IBooking[];
        amenities: IAmenityDTO[];

        // host
        hostId: number;
        hostName: string;

        // contract
        contractId?: number;

        // status & meta
        status: string;
        latitude: number;
        longitude: number;
        createdAt: string;
    }

    interface IPropertyImage {
        id: number;
        imageUrl: string;
    }

    interface IResHostPayout {
        id: number;
        hostId: number;
        contractId: number;

        periodFrom: string;
        periodTo: string;

        grossAmount: number;
        commissionFee: number;
        netAmount: number;

        status: "PENDING" | "PAID" | "REJECTED";

        // audit
        createdAt: string;
        updatedAt: string;

        // paid
        paidAt?: string;
        transactionRef?: string;

        // rejected
        rejectedAt?: string;
        rejectReason?: string;

        items: IResHostPayoutItem[];
    }

    interface IResHostPayoutItem {
        id: number;
        bookingId: number;
        bookingAmount: number;
        commissionFee: number;
        netAmount: number;
    }

    interface IReqCreateHostPayout {
        contractId: number;
        periodFrom: string; // yyyy-MM-dd
        periodTo: string;   // yyyy-MM-dd
    }

    interface IResHostFee {
        id: number;
        bookingId: number;
        amount: number;
        rate: number;
        status: "PENDING" | "PAID" | "OVERDUE";
        dueAt: string;
        paidAt?: string;
    }

    interface IResPropertyWishlist {
        propertyId: number;
        propertyName: string;
        address: string;
        imageUrl: string;
        isWishlisted: boolean;
    }

    interface IResReviewDTO {
        id: number;
        rating: number;
        comment: string;
        createdAt: string;
        updatedAt: string;
        imageUrl?: string;
        commentUserName: string;
    }

    interface IResNotification {
        id: number;
        title: string;
        content: string;
        type: NotificationType;
        read: boolean;
        createdAt: string; 
    }

}