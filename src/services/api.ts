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

