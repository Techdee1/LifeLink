from sqlalchemy import Column, String, BigInteger, Numeric, Float, Integer, DateTime, ForeignKey
from app.database import Base


class HospitalAccount(Base):
    __tablename__ = "hospital_account"

    account_id = Column("account_id", String(36), primary_key=True)
    account_number = Column("account_number", String(255), unique=True, nullable=False)
    bank_code = Column("bank_code", String(255), unique=True, nullable=False)
    account_name = Column("account_name", String(255), unique=True, nullable=False)


class Hospital(Base):
    __tablename__ = "hospital"

    id = Column(String(36), primary_key=True)
    hospital_name = Column("hospital_name", String(255), unique=True)
    hefama = Column("hefama_id", String(255), unique=True)
    address = Column(String(255))
    admin_name = Column("admin_name", String(255), unique=True, nullable=False)
    hospital_email = Column("hospital_email", String(255), unique=True, nullable=False)
    admin_phone = Column("admin_phone", String(255), nullable=False)
    settlement_account_id = Column(
        "settlement_account_account_id", String(36),
        ForeignKey("hospital_account.account_id")
    )


class Case(Base):
    __tablename__ = "cases"

    case_id = Column("case_id", BigInteger, primary_key=True, autoincrement=True)
    hospital_account = Column("hospital_account", String(36), ForeignKey("hospital.id"))
    patient_name = Column("patient_name", String(255), unique=True)
    lead_kin_name = Column("lead_kin_name", String(255))
    lead_kin_phone = Column("lead_kin_phone", String(255))
    patient_email = Column("patient_email", String(255), unique=True)
    deposit_target = Column("deposit_target", Numeric(19, 2))
    patient_case = Column("patient_case", Integer)  # enum ordinal: 0=OPEN, 1=CLOSED
    created_at = Column("created_at", DateTime, nullable=True)


class VirtualAccount(Base):
    __tablename__ = "virtual_account"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    bank_code = Column("bank_code", String(255))
    virtual_account_number = Column("virtual_account_number", String(255))
    bank_name = Column("bank_name", String(255))
    account_name = Column("account_name", String(255))
    case_id = Column("case_id", BigInteger)
    patient_name = Column("patient_name", String(255))
    patient_email = Column("patient_email", String(255))
    status = Column(Integer)  # enum ordinal: 0=OPEN, 1=CLOSED
    raised_amount = Column("raised_amount", Numeric(19, 2))
    target_amount = Column("target_amount", Numeric(19, 2))
    percentage = Column(Float)


class Loan(Base):
    __tablename__ = "loan"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    case_id = Column("case_id", BigInteger)
    bridged_amount = Column("bridged_amount", Numeric(19, 2))
    interest_amount = Column("interest_amount", Numeric(19, 2))
    total_repayment_amount = Column("total_repayment_amount", Numeric(19, 2))
    loan_status = Column("loan_status", String(255))
    deadline = Column(DateTime)


class Payment(Base):
    __tablename__ = "payment"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    event = Column(String(255))
    uuid = Column(String(255))
    timestamp = Column(BigInteger)
    account_name = Column("account_name", String(255))
