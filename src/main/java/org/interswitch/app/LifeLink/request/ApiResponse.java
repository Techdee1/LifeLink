package org.interswitch.app.LifeLink.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class ApiResponse {

    private boolean success;
    private String code;
    private String message;
    private Data data;

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Data getData() { return data; }
    public void setData(Data data) { this.data = data; }

    // Nested Data class
    public static class Data {
        private String id;
        private String status;
        private boolean dataValidation;
        private boolean selfieValidation;
        private boolean isConsent;
        private String idNumber;
        private String businessId;
        private BankDetails bankDetails;
        private String type;
        private boolean allValidationPassed;
        private String requestedAt;
        private String requestedById;
        private String country;
        private String createdAt;
        private String lastModifiedAt;
        private Map<String, Object> metadata;
        private RequestedBy requestedBy;

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        @JsonProperty("dataValidation")
        public boolean isDataValidation() { return dataValidation; }
        public void setDataValidation(boolean dataValidation) { this.dataValidation = dataValidation; }

        @JsonProperty("selfieValidation")
        public boolean isSelfieValidation() { return selfieValidation; }
        public void setSelfieValidation(boolean selfieValidation) { this.selfieValidation = selfieValidation; }

        @JsonProperty("isConsent")
        public boolean isConsent() { return isConsent; }
        public void setConsent(boolean consent) { isConsent = consent; }

        public String getIdNumber() { return idNumber; }
        public void setIdNumber(String idNumber) { this.idNumber = idNumber; }

        public String getBusinessId() { return businessId; }
        public void setBusinessId(String businessId) { this.businessId = businessId; }

        public BankDetails getBankDetails() { return bankDetails; }
        public void setBankDetails(BankDetails bankDetails) { this.bankDetails = bankDetails; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public boolean isAllValidationPassed() { return allValidationPassed; }
        public void setAllValidationPassed(boolean allValidationPassed) { this.allValidationPassed = allValidationPassed; }

        public String getRequestedAt() { return requestedAt; }
        public void setRequestedAt(String requestedAt) { this.requestedAt = requestedAt; }

        public String getRequestedById() { return requestedById; }
        public void setRequestedById(String requestedById) { this.requestedById = requestedById; }

        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }

        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

        public String getLastModifiedAt() { return lastModifiedAt; }
        public void setLastModifiedAt(String lastModifiedAt) { this.lastModifiedAt = lastModifiedAt; }

        public Map<String, Object> getMetadata() { return metadata; }
        public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }

        public RequestedBy getRequestedBy() { return requestedBy; }
        public void setRequestedBy(RequestedBy requestedBy) { this.requestedBy = requestedBy; }

        // Nested BankDetails class
        public static class BankDetails {
            private String accountName;
            private String accountNumber;
            private String bankName;

            public String getAccountName() { return accountName; }
            public void setAccountName(String accountName) { this.accountName = accountName; }

            public String getAccountNumber() { return accountNumber; }
            public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

            public String getBankName() { return bankName; }
            public void setBankName(String bankName) { this.bankName = bankName; }
        }

        // Nested RequestedBy class
        public static class RequestedBy {
            private String firstName;
            private String lastName;
            private String middleName;
            private String id;

            public String getFirstName() { return firstName; }
            public void setFirstName(String firstName) { this.firstName = firstName; }

            public String getLastName() { return lastName; }
            public void setLastName(String lastName) { this.lastName = lastName; }

            public String getMiddleName() { return middleName; }
            public void setMiddleName(String middleName) { this.middleName = middleName; }

            public String getId() { return id; }
            public void setId(String id) { this.id = id; }
        }
    }
}