import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://lifelink-backend-bkg9w.ondigitalocean.app/api/v1/lifelink";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        accept: "*/*",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("lifelink_access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            (error.response?.status === 401 ||
                error.response?.status === 403) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("lifelink_refresh_token");
            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${API_BASE_URL}/hospitals/auth/refresh`,
                        {
                            refreshToken,
                        }
                    );

                    const { access_token, refresh_token } = response.data;
                    localStorage.setItem("lifelink_access_token", access_token);
                    if (refresh_token) {
                        localStorage.setItem(
                            "lifelink_refresh_token",
                            refresh_token
                        );
                    }

                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    // Use the original axios config to retry the request
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem("lifelink_access_token");
                    localStorage.removeItem("lifelink_refresh_token");
                    localStorage.removeItem("lifelink_hospital_email");
                    window.location.href = "/login";
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);
