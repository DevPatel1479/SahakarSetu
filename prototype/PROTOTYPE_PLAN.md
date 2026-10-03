# SahakarSetu: Prototype Implementation & Verification Plan

**Smart India Hackathon 2026 | Problem Statement ID: 26087**  
**Theme:** Smart Education | **Category:** Hardware (Software + Hardware)  

---

## 1. Prototype Subsystem Milestones

### Stage 1: Sahakar Edge Box Hardware Node
- **Compute:** Raspberry Pi 5 (8GB RAM) with active cooling and industrial enclosure.
- **Local Network:** Dual-band 2.4/5.0 GHz Wi-Fi hotspot (`SahakarSetu-EdgeBox`) with DHCP captive portal.
- **Web Server:** Embedded Nginx instance serving the compiled React 19 PWA.
- **Local Persistence:** High-speed NVMe M.2 SSD hosting local SQLite journal and offline course media cache.

### Stage 2: Offline Transaction Journal & Local Events
- **Attendance Capture:** Dynamic rotating QR attendance and local face recognition biometric matcher.
- **Assessment Engine:** Modular quiz evaluation with local score calculation.
- **Event Journaling:** Client and edge generation of unique event UUIDs, timestamps, and payload hashes.
- **Edge Dashboard:** Local monitoring console displaying pending vs synced queue counts.

### Stage 3: Bi-directional Cloud Synchronization
- **Central API:** Django 5 REST Framework endpoints (`/api/sync-events/`).
- **Data Warehouse:** Cloud PostgreSQL database with ACID transaction safety.
- **Reliability:** Idempotent event ingestion, exponential backoff retry worker, and conflict resolution.
- **Monitoring:** Real-time sync analytics tracking node status across institutes.

### Stage 4: Cryptographic Credentialing
- **Eligibility Screening:** Automated threshold check (attendance >= 80%, assessment score >= 75%).
- **Digital Skill Passport:** Tamper-evident credential signing via HMAC-SHA256.
- **Instant Public Lookup:** Public verification endpoint (`/verify/<id>`) rendering verified competencies.

### Stage 5: AI & Intelligence Pipelines
- **Career Counseling Assistant:** Grounded RAG assistant querying official cooperative manuals and bye-laws.
- **Multilingual Pipeline:** Bhashini voice and translation integration across regional Indic languages.
- **Cooperative Skill Graph:** XGBoost learning-to-rank matching certified trainees with cooperative vacancies.

---

## 2. End-to-End System Verification Flow

1. **Connected Initialization:** Central cloud ERP synchronizes batch enrollment and timetable data with institute Edge Box.
2. **Local Wireless Connection:** Trainee smartphone connects to local Edge Box Wi-Fi network.
3. **PWA Access:** Trainee launches Progressive Web App directly from the local node.
4. **Offline Media Delivery:** Trainee streams HD instructional video locally without consuming external bandwidth.
5. **Biometric / QR Check-in:** Attendance recorded via ArcFace face recognition or dynamic rotating QR scan.
6. **Formative Assessment:** Trainee completes modular quiz; score computed instantly on edge.
7. **Simulated Network Interruption:** External internet link severed to verify autonomous offline continuity.
8. **Offline Queueing:** Trainee activity saved to local SQLite event journal with `pending` status.
9. **Network Restoration:** Uplink restored; background sync daemon detects connection and initiates batch transfer.
10. **Cloud Reconciliation:** Central PostgreSQL ingests batch idempotently, updating national records.
11. **Skill Passport Issuance:** Verifiable Digital Skill Passport generated with unique QR code.
12. **Independent Verification:** Camera scans QR to verify cryptographic signature and competency breakdown.
13. **AI Employment Linkage:** Certified trainee matched with active PACS and cooperative society vacancies.
