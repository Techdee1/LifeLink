import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { hospitalAPI } from "../lib/api-service";
import type { LoginRequest, HospitalData } from "../types/api";

interface AuthContextType {
    isAuthenticated: boolean;
    hospitalEmail: string | null;
    hospitalData: HospitalData | null;
    hospitalId: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    setHospitalId: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hospitalEmail, setHospitalEmail] = useState<string | null>(null);
    const [hospitalData, setHospitalData] = useState<HospitalData | null>(null);
    const [hospitalId, setHospitalIdState] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("lifelink_access_token");
        const email = localStorage.getItem("lifelink_hospital_email");
        const hId = localStorage.getItem("lifelink_hospital_id");

        if (token && email) {
            setIsAuthenticated(true);
            setHospitalEmail(email);
            setHospitalIdState(hId);

            hospitalAPI
                .getHospitalData(email)
                .then((data) => {
                    setHospitalData(data);
                })
                .catch(() => {
                    logout();
                });
        }
    }, []);

    const login = async (credentials: LoginRequest) => {
        const response = await hospitalAPI.login(credentials);

        localStorage.setItem(
            "lifelink_access_token",
            response.access.access_token
        );
        localStorage.setItem(
            "lifelink_refresh_token",
            response.refresh.refresh_token
        );
        localStorage.setItem(
            "lifelink_hospital_email",
            credentials.hospitalEmail
        );

        if (response.hospitalId) {
            setHospitalId(response.hospitalId);
        }

        setIsAuthenticated(true);
        setHospitalEmail(credentials.hospitalEmail);

        try {
            const data = await hospitalAPI.getHospitalData(
                credentials.hospitalEmail
            );
            setHospitalData(data);
            // If we don't have it yet, check if it's in the data response
            if (!response.hospitalId) {
                const hId = data.hospitalId || data.id;
                if (hId) {
                    setHospitalId(hId);
                }
            }
        } catch (error) {
            console.error("Failed to fetch hospital data after login", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("lifelink_access_token");
        localStorage.removeItem("lifelink_refresh_token");
        localStorage.removeItem("lifelink_hospital_email");
        localStorage.removeItem("lifelink_hospital_id");
        setIsAuthenticated(false);
        setHospitalEmail(null);
        setHospitalData(null);
        setHospitalIdState(null);
    };

    const setHospitalId = (id: string) => {
        localStorage.setItem("lifelink_hospital_id", id);
        setHospitalIdState(id);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                hospitalEmail,
                hospitalData,
                hospitalId,
                login,
                logout,
                setHospitalId,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
