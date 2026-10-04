# SahakarSetu: AI & LMS-Enabled Cooperative Capacity Building, ERP & Employment Ecosystem

**Smart India Hackathon 2026 | Problem Statement ID: 26087**  
**Organization:** Ministry of Cooperation | **Department:** National Council for Cooperative Training (NCCT)  
**Theme:** Smart Education | **Category:** Hardware (Software + Hardware)  

---

## Technical Documentation & Architecture

- **[Comprehensive Technical Architecture Report (Markdown)](docs/TECHNICAL_ARCHITECTURE.md)**
- **[Technical Architecture Report (Word DOCX)](report/SahakarSetu_Technical_Architecture_Report.docx)**
- **[Technical Architecture Report (Compiled PDF)](report/SahakarSetu_Technical_Architecture_Report.pdf)**
- **[Prototype Implementation Plan](prototype/PROTOTYPE_PLAN.md)**
- **[System Architecture Diagram (Mermaid)](architecture/system-architecture.mmd)**
- **[Prototype Working Video](https://youtu.be/SGfuTJ5SxBE)**
- **[Live Deployed Prototype](https://sahakar-setu-sage.vercel.app/)**
- **[Backend API Endpoint](https://sahakarsetu-mcdr.onrender.com/health/)**

---

## Core System Architecture & Innovation

**SahakarSetu** unites central Cloud ERP, Moodle LMS Core, and local **Sahakar Edge Box** hardware nodes into an integrated training-to-employment ecosystem for NCCT's 20 constituent institutions (VAMNICOM, RICMs, ICMs), PACS, and rural youth:

1. **Sahakar Edge Box (Hardware Core):** Ruggedized Raspberry Pi 5 edge compute node providing localized LMS media caching, biometric face/QR attendance validation, and offline SQLite event journaling with store-and-forward cloud sync.
2. **Unified Sahakar ID:** Standardized national digital identity (`SAH-YYYY-INST-XXXXXX`) tracking trainee lifecycle from nomination through placement.
3. **Dual-Mode Attendance:** Computer vision face recognition (ArcFace + MiniFASNet liveness check) with cryptographic rotating QR code fallback.
4. **Bhashini Voice-First Multilingual AI:** Multilingual text and voice interaction in scheduled Indian languages (Hindi, Marathi, Gujarati, Tamil, etc.).
5. **Verifiable Digital Skill Passport:** Cryptographically signed (HMAC-SHA256 / Ed25519) credential with instant public QR verification.
6. **Cooperative Skill Graph & XGBoost Ranker:** Learning-to-rank matching certified competencies against cooperative society job vacancies.
