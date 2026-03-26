import { apiClient } from "./api-client";
import type {
    HospitalOnboardRequest,
    HospitalOnboardResponse,
    LoginRequest,
    LoginResponse,
    HospitalData,
    CaseInitiateRequest,
    CaseInitiateResponse,
    CaseDetails,
    BridgeApplicationRequest,
    BridgeApplicationResponse,
    RefreshTokenResponse,
    CaseSummary,
    DashboardData,
    ChatRequest,
    ChatResponse,
} from "../types/api";

export const hospitalAPI = {
    onboard: async (
        data: HospitalOnboardRequest
    ): Promise<HospitalOnboardResponse> => {
        const response = await apiClient.post("/hospitals/auth/onboard", data);
        return response.data;
    },

    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post("/hospitals/auth/login", data);
        return response.data;
    },

    refreshToken: async (
        refreshToken: string
    ): Promise<RefreshTokenResponse> => {
        const response = await apiClient.post("/hospitals/auth/refresh", {
            refreshToken,
        });
        return response.data;
    },

    getHospitalData: async (hospitalEmail: string): Promise<HospitalData> => {
        const response = await apiClient.get(
            `/hospitals/data/${hospitalEmail}`
        );
        return response.data;
    },

    getDashboardData: async (): Promise<DashboardData> => {
        const response = await apiClient.get("/hospitals/dashboard");
        return response.data;
    },
};

export const caseAPI = {
    initiate: async (
        data: CaseInitiateRequest
    ): Promise<CaseInitiateResponse> => {
        const response = await apiClient.post("/cases/initiate", data);
        return response.data;
    },

    getDetails: async (caseId: number): Promise<CaseDetails> => {
        const response = await apiClient.get(`/cases/${caseId}`);
        return response.data;
    },

    applyForBridge: async (
        caseId: number,
        data: BridgeApplicationRequest
    ): Promise<BridgeApplicationResponse> => {
        const response = await apiClient.post(`/cases/${caseId}/bridge`, data);
        return response.data;
    },

    getActive: async (): Promise<CaseSummary[]> => {
        const response = await apiClient.get("/cases/active");
        return response.data;
    },

    getHistory: async (
        pageNo: number = 0,
        pageSize: number = 10
    ): Promise<CaseSummary[]> => {
        const response = await apiClient.get(
            `/cases/history?pageNo=${pageNo}&pageSize=${pageSize}`
        );
        return response.data;
    },
};

export const aiAPI = {
    chat: async (data: ChatRequest): Promise<ChatResponse> => {
        const response = await apiClient.post("/ai/chat", data);
        return response.data;
    },
};
