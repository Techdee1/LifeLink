# LifeLink Frontend Product Requirements Document (PRD)

## 1. Product Overview

**LifeLink** is an emergency healthcare financing application designed to facilitate instant medical funding through a "virtual account" donation system and algorithmic "Bridge Loans." The web interface specifically caters to Hospital Administrators managing emergency cases and tracking funding progress, alongside a publicly viewable portal for donors to view case status and obtain payment details.

## 2. Objectives & Goals

-   **Empower Hospitals:** Provide an intuitive dashboard for hospital administrators to register, manage emergencies, and track medical deposits.
-   **Save Lives:** Accelerate the time between patient intake and treatment through rapid crowdsourced funding and bridge loan availability.
-   **Bridge Funding:** Facilitate immediate bridge loans (up to 40% of the target) once an active case attains 60% organic funding.
-   **Transparency:** Provide real-time, shareable public trackers of funding status with automatically provisioned virtual bank accounts for each emergency.

## 3. Target Audience

-   **Hospital Administrators & Staff:** Primary users creating cases, managing active patients, and applying for bridge funding on behalf of patients.
-   **Patients / Next of Kin (Indirect):** Beneficiaries of the cases, whose details and identity (BVN/NIN) are used to unlock bridge loans.
-   **Donors (Public):** General public utilizing the public case link to check funding progress and copy virtual account donation information.

## 4. System Architecture & Tech Stack

-   **Framework:** React 18 with Vite
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS, Framer Motion (for animations)
-   **State & Data Fetching:** React Context API (Auth), React Query / Tanstack Query (Data Fetching), Axios (HTTP Client with interceptors)
-   **Icons:** Lucide React
-   **Routing:** React Router v7

## 5. Core Features & Requirements

### 5.1 Hospital Onboarding & Authentication

-   **Onboarding (`/onboard`):**
    -   Form capturing: Hospital Name, HEFAMA Code, Address, Admin Contact, Settlement Account (Bank Code, Account Number).
    -   Validation: Ensure all fields are filled, secure password criteria met.
-   **Login (`/login`):**
    -   Email/Password authentication.
    -   Generates JWT Access and Refresh Tokens stored in `localStorage`.
-   **Session Management:**
    -   Axios interceptor automatically listens for 401/403 and attempts token refresh.
    -   Route protection mechanism via `ProtectedRoute` component.

### 5.2 Hospital Dashboard (`/dashboard`)

-   **Key Metrics:** Real-time stats reflecting Active Cases, Total Bridge Funded Amount, Lives Saved, and Average Response time.
-   **Recent Activity:** A feed (or conceptual placeholder) for ongoing transactions and system activities.
-   **Bridge Eligibility Health:** Indicates system latency, connectivity, and diagnostic tools for Interswitch bridge linkage.

### 5.3 Active Cases Management (`/dashboard/cases`)

-   **Case Listing:** Displays tabular view of currently active cases (`OPEN`, `PARTIALLY_FUNDED`, `BRIDGE_ELIGIBLE`, `FULLY_FUNDED`).
-   **Dynamic Funding Progress:** A visual progress bar detailing percentage completed.
-   **Financial Status:** Target amount vs. currently raised amount.
-   **Virtual Account Display:** A distinct tag showing the allocated virtual bank account, with a one-click "copy to clipboard" feature.

### 5.4 Emergency Case Initiation

-   **Multi-Step Modal:**
    -   **Step 1:** Patient details (Name, Email, Deposit Target).
    -   **Step 2:** Next of Kin details (Name, Phone).
    -   **Step 3:** Success confirmation returning the uniquely generated Case ID, Bank Name, and Virtual Account Number.
-   **Sharing:** Affords administrators an instantly copyable public case URL.

### 5.5 Case History (`/dashboard/history`)

-   **Archive Viewing:** Paginated/Searchable tracker for historical or `CLOSED`/`ARCHIVED` cases.
-   Includes final amount raised and historical status tracking.

### 5.6 Bridge Loan Application

-   **Trigger:** Available only when a case is $\ge 60\%$ and `< 100\%$` funded.
-   **Verification Input:** Collects First Name, Last Name, BVN (11 digits), and NIN (11 digits) from the Next of Kin.
-   **Terms & Conditions:** Mandatory guarantee agreement confirming responsibility to repay up to 40% of the loan.
-   **Processing:** Sends data through the backend to interact with Interswitch/Banking providers.
-   **Result:** Provides a success overlay detailing the instantly disbursed bridge amount.

### 5.7 Public Case Portal (`/case/:caseId`)

-   **Public Accessibility:** Link capable of being widely circulated to friends, family, and social media.
-   **Case Summary:** Patient alias/name, treating hospital branch, and emergency status.
-   **Visual Progress Tracker:** Real-time updating progress bar.
-   **Demo Mode (Development):** Toggle switch to simulate percentage increases for presentation scopes.
-   **Donation Details:** Enhanced virtual account card giving clear, step-by-step instructions on making a bank transfer.
-   **Action Trigger:** For authorized scopes (or if logged in), access to trigger the bridge loan app if the 60% gap is bridged.

## 6. Non-Functional Requirements

-   **Security:** Ensure BVN/NIN fields are never permanently cached on the frontend. Refresh tokens should be securely handled.
-   **Responsive Design:** Interfaces must support mobile (for donors viewing cases on phones) and desktop setups (for hospital administration viewing).
-   **Error Handling:** Graceful, user-friendly error banners globally for API failures, token expirations, and invalid forms.
-   **Performance:** Instantaneous perception UI/UX; Tanstack query provides cached, optimistic state updates.

## 7. Future Scope

-   Integration with live payment gateways (e.g., Paystack/Flutterwave) for direct card/USSD payments on the public portal.
-   Expand global notification system using WebSockets for real-time deposit dings.
-   Export functionality for case history (CSV/PDF reporting) to assist hospital accounting teams.
