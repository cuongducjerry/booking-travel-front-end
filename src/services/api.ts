import createInstanceAxios from 'services/axios.customize';

const axios = createInstanceAxios(import.meta.env.VITE_BACKEND_URL);

export const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password })
}

export const registerAPI = (payload: IRegisterPayload) => {
    const urlBackend = "/api/v1/auth/register";
    return axios.post<IBackendRes<IRegister>>(urlBackend, payload);
};

export const logoutAPI = () => {
    const urlBackend = "/api/v1/auth/logout";
    return axios.post<IBackendRes<IRegister>>(urlBackend);
}

export const fetchAccountAPI = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend);
}

export const fetchHomeProperties = (params?: {
    address?: string;
    propertyType?: string;
    guests?: number;
    checkIn?: string;
    checkOut?: string;
    page?: number;
    size?: number;
}) => {
    return axios.get<IBackendRes<IModelPaginate<IProperty>>>(
        "/api/v1/properties/home",
        { params }
    );
};

export const getPropertyById = (id: string) => {
    const urlBackend = `/api/v1/properties/${id}`;
    return axios.get<IBackendRes<IPropertyDetail>>(urlBackend)
}

export const getUserById = (id: string) => {
    const urlBackend = `/api/v1/users/${id}`;
    return axios.get<IBackendRes<IUserDetail>>(urlBackend)
}

/* ===== Update profile ===== */
export const updateUserProfileAPI = (data: IReqUpdateProfileUser) => {
    const urlBackend = "/api/v1/users/profile";
    return axios.put<IBackendRes<IUserDetail>>(urlBackend, data);
};

/* ===== Update avatar ===== */
export const updateUserAvatarAPI = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios.put("/api/v1/users/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

/* ===== Update password ===== */
export const updateUserPasswordAPI = (data: IReqUpdatePassword) => {
    const urlBackend = "/api/v1/users/password";
    return axios.put<IBackendRes<IUserDetail>>(urlBackend, data);
};



// ===== BOOKING =====
export const createBooking = (data: {
    propertyId: number;
    checkIn: string;
    checkOut: string;
}) => {
    return axios.post<IBackendRes<IBookingDetail>>(
        "/api/v1/bookings",
        data
    );
};

// ===== PAYMENT =====
export const createVnpay = (bookingId: number) => {
    return axios.post<
        IBackendRes<{
            paymentId: number;
            urlPay: string;
        }>
    >(`/api/v1/payments/${bookingId}/vnpay`);
};

export const payAtProperty = (bookingId: number) => {
    return axios.post<IBackendRes<{
        paymentId: number;
        urlPay: string;
    }>>(
        `/api/v1/payments/${bookingId}/pay-at-property`
    );
};

/* ===== MOCK CALLBACK VNPAY ===== */
export const mockCallBackVnpay = (
    paymentId: number,
    success: boolean
) => {
    return axios.post<
        IBackendRes<{
            paymentId: number;
            message: string;
        }>
    >("/api/v1/payments/mock-callback", null, {
        params: {
            paymentId,
            success,
        },
    });
};

export const fetchMyBookings = (page = 1, pageSize = 10) => {
    return axios.get<
        IBackendRes<IModelPaginate<IBookingDetail>>
    >("/api/v1/bookings/my-booking", {
        params: {
            page: page - 1,
            size: pageSize,
        },
    });
};

export const getUsersAPI = (params: {
    page: number;
    size: number;
    keyword?: string;
    role?: string;
    status?: string;
    sort?: string;
}) => {
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(
        '/api/v1/admin/users',
        { params }
    );
};

export const createUserAPI = (data: ICreateUserReq) => {
    return axios.post<IBackendRes<IUserTable>>(
        '/api/v1/admin/users',
        data
    );
};

export const deleteUserAPI = (id: number) => {
    return axios.delete<IBackendRes<void>>(
        `/api/v1/admin/users/${id}`
    );
};

export const updateUserStatusAPI = (id: number, status: string) => {
    return axios.put<IBackendRes<any>>(
        `/api/v1/admin/users/${id}/status`,
        { status }
    );
};

export const assignUserRoleAPI = (id: number, roleId: number) => {
    return axios.put<IBackendRes<any>>(
        `/api/v1/admin/users/${id}/roles`,
        { roleId }
    );
};

export const getRolesAPI = (params?: {
    page?: number;
    size?: number;
    keyword?: string;
    sort?: string;
}) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(
        '/api/v1/admin/roles',
        { params }
    );
};


export const getPermissionsAPI = (params: {
    page?: number;
    size?: number;
    keyword?: string;
    sort?: string;
}) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>('/api/v1/admin/permissions', { params });
};

export const createRoleAPI = (data: ICreateRoleReq) => {
    return axios.post<IBackendRes<IUserTable>>(
        '/api/v1/admin/roles',
        data
    );
};

export const deleteRoleAPI = (id: number) => {
    return axios.delete<IBackendRes<void>>(
        `/api/v1/admin/roles/${id}`
    );
};

export const updateRoleAPI = (data: {
    id: number;
    name: string;
    description?: string;
    permissionIds: number[];
}) => {
    return axios.put<IBackendRes<any>>("/api/v1/admin/roles", data);
};


export const getAmenitiesAPI = (params: {
    page: number;
    size: number;
    keyword?: string;
    sort?: string;
}) => {
    return axios.get<IBackendRes<IModelPaginate<IAmenity>>>('/api/v1/amenities', { params });
};

export const deleteAmenityAPI = (id: number) => {
    return axios.delete<IBackendRes<void>>(
        `/api/v1/admin/amenities/${id}`
    );
};

export const createAmenityAPI = (data: ICreateAmenityReq) => {
    return axios.post<IBackendRes<IAmenity>>("/api/v1/admin/amenities", data);
};

export const updateAmenityAPI = (payload: {
    id: number;
    name: string;
    icon: string;
}) => {
    return axios.put<IBackendRes<IAmenity>>("/api/v1/admin/amenities", payload);
};

export const getPropertyTypesAPI = (params: {
    page?: number;
    size?: number;
    keyword?: string;
    sort?: string;
}) => {
    return axios.get<IBackendRes<IModelPaginate<IPropertyType>>>(
        '/api/v1/property-types',
        {
            params
        }
    );
};

export const deletePropertyTypeAPI = (id: number) => {
    return axios.delete<IBackendRes<void>>(
        `/api/v1/admin/property-types/${id}`
    );
};

export const createPropertyTypeAPI = (payload: { name: string }) => {
    return axios.post<IBackendRes<IPropertyType>>(
        "/api/v1/admin/property-types",
        payload
    );
};

export const updatePropertyTypeAPI = (payload: {
    id: number;
    name: string;
}) => {
    return axios.put<IBackendRes<IPropertyType>>(
        "/api/v1/admin/property-types",
        payload
    );
};

export const getHostBookingsAPI = async (params: IFetchHostBookingReq) => {
    return axios.get<IBackendRes<IModelPaginate<IBookingDetail>>>(
        "/api/v1/host/bookings",
        { params }
    );
};

// HOST booking actions
export const confirmBookingAPI = (id: number) => {
    return axios.put<IBackendRes<void>>(`/api/v1/host/bookings/${id}/confirm`);
};

export const cancelBookingAPI = (id: number) => {
    return axios.put<IBackendRes<void>>(`/api/v1/host/bookings/${id}/cancel`);
};

export const doneBookingAPI = (id: number) => {
    return axios.put<IBackendRes<void>>(`/api/v1/host/bookings/${id}/done`);
};

export const getAllBookingsAPI = (params: {
    page: number;
    size: number;
    status?: "NEW" | "PENDING" | "CONFIRMED" | "CANCEL_REQUESTED" | "CANCELLED" | "DONE";
    sort?: string;
}) => {
    return axios.get<IBackendRes<IModelPaginate<IBookingDetail>>>(
        "/api/v1/admin/bookings",
        { params }
    );
};

export const getMyContractsAPI = (params: any) => {
    return axios.get<IBackendRes<IModelPaginate<IHostContractTable>>>(
        '/api/v1/host/contracts/me',
        { params }
    );
};

export const getContractDetailAPI = (id: number) => {
    return axios.get<IBackendRes<IHostContractTable>>(`/api/v1/host/contracts/${id}`);
};

export const createHostContractAPI = (data: ICreateHostContractReq) => {
    return axios.post<IBackendRes<IHostContractTable>>('/api/v1/host/contracts', data);
};

export const getMyPropertiesInActiveAPI = () => {
    return axios.get<IBackendRes<IPropertyDetail[]>>("/api/v1/host/properties/inactive");
};

export const getAllContractsAPI = (params: any) =>
    axios.get<IBackendRes<IModelPaginate<IHostContractTable>>>('/api/v1/admin/contracts', { params });

// APPROVE
export const approveContractAPI = (id: number) => {
    return axios.put<IBackendRes<void>>(`/api/v1/admin/contracts/${id}/approve`);
};

// REJECT
export const rejectContractAPI = (id: number, reason: string) => {
    return axios.put<IBackendRes<void>>(`/api/v1/admin/contracts/${id}/reject`, null, {
        params: { reason },
    });
};

export const getMyPropertiesAPI = (params: {
    page: number;
    size: number;
    title?: string;
    status?: string;
    propertyType?: string;
    sort?: string;
}) => {
    return axios.get<IBackendRes<IModelPaginate<IPropertyTable>>>(
        "/api/v1/properties",
        { params }
    );
};

export const decidePropertyAPI = (
    id: number,
    data: {
        decision: "APPROVED" | "REJECTED" | "DRAFT";
        reason?: string;
    }
) => {
    return axios.put<IBackendRes<void>>(`/api/v1/admin/properties/${id}/decision`, data);
};

export const approveDeletePropertyAPI = (id: number) => {
    return axios.put<IBackendRes<void>>(`/api/v1/admin/properties/${id}/approve-delete`);
};

/* =========================
   HOST CREATE PROPERTY (STEP 1)
   ========================= */
export const createPropertyAPI = (data: {
    title: string;
    description: string;
    address: string;
    city: string;
    pricePerNight: number;
    maxGuests: number;
    currency: string;
    propertyTypeId: number;
    contractId: number;
}) => {
    return axios.post<IBackendRes<IPropertyTable>>("/api/v1/host/properties", data);
};

/* =========================
   HOST UPLOAD IMAGES (STEP 2)
   ========================= */
export const uploadPropertyImagesAPI = (
    propertyId: number,
    files: File[]
) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    return axios.post<IBackendRes<void>>(
        `/api/v1/host/properties/${propertyId}/images`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
};

/* =========================
   HOST DELETE IMAGE (STEP 2)
   ========================= */
export const deletePropertyImageAPI = (
    propertyId: number,
    imageId: number
) => {
    return axios.delete<IBackendRes<void>>(
        `/api/v1/host/properties/${propertyId}/images/${imageId}`
    );
};

export const deletePropertyImageDraftAPI = (
    propertyId: number,
    imageId: number
) => {
    return axios.delete<IBackendRes<void>>(
        `/api/v1/host/properties/${propertyId}/image-drafts/${imageId}`
    );
};


/* =========================
   HOST UPDATE AMENITIES (STEP 3)
   ========================= */
export const updatePropertyAmenitiesAPI = (
    propertyId: number,
    amenityIds: number[]
) => {
    return axios.put<IBackendRes<void>>(
        `/api/v1/host/properties/${propertyId}/amenities`,
        { amenityIds }
    );
};

/* =========================
   HOST SUBMIT PROPERTY (STEP 4)
   ========================= */
export const submitPropertyAPI = (propertyId: number) => {
    return axios.put<IBackendRes<IPropertyTable>>(
        `/api/v1/host/properties/${propertyId}/submit`
    );
};


export const updatePropertyAPI = (id: number, data: any) =>
    axios.put<IBackendRes<IPropertyDetail>>(`/api/v1/host/properties/${id}`, data);


export const getHostPropertyById = (id: string) => {
    const urlBackend = `/api/v1/host/view/properties/${id}`;
    return axios.get<IBackendRes<IPropertyTable>>(urlBackend)
}

export const getDraftImageByPropertyId = (id: string) => {
    const urlBackend = `/api/v1/host/image-drafts/${id}`;
    return axios.get<IBackendRes<IPropertyImage[]>>(urlBackend)
}

// =======================
// HOST REQUEST DELETE
// =======================
export const hostDeletePropertyAPI = (propertyId: number) => {
    return axios.delete<IBackendRes<void>>(
        `/api/v1/host/properties/${propertyId}`
    );
};

export const getAllPayoutsAPI = (params: {
    page: number;
    size: number;
    sort?: string;
    status?: string;
}) => {
    return axios.get<IBackendRes<IModelPaginate<IResHostPayout>>>(
        "/api/v1/admin/host-payouts",
        { params }
    );
};

export const markPaidPayoutAPI = (
    payoutId: number,
    transactionRef: string
) => {
    return axios.put<IBackendRes<IResHostPayout>>(
        `/api/v1/admin/host-payouts/${payoutId}/mark-paid`,
        null,
        {
            params: { transactionRef },
        }
    );
};

export const markRejectedPayoutAPI = (
    payoutId: number,
    reason: string
) => {
    return axios.put<IBackendRes<IResHostPayout>>(
        `/api/v1/admin/host-payouts/${payoutId}/mark-rejected`,
        null,
        {
            params: { reason },
        }
    );
};

export const createHostPayoutAPI = (data: IReqCreateHostPayout) => {
    return axios.post<IBackendRes<IResHostPayout>>(
        "/api/v1/admin/host-payouts",
        data
    );
};

export const getMyPayoutsAPI = (params: any) =>
    axios.get<IBackendRes<IModelPaginate<IResHostPayout>>>(
        "/api/v1/host/host-payouts/me",
        { params }
    );


export const getAllFeesAPI = (params: {
    page: number;
    size: number;
    sort?: string;
    status?: string;
}) => {
    return axios.get<IBackendRes<IModelPaginate<IResHostFee>>>("/api/v1/fees", {
        params,
    });
};

export const updateFeeStatusAPI = (
    feeId: number,
    status: "PAID" | "OVERDUE"
) => {
    return axios.put<IBackendRes<IResHostFee>>(
        `/api/v1/admin/fees/${feeId}/status`,
        { status }
    );
};


export const getMyWishlistAPI = (params: {
    page: number;
    size: number;
}) => {
    return axios.get<IBackendRes<IModelPaginate<IResPropertyWishlist>>>(
        "/api/v1/wishlists/my-wishlist",
        { params }
    );
};

export const toggleWishlistAPI = (propertyId: number) => {
    return axios.post<IBackendRes<void>>(
        `/api/v1/wishlists/toggle/${propertyId}`
    );
};

export const checkWishlistAPI = (propertyId: number) => {
    return axios.get<IBackendRes<boolean>>(`/api/v1/wishlists/check/${propertyId}`);
};


export const createReviewAPI = (
    propertyId: number,
    data: {
        rating: number;
        comment: string;
    }
) => {
    return axios.post<IBackendRes<IResReviewDTO>>(
        `/api/v1/reviews/${propertyId}`,
        data
    );
};

export const updateReviewAPI = (data: {
    id: number;
    rating: number;
    comment: string;
}) =>
    axios.put(`/api/v1/reviews/update`, data);

export const deleteReviewAPI = (id: number) =>
    axios.delete<IBackendRes<void>>(`/api/v1/reviews/${id}`);


export const getReviewsByPropertyAPI = (
    propertyId: number,
    page = 1,
    size = 5
) => {
    return axios.get<IBackendRes<IModelPaginate<IResReviewDTO>>>(
        `/api/v1/reviews/property/${propertyId}`,
        {
            params: {
                page: page - 1, 
                size,
            },
        }
    );
};


