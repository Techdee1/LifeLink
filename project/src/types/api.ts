export interface HospitalOnboardRequest {
    hospitalName: string;
    hefama: string;
    address: string;
    adminName: string;
    hospitalEmail: string;
    adminPhone: string;
    settlementAccount: {
        accountNumber: string;
        bankCode: string;
        accountName: string;
    };
    accountPassword: string;
}

export interface HospitalOnboardResponse {
    verified_name: string;
    status: string;
    hospital_id: string;
    message: string;
}

export interface LoginRequest {
    hospitalEmail: string;
    accountPassword: string;
}

export interface LoginResponse {
    access: {
        access_token: string;
        issued: number;
        expiration: number;
    };
    refresh: {
        refresh_token: string;
        issued: number;
        expiration: number;
    };
    hospitalId?: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    expiration: string;
    access_token: string;
    issued: string;
}

export interface DashboardData {
    activeCases: number;
    bridgedFunded: number;
    livesSaved: number;
}

export interface HospitalData {
    hospitalName: string;
    adminName: string;
    adminPhone: string;
    hospitalId?: string;
    id?: string;
}

export interface CaseInitiateRequest {
    hId: string;
    patientName: string;
    leadKinName: string;
    patientEmail: string;
    leadKinPhone: string;
    depositTarget: number;
    patientCase: "OPEN";
}

export interface CaseInitiateResponse {
    bankName: string;
    caseId: number;
    accountName: string;
    bankCode: string;
    virtualAccountNumber: string;
    status: string;
}

export interface CaseDetails {
    hospital: string;
    percentage: number;
    target_amount: number;
    patient: string;
    is_bridge_eligible: boolean;
    raised_amount: number;
    virtual_account: string;
}

export interface BridgeApplicationRequest {
    firstName: string;
    lastName: string;
    leadKinBvn: string;
    leadKinNin: string;
    accountNumber: string;
    bankName: string;
    bankCode: string;
    agreedToTerms: boolean;
}

export interface BridgeApplicationResponse {
    message: string;
    bridged_amount: number;
    responseCode: string;
}

export type CaseStatus =
    | "OPEN"
    | "PARTIALLY_FUNDED"
    | "BRIDGE_ELIGIBLE"
    | "FULLY_FUNDED"
    | "CLOSED"
    | "ARCHIVED";

export interface CaseSummary {
    caseId: number;
    patientName: string;
    patientEmail?: string;
    status: CaseStatus;
    raisedAmount: number;
    targetAmount: number;
    percentage: number;
    virtualAccountNumber?: string;
    bankName?: string;
    createdAt: string;
}

export interface ChatRequest {
    message: string;
    conversation_id?: string;
    language?: string;
    hospital_id?: string;
}

export interface ChatResponse {
    reply: string;
    conversation_id: string;
    detected_language?: string;
}
