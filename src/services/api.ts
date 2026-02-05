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
    return axios.get<IBackendRes<IModelPaginate<IAmenity>>>('/api/v1/admin/amenities', { params });
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

