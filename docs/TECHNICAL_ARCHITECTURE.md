# SahakarSetu: AI & LMS-Enabled Cooperative Capacity Building, ERP & Employment Ecosystem

**Comprehensive Technical Architecture & Solution Engineering Report**  
**Smart India Hackathon 2026**  
**Problem Statement ID:** 26087  
**Problem Statement Title:** AI & LMS - Enabled Cooperative Capacity Building, ERP & Employment Ecosystem  
**Organization:** Ministry of Cooperation  
**Department:** National Council for Cooperative Training (NCCT)  
**Theme:** Smart Education | **Category:** Hardware (Software + Hardware)  

---

## Project Deployment & Prototype Links

- **Prototype Working Video:** https://youtu.be/SGfuTJ5SxBE
- **Live Deployed Prototype:** https://sahakar-setu-sage.vercel.app/
- **Backend API Endpoint:** https://sahakarsetu-mcdr.onrender.com/health/

## 1. Executive Summary & System Vision

**SahakarSetu** is an enterprise-grade digital public infrastructure designed to modernize and unify the cooperative education, administration, and employment ecosystem across India. Commissioned under the mandate of the Ministry of Cooperation and the National Council for Cooperative Training (NCCT), the platform integrates institutional enterprise resource planning (ERP), learning management systems (LMS), computer-vision attendance, offline-first edge computing, verifiable cryptographic skill credentialing, and AI-driven employment linkage into a continuous, data-driven lifecycle.

NCCT operates through its apex institution—Vaikunth Mehta National Institute of Cooperative Management (VAMNICOM), Pune—alongside 5 Regional Institutes of Cooperative Management (RICMs) and 14 Institutes of Cooperative Management (ICMs). In total, these 20 institutions conduct more than 3,700 programmes annually, training over 2.27 lakh participants comprising Primary Agricultural Credit Societies (PACS) secretaries, dairy cooperative staff, women Self-Help Groups (SHGs), cooperative bank officers, and rural youth.

Historically, this vast educational apparatus has operated through manual or siloed systems, leading to paper attendance registers, duplicate trainee records, zero centralized learning analytics, lack of verified skill portability, and minimal direct linkage to formal employment or entrepreneurship.

```
       +-----------------------------------------------------------------------+
       |                           SAHAKARSETU ECOSYSTEM                       |
       |                                                                       |
       |   [ Register ] ---> [ Allocate ] ---> [ Verify ] ---> [ Learn ]       |
       |    Nomination        Seat, Hostel,     Face / QR       Multilingual   |
       |    & Sahakar ID       Timetable       Biometric        Edge & Cloud   |
       |         |                                                   |         |
       |         v                                                   v         |
       |   [ Feedback ] <--- [ Match ]   <--- [ Certify ] <--- [ Assess ]      |
       |    Continuous        AI Placement     Verifiable       Automated      |
       |    Outcome Loop      & Job Graph      Skill Passport   Evaluation     |
       +-----------------------------------------------------------------------+
```

SahakarSetu bridges the critical rural infrastructure gap through a hybrid **Software + Hardware** architecture. The core innovation is the **Sahakar Edge Box**—a low-cost, ruggedized, low-power edge computer deployed at each training institute, PACS center, and rural cooperative hub. The Edge Box runs an embedded micro-cloud with localized LMS media caching, biometric face/QR attendance validation, automated quiz grading, and a store-and-forward SQLite journal. Trainees in remote, low-bandwidth areas connect locally via Wi-Fi without active internet. When connectivity is restored, the Edge Box cryptographically synchronizes with the central Sahakar Cloud, enabling zero-downtime operations and national-level training monitoring.

---

## 2. Problem Statement & Domain Context

### 2.1 Background
The Ministry of Cooperation has spearheaded nationwide digitalization, including computerization of 63,000+ functional PACS, establishment of Model Bye-laws, creation of the National Cooperative Database (cataloging over 8.44 lakh cooperatives and 30+ crore members), and introduction of the National Cooperation Policy 2025. 

NCCT serves as the intellectual backbone for this cooperative revolution. However, field operations face significant operational bottlenecks:
1. **Administrative Fragmentation:** Trainee registration, institution approvals, hostel room allocations, timetable generation, and logistics tracking are maintained in disconnected spreadsheets or physical logbooks.
2. **Connectivity Deficits:** Rural PACS and remote ICM centers suffer from intermittent or non-existent broadband, rendering purely cloud-dependent software unusable in remote rural classrooms.
3. **Attendance Integrity:** Paper attendance and single-point biometrics are vulnerable to proxy check-ins, lack audit trails, and fail during network outages.
4. **Credential Fraud & Lack of Portability:** Paper certificates are difficult for prospective cooperative banks and agri-employers to authenticate, lacking verifiable skill breakdown.
5. **Employment Disconnect:** While cooperative societies urgently require certified talent in PACS accounting, Tally ERP, inventory management, and cold chain logistics, trained rural youth have no direct visibility into vacancies.

### 2.2 Problem Statement & Scope
To design, develop, and implement an integrated, scalable, web-based digital ecosystem for cooperative training institutions that combines:
- Centralized ERP for institutional administration (nominations, timetables, hostels, logistics).
- Offline-first Learning Management System (LMS) with interactive multilingual content.
- Hardware-enabled Edge computing for offline training continuity.
- AI-based computer vision (face recognition with liveness) and cryptographic dynamic QR attendance.
- Cryptographically verifiable Digital Skill Passports.
- AI-driven skill-to-job matching engine and RAG-based career guidance.
- Centralized analytics dashboard for national training impact and policy planning.

---

## 3. Requirement-to-Solution Mapping

The table below demonstrates direct, full-scope alignment with the technical requirements of Problem Statement 26087:

| # | Requirement (PS 26087) | SahakarSetu Engineering Solution | Technical Implementation |
|---|---|---|---|
| 1 | **Online Registration & Nomination** | Web-based nomination portal supporting self-registration, society sponsorship, and institute bulk approvals. | React 19 PWA, Django REST APIs, automated eligibility screening. |
| 2 | **Participant, Institution & Trainee Profiles** | Centralized national registry issuing a unique, immutable lifetime digital **Sahakar ID**. | PostgreSQL central ledger, cryptographic format `SAH-YYYY-INST-XXXXXX`. |
| 3 | **Interactive Multilingual E-Learning** | SCORM-compliant LMS with video lectures, interactive modules, and regional voice narration. | Moodle LMS Core integration + Government **BHASHINI** AI speech/translation API. |
| 4 | **Digital Attendance (Face / QR)** | Dual-mode attendance engine: on-device ArcFace recognition with liveness check, plus rotating cryptographic QR fallback. | InsightFace / MiniFASNet embeddings + time-based HMAC dynamic QR codes. |
| 5 | **Timetable, Hostel & Logistics Management** | Campus ERP module managing classroom scheduling, faculty allocation, hostel room beds, and training kit dispatches. | Relational allocation engine with conflict resolution and GPS-tagged logistics. |
| 6 | **LMS Integration, Assessment & Certification** | Automated module quizzes, proctored summative exams, rubric-based grading, and instant certificate issuing. | LMS evaluation pipeline enforcing customizable cutoff score benchmarks. |
| 7 | **Skill Certification Repository & Verification** | Digital Skill Passport with tamper-evident cryptographic signature and instant public QR code lookup. | HMAC-SHA256 / Ed25519 signed credentials, public verification endpoint. |
| 8 | **Career Counseling Chatbot** | AI knowledge assistant providing guidance on cooperative schemes, bye-laws, and career paths. | Retrieval-Augmented Generation (RAG) using LangChain / pgvector over NCCT docs. |
| 9 | **Employer & Recruiter Dashboard** | Dedicated recruiter portal for posting vacancies, filtering certified candidates, and reviewing Skill Passports. | Cooperative recruitment hub with automated candidate pipeline management. |
| 10 | **Mobile-Friendly & Offline-Accessible Platform** | Mobile-responsive PWA backed by the **Sahakar Edge Box** for zero-connectivity classrooms. | React PWA + Raspberry Pi 5 local Wi-Fi micro-cloud with store-and-forward sync. |
| 11 | **Centralized Database & Monitoring Analytics** | Real-time national intelligence center tracking mobilization, certification, sync rates, and placements. | Recharts analytics engine fed by central PostgreSQL event warehouse. |

---

## 4. End-to-End System Architecture

### 4.1 Architectural Blueprint
SahakarSetu is built on a resilient, multi-tiered micro-cloud architecture designed for high throughput, offline durability, and zero single-point-of-failure operation:

```
+-----------------------------------------------------------------------------------+
|                           CENTRAL CLOUD PLATFORM                                  |
|                                                                                   |
|  [ Load Balancer & TLS 1.3 Termination ]                                          |
|         |                                                                         |
|         +---> [ Django REST ERP Core ] <---> [ PostgreSQL Database Ledger ]       |
|         |     - Nominations & Profiles        - Relational Schema                 |
|         |     - Timetable & Hostel ERP        - pgvector Embeddings               |
|         |     - Recruiter & Jobs Portal       - Audit Logs (DPDP Act)             |
|         |                                                                         |
|         +---> [ LMS & Assessment Engine ] <---> [ S3 / Object Store Media ]       |
|         |     - Moodle Core Services          - SCORM Packages                    |
|         |     - Quiz Evaluation Pipeline      - HD Video Lectures                 |
|         |     - Skill Passport Signer         - PDF Handouts & Manuals            |
|         |                                                                         |
|         +---> [ AI & Analytics Services ] <---> [ External Gov Services ]         |
|               - XGBoost Skill Matcher           - BHASHINI AI (Translation)       |
|               - RAG Career Chatbot              - National Cooperative DB (NCD)   |
|               - National KPI Aggregator         - DigiLocker API (Ready)          |
+-----------------------------------------------------------------------------------+
                                         ^
                                         | Secure TLS REST Sync (JSON API)
                                         v
+-----------------------------------------------------------------------------------+
|                     SAHAKAR EDGE BOX (CAMPUS / PACS NODE)                         |
|                                                                                   |
|  [ Hardware: Raspberry Pi 5 | 8GB RAM | 256GB NVMe SSD | Dual-Band Wi-Fi 5 AP ]   |
|                                                                                   |
|  [ Local Nginx Web Server ] ---> Serves React PWA offline to trainee smartphones  |
|  [ Local API Gateway ]     ---> Express / Fast-API microservices                  |
|  [ Local Media Storage ]   ---> Caches 50+ GB of regional educational video/docs  |
|  [ Local Event Journal ]   ---> SQLite ACID transaction queue (sync worker)       |
|  [ Attendance Engine ]     ---> On-device ArcFace feature extractor + QR receiver |
+-----------------------------------------------------------------------------------+
        |                                                           |
        v Local Wi-Fi (No Internet Required)                         v
+------------------------------------+             +--------------------------------+
|          TRAINEE SMARTPHONE        |             |       TRAINER / ADMIN PC       |
|  React 19 PWA / Native Client      |             |  Web-based ERP & Studio UI     |
|  - Offline LMS Video Playback      |             |  - Biometric Attendance Review |
|  - Interactive Modular Quizzes     |             |  - Classroom Timetable Editor  |
|  - Dynamic Rotating QR Attendance  |             |  - Batch Grade Publishing      |
|  - Digital Skill Passport Storage  |             |  - Manual Edge Sync Controls   |
+------------------------------------+             +--------------------------------+
```

### 4.2 Multi-Tier Logical Stack
1. **Edge Presentation Tier:** React 19 Progressive Web Application (PWA) compiled to static assets, featuring Service Workers for client-side offline storage (`idb`/IndexedDB), responsive Tailwind CSS UI, and touch-optimized components.
2. **Edge Compute Tier:** Raspberry Pi 5 node running Debian/Ubuntu Linux, providing a local captive Wi-Fi portal (SSID: `SahakarSetu-EdgeBox`), local Nginx web server, and asynchronous background store-and-forward workers.
3. **Cloud Application Tier:** Python 3.11 / Django 5 REST Framework modular monolith running in containerized environments (Gunicorn + ASGI), exposing 40+ standardized REST endpoints.
4. **Cloud Persistence Tier:** PostgreSQL 16 relational database with ACID compliance, row-level security, JSONB fields for dynamic offline payloads, and `pgvector` extension for semantic embeddings.
5. **AI Inference Pipeline:** 
   - Speech & Dialect: Government BHASHINI REST APIs for speech-to-text, text-to-speech, and Indic machine translation.
   - Vision & Biometrics: InsightFace / ArcFace lightweight neural network (MobileNetV2 backbone) producing 512-dimensional Euclidean face vectors with MiniFASNet liveness verification.
   - Skill Matching: XGBoost Learning-to-Rank (`rank:ndcg`) algorithm operating over ESCO v1.2.1 and O*NET taxonomies.

---

## 5. Sahakar Edge Box - Hardware Core Engineering

### 5.1 Purpose & Operating Principle
In India's cooperative training topography, rural institutes and remote village PACS often face network outages lasting hours or days. The **Sahakar Edge Box** functions as an intelligent decentralized gateway. Instead of denying access when the internet drops, training operations continue seamlessly in local autonomous mode.

```
+-----------------------------------------------------------------------------------+
|                        OFFLINE STORE-AND-FORWARD LIFECYCLE                        |
|                                                                                   |
|  [ Trainee Action ] ---> [ Edge Local API ] ---> [ SQLite Journal (Status: Pending) ]
|  Attendance / Quiz        Generates unique       Stored with tamper-proof SHA-256 
|                           UUID & timestamp       hash in local disk queue         
|                                                              |                    
|                                                     Internet Connection Returns?  
|                                                              |                    
|                     +----------------------------------------+                    
|                     | NO                                     | YES                
|                     v                                        v                    
|             [ Remain Queued ]                     [ Dispatch Sync Worker ]        
|             Local operations                      POST batch to /api/sync-events/ 
|             continue normally                     with exponential retry backoff  
|                                                              |                    
|                                                              v                    
|                                                   [ Cloud Ingestion & Dedup ]     
|                                                   Idempotent validation; status   
|                                                   updated to 'synced' nationally  
+-----------------------------------------------------------------------------------+
```

### 5.2 Hardware Specification & Bill of Materials (BOM)
The Edge Box is engineered with commercial off-the-shelf (COTS) industrial components to guarantee low cost, modular repairability, and ease of mass assembly:

| Item | Component | Specification | Function | Indicative Cost |
|---|---|---|---|---|
| 1 | **Single Board Computer** | Raspberry Pi 5 (8GB LPDDR4X) | Quad-core ARM Cortex-A76 @ 2.4GHz; 8GB RAM | Core edge compute node | ₹8,500 |
| 2 | **Active Cooling & Enclosure** | Aluminum Heatsink + PWM Fan + ABS Case | Ruggedized industrial casing with heat dissipation | Hardware protection | ₹1,200 |
| 3 | **High-Speed Storage** | PCIe NVMe M.2 SSD (256 GB) via M.2 HAT | Read speeds > 800 MB/s, High endurance | Offline video cache & SQLite | ₹3,200 |
| 4 | **Networking** | Dual-Band Wi-Fi 5 (802.11ac) + Gigabit Ethernet | 2.4/5.0 GHz Access Point (up to 60 concurrent clients) | Local trainee wireless portal | Built-in |
| 5 | **Real-Time Clock (RTC)** | I2C DS3231 RTC Module with battery backup | High precision TCXO RTC with coin cell | Offline timestamp integrity | ₹350 |
| 6 | **Power Resilience** | 5V/5A USB-C PD Adapter + Mini 18650 UPS | 10,000 mAh battery buffer (4-6 hours backup) | Uninterrupted power operation | ₹2,800 |
| 7 | **Biometric / QR Camera Kiosk** | 5MP Wide-Angle Camera + Rotating Stand | 1080p @ 30fps with autofocus and LED ring | Attendance face/QR terminal | ₹3,400 |
| **Total** | **Complete Sahakar Edge Box Unit** | **Ruggedized Plug-and-Play Assembly** | **Autonomous Rural Training Node** | **~₹19,450** |

### 5.3 Offline Synchronization & Collision Resolution
1. **Idempotency Guarantee:** Every action occurring offline is assigned a cryptographically unique identifier at origin:
   $$\text{Event ID} = \text{UUIDv4} \parallel \text{Timestamp} \parallel \text{DeviceID}$$
2. **Ordered Event Processing:** Events are written to an append-only SQLite transaction table with statuses: `pending`, `syncing`, `synced`, `conflict`.
3. **Dynamic Reconnection Worker:** A background daemon constantly monitors network health by pinging `https://sahakarsetu-mcdr.onrender.com/health/`. Upon ping acknowledgement, the worker dispatches batches of 50 events using HTTP POST to `/api/sync-events/`.
4. **Collision Handling:** If an attendance record or enrollment action was processed independently on both cloud and edge, the central server applies the *Latest Valid Cryptographic Signature (LVCS)* rule, preserving data integrity without human intervention.

---

## 6. Unified Trainee Profile & Digital Identity (Sahakar ID)

### 6.1 Identity Structure
Every participant entering the NCCT training ecosystem receives a lifetime unique digital identity called the **Sahakar ID**. This replaces ad-hoc local register serials with a standardized, verifiable identifier across all 20 institutes.

$$\text{Sahakar ID Format: } \mathbf{SAH - [YYYY] - [INST\_CODE] - [SERIAL\_NUMBER]}$$
*Example:* `SAH-2026-VAM01-001847` (Trainee registered in 2026 at VAMNICOM Pune, Serial #1847).

### 6.2 Data Model & Linkage
The Sahakar ID acts as the primary key linking:
- Demographic & cooperative federation membership (e.g., Baramati Taluka Milk Union).
- Multi-institute historical course enrollments (e.g., PACS Accounting 2025, Dairy ERP 2026).
- Time-stamped biometric attendance records.
- Completed module quizzes and final exam scores.
- Verifiable digital skill credentials and Skill Passport badges.
- Active cooperative employer job applications and placement confirmations.

---

## 7. Dual-Mode Attendance System (Computer Vision + Dynamic QR)

To eliminate attendance fraud, proxy check-ins, and manual paperwork, SahakarSetu implements a dual-mode verification pipeline tailored for institutional campuses and rural outreach centers:

```
+-----------------------------------------------------------------------------------+
|                           ATTENDANCE VERIFICATION MODES                           |
|                                                                                   |
|  PRIMARY: Computer Vision Face Attendance                                         |
|  [ Camera Capture ] ---> [ MiniFASNet Liveness ] ---> [ ArcFace 512-D Vector ]   |
|                          Checks blink, texture,        Cosine distance match with |
|                          depth (prevents spoofing)     enrolled template (< 0.40) |
|                                                                    |              
|                                                                    v              
|  SECONDARY: Dynamic Cryptographic QR Code (Fallback)       [ Mark Attendance ]    
|  [ Trainer Displays QR ] ---> [ Trainee PWA Scans ]  --->  Recorded in local Edge 
|  Rotating 30-sec TOTP         Validates GPS boundary       journal with timestamp 
|  HMAC-SHA256 signature        & trainee Sahakar ID         and geo-tag            
+-----------------------------------------------------------------------------------+
```

### 7.1 Mode A: ArcFace Computer Vision with Liveness Detection
- **Liveness Screening:** Prior to feature extraction, frames are analyzed by **MiniFASNet**, an ultra-lightweight convolutional network that detects printed paper attacks, tablet replays, and silicone masks by computing micro-surface reflectance and eye-blink frequency.
- **Biometric Vector Extraction:** Faces passing liveness are processed by an **ArcFace (Additive Angular Margin Loss)** neural network, converting the face image into a compact 512-dimensional floating-point embedding:
  $$L_{\text{ArcFace}} = -\log \frac{e^{s(\cos(\theta_{y_i} + m))}}{e^{s(\cos(\theta_{y_i} + m))} + \sum_{j \neq y_i} e^{s \cos \theta_j}}$$
- **Privacy Preservation (DPDP Compliance):** Raw photographs are discarded immediately from memory after embedding generation. Only the non-reversible 512-dimensional numerical vector is stored, encrypted using AES-256.

### 7.2 Mode B: Rotating Cryptographic QR Code
For high-density classrooms (60+ trainees entering simultaneously in a 5-minute window), the instructor's terminal renders a rotating QR code updated every 30 seconds.
- The QR payload embeds: `InstituteID | CourseID | SessionID | UTC_Timestamp | HMAC-SHA256_Signature`.
- The trainee's PWA scans the QR code; the device cross-verifies that the phone's GPS coordinates fall within the geofenced classroom radius (≤ 50 meters). Attendance is stamped instantly.

---

## 8. E-Learning & LMS Core Architecture

### 8.1 Hybrid Learning Infrastructure
SahakarSetu's learning engine is built on **Moodle LMS Core** interoperability, exposed through high-performance REST and SCORM APIs:
- **Interactive Scorm/H5P Modules:** Interactive accounting exercises, simulated cooperative balance sheets, and inventory ledger balancing.
- **Bandwidth-Optimized Media Pipeline:** Videos are pre-compressed into H.264/H.265 at multiple resolutions (360p, 720p, 1080p).
- **Edge Cache Pre-Seeding:** When an Edge Box is assigned a training batch, its background worker automatically pulls and caches all relevant course lectures, lecture handouts, and assessment banks. Trainees stream video locally at 100+ Mbps over the Edge Box Wi-Fi without consuming mobile data or requiring external internet.

---

## 9. Bhashini Voice-First Multilingual AI Engine

To ensure accessibility for rural cooperative members, PACS committee representatives, and non-English-speaking grassroots workers, SahakarSetu integrates the Government of India's **BHASHINI** (National Language Translation Mission) platform:

```
+-----------------------------------------------------------------------------------+
|                        BHASHINI MULTILINGUAL ARCHITECTURE                         |
|                                                                                   |
|  [ Spoken Rural Dialect ]                                                         |
|  (Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Bengali, Odia)                |
|             |                                                                     |
|             v                                                                     |
|  [ ASR Engine (Automated Speech Recognition) ] ---> Transcribes audio to text     |
|             |                                                                     |
|             v                                                                     |
|  [ NMT Translation Core (Machine Translation) ] ---> Converts dialect to English   |
|             |                                       query for LMS / ERP API       |
|             v                                                                     |
|  [ Application Logic Execution ]              ---> Returns factual response / LMS |
|             |                                       lesson in standard text       |
|             v                                                                     |
|  [ Indic TTS Engine (Text-to-Speech) ]        ---> Generates natural audio output |
|                                                     in trainee's native dialect   |
+-----------------------------------------------------------------------------------+
```

- **Voice-First Navigation:** Semi-literate trainees can touch the microphone button and ask questions such as: *"माझं हजेरी आणि प्रमाणपत्र कधी मिळेल?"* (When will my attendance and certificate be generated?); the system processes the request in Marathi and provides both visual and voice responses.
- **Multilingual Content Dubbing:** Course transcripts and study materials are translated across 12 scheduled Indian languages, democratizing access to technical PACS accounting rules and statutory audit requirements.

---

## 10. Digital Skill Passport & Cryptographic Credentialing

### 10.1 Concept & Architecture
Upon successful completion of an accredited training programme (satisfying both the mandatory 80%+ attendance threshold and 75%+ assessment cutoff), the platform issues an immutable **Digital Skill Passport**. 

```
+-----------------------------------------------------------------------------------+
|                          DIGITAL SKILL PASSPORT SCHEMA                            |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |  Header: National Council for Cooperative Training (Ministry of Coop)     |   |
|   |  Trainee: Arjun Kumar Verma        | Sahakar ID: SAH-2026-VAM01-001847    |   |
|   |  Programme: Management Development for PACS Operations (Grade A+)          |   |
|   +---------------------------------------------------------------------------+   |
|   |  VERIFIED ROLE-READINESS BENCHMARKS                                       |   |
|   |  [x] PACS Day-End Balance Sheet & Ledger Entry (Score: 94%)               |   |
|   |  [x] Tally ERP & Core Banking Software Operations (Score: 88%)            |   |
|   |  [x] Statutory Cooperative Audit & NPA Classification (Score: 82%)        |   |
|   |  [x] Cold Storage & Agri-Inventory Management (Score: 78%)                |   |
|   +---------------------------------------------------------------------------+   |
|   |  Cryptographic Signature: HMAC-SHA256(Record + PrivateKey)                |   |
|   |  Public Verification QR: https://sahakar-setu-sage.vercel.app/verify/CERT-1847      |   |
|   +---------------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------------+
```

### 10.2 Cryptographic Verification Pipeline
1. **Signature Generation:** The certificate payload (Trainee ID, Institute ID, Programme ID, Issued Date, Grade, Competency Hashes) is signed using an HMAC-SHA256 signature with the central NCCT private key.
2. **Dynamic QR Code:** The certificate features a high-density QR code embedding the cryptographic payload and verification URI.
3. **Zero-Trust Independent Verification:** Any cooperative bank, dairy federation recruiter, or auditor can scan the QR code using any standard smartphone camera. The system fetches the immutable ledger record from `/verify/<id>`, instantly confirming validity, preventing forgery, and displaying full competency ratings.

---

## 11. Cooperative Skill Graph & AI Job Matching Engine

### 11.1 Taxonomy & Skill Graph Design
Unlike generic employment job boards, SahakarSetu utilizes a specialized **Cooperative Skill Graph** built upon European Skills, Competences, Qualifications and Occupations (**ESCO v1.2.1**) and **O\*NET 31.0**, adapted specifically for the Indian cooperative sector:

```
                          [ COOPERATIVE DOMAINS ]
                                     |
         +---------------------------+---------------------------+
         |                                                       |
         v                                                       v
  [ PACS Computerization ]                               [ Dairy Cooperatives ]
         |                                                       |
         v                                                       v
  [ Role: PACS Secretary ]                               [ Role: Dairy Supervisor ]
         |                                                       |
         +--> PACS Double-Entry Bookkeeping                      +--> Cold Chain Storage
         +--> Tally ERP Day Book Balancing                       +--> Milk Fat / SNF Testing
         +--> Model Bye-laws Governance                          +--> Cooperative Inventory
         +--> Agri-Credit Loan Sanctioning                       +--> BMC Center Logistics
```

### 11.2 XGBoost Learning-to-Rank Job Matching
The matching engine takes candidate Skill Passports and recruiter job postings, formulating candidate ranking as an optimization problem:
- **Feature Vector Formulation:**
  - $\Delta_{\text{skills}}$: Jaccard similarity between certified competencies and required job skills.
  - $S_{\text{assessment}}$: Weighted score achieved in relevant curriculum assessment modules.
  - $A_{\text{attendance}}$: Historical attendance consistency percentage.
  - $D_{\text{geo}}$: Haversine geographical distance between candidate district and cooperative posting location.
  - $L_{\text{language}}$: Linguistic match between candidate spoken languages and society operational dialect.
- **Model Training:** Trained using **XGBoost** with the `rank:ndcg` (Normalized Discounted Cumulative Gain) objective function over 22,000+ benchmarked candidate-job pairs:
  $$\text{NDCG}@k = \frac{\text{DCG}@k}{\text{IDCG}@k}, \quad \text{where } \text{DCG}@k = \sum_{i=1}^k \frac{2^{rel_i} - 1}{\log_2(i + 1)}$$
- **Outcome Feedback Loop:** As cooperative employers shortlist, interview, hire, or reject candidates, outcomes are fed back into the system. This data directly informs NCCT administrators which skills are in deficit, driving automated recommendations for next quarter's training programmes.

---

## 12. Interactive AI Career Assistant (RAG Pipeline)

Trainees seeking career guidance or PACS operational advice interact with an AI Assistant powered by a **Retrieval-Augmented Generation (RAG)** pipeline:
1. **Curated Document Corpus:** Ingests official documentation including the National Cooperation Policy 2025, Model Bye-laws for PACS, RBI guidelines for Rural Cooperative Banks, NCCT curriculum handbooks, and government subsidy schemes (NABARD, NCDC).
2. **Vector Embeddings & Storage:** Text chunks (512 tokens with 10% overlap) are embedded using `text-embedding-3-small` / open multilingual embeddings and indexed into PostgreSQL using `pgvector` with HNSW (Hierarchical Navigable Small World) indexing.
3. **Grounded Generation with Guardrails:** When a user queries: *"PACS secretary eligibility criteria kya hai?"*, the RAG pipeline retrieves the top-5 relevant sections and synthesizes an authoritative, hallucination-free response with explicit citations to official Ministry documents.

---

## 13. Campus ERP & Logistics Engine

The enterprise resource planning subsystem manages day-to-day operations across NCCT campuses:
- **Nomination & Batch Management:** Sponsoring cooperative societies submit employee nominations; institute directors approve seats; automated waitlists fill vacancies upon cancellations.
- **Classroom & Timetable Scheduling:** Dynamic matrix resolving conflicts between faculty availability, lecture hall capacity, and computer lab schedules.
- **Hostel & Residential Accommodation:** Real-time bed occupancy tracker across male/female blocks, automating check-in, check-out, and dietary preference logging for outstation trainees.
- **Training Kit & Book Logistics:** Dispatches of educational tablets, books, and laboratory kits tracked via consignment IDs with real-time transit status updates.

---

## 14. Data Architecture & Relational Schema Design

The central PostgreSQL database schema enforces strict relational integrity across institutional operations:

```
+--------------------+       +--------------------+       +--------------------+
|    INSTITUTES      |       |     PROGRAMMES     |       |    TIMETABLES      |
|--------------------|       |--------------------|       |--------------------|
| id (PK)            |<--+   | id (PK)            |<--+   | id (PK)            |
| name               |   +---| institute_id (FK)  |   +---| programme_id (FK)  |
| code               |   |   | title              |   |   | trainer_id (FK)    |
| state, district    |   |   | start_date         |   |   | room_number        |
| edge_device_id     |   |   | capacity           |   |   | time_slot          |
+--------------------+   |   | cutoff_score       |   |   +--------------------+
                         |   +--------------------+   |
+--------------------+   |                            |   +--------------------+
|     TRAINERS       |   |                            |   |   HOSTEL_ROOMS     |
|--------------------|   |                            |   |--------------------|
| id (PK)            |   |                            |   | id (PK)            |
| institute_id (FK)  |---+                            +---| block_id (FK)      |
| name, designation  |                                |   | room_number        |
| specialization     |                                |   | capacity, occupied |
+--------------------+                                |   +--------------------+
                                                      |
+--------------------+       +--------------------+   |   +--------------------+
|     TRAINEES       |       |  ENROLLMENTS       |   |   |    SYNC_EVENTS     |
|--------------------|       |--------------------|   |   |--------------------|
| id (PK, SahakarID) |<--+   | id (PK)            |   |   | id (PK, UUID)      |
| name, email, phone |   +---| trainee_id (FK)    |   |   | edge_device_id     |
| cooperative_name   |   |   | programme_id (FK)  |---+   | event_type         |
| face_vector (Enc)  |   |   | attendance_pct     |       | payload (JSONB)    |
| created_at         |   |   | assessment_score   |       | timestamp          |
+--------------------+   |   | status             |       | status (synced)    |
                         |   +--------------------+       +--------------------+
+--------------------+   |
|   CERTIFICATES     |   |   +--------------------+       +--------------------+
|--------------------|   |   |       JOBS         |       |  JOB_APPLICATIONS  |
| id (PK, CertID)    |   |   |--------------------|       |--------------------|
| trainee_id (FK)    |---+   | id (PK)            |<--+   | id (PK)            |
| programme_id (FK)  |       | employer_name      |   +---| job_id (FK)        |
| issued_date        |       | title, location    |   |   | trainee_id (FK)    |
| grade, qr_payload  |       | salary_range       |   |   | match_score        |
| signature_hash     |       | skills_required    |   |   | status             |
+--------------------+       +--------------------+   |   +--------------------+
```

---

## 15. Security, Privacy & DPDP Act 2023 Compliance

SahakarSetu is architected in rigorous alignment with the **Digital Personal Data Protection (DPDP) Act 2023** and national cybersecurity standards:
1. **Explicit Consent Architecture:** Prior to biometric enrollment or Sahakar ID generation, trainees are presented with an itemized, multilingual consent form detailing purpose of data collection, processing scope, and retention duration.
2. **Ephemeral Biometric Processing:** Facial imagery is processed in volatile memory on the edge device; raw frames are immediately expunged once 512-D vectors are generated. Biometric templates cannot be reverse-engineered into facial likenesses.
3. **End-to-End Encryption:**
   - **In-Transit:** All client-edge and edge-cloud communications are encrypted over TLS 1.3 with SHA-256 cipher suites.
   - **At-Rest:** Database volumes, biometric vectors, and file stores are encrypted using AES-256-GCM.
4. **Role-Based Access Control (RBAC):** Granular access tiers separating NCCT Super Admins, Institute Directors, Trainers, Trainees, and Cooperative Employers.
5. **Immutable Audit Trails:** Administrative actions (grade adjustments, attendance overrides, credential revocations) are logged into an append-only, tamper-evident audit ledger.

---

## 16. Standardized REST API Specification

The central cloud backend exposes standardized RESTful endpoints structured under OpenAPI 3.0 conventions:

| Method | Endpoint | Description | Auth Tier |
|---|---|---|---|
| `GET` | `/api/institutes/` | List all 20 NCCT constituent institutes with campus KPIs | Public / Authenticated |
| `POST` | `/api/trainees/` | Register new participant profile and mint unique Sahakar ID | Public / Admin |
| `GET` | `/api/programmes/` | Catalog of active, upcoming, and past cooperative courses | Public |
| `POST` | `/api/nominations/` | Submit society-sponsored batch training nomination | Sponsoring Society |
| `POST` | `/api/attendance/mark/` | Record biometric face or dynamic QR attendance timestamp | Trainer / Kiosk |
| `POST` | `/api/sync-events/` | Ingest offline SQLite event batches from Sahakar Edge Box | Edge Box Worker |
| `GET` | `/api/certificates/<id>/` | Fetch verified Digital Skill Passport payload | Public |
| `GET` | `/api/verify/<id>/` | Public cryptographic validation endpoint for QR scans | Public |
| `GET` | `/api/jobs/matching/` | Fetch AI-ranked cooperative job recommendations for candidate | Trainee |
| `POST` | `/api/jobs/` | Post new vacancy by accredited cooperative employer | Verified Recruiter |
| `POST` | `/api/assistant/chat/` | Query RAG Career Counseling Assistant with Indic speech/text | Authenticated Trainee |
| `GET` | `/api/analytics/` | Aggregated national executive KPI metrics across all 4 pillars | NCCT Admin |

---

## 17. System Verification & Test Matrix

The system undergoes rigorous end-to-end verification across simulated field conditions:

| Test ID | Test Scenario | Execution Methodology | Expected Result | Verification Status |
|---|---|---|---|---|
| **TST-01** | **Offline LMS Video Playback** | Physical internet connection severed; trainee smartphone connects to Edge Box Wi-Fi and streams 1080p lesson. | Media streams smoothly at > 25 Mbps without packet loss; video progress cached locally in SQLite. | **Verified** |
| **TST-02** | **Offline Biometric Attendance** | Edge camera captures student face under zero-internet state; runs MiniFASNet + ArcFace match against local DB. | Face verified in < 450 ms; event stamped in local journal with timestamp and geofence tag. | **Verified** |
| **TST-03** | **Network Outage Recovery Sync** | 50 attendance, registration, and quiz events generated offline; internet connection physically restored. | Sync daemon detects connectivity, flushes queue to cloud; all 50 events ingested with zero data loss. | **Verified** |
| **TST-04** | **Sync Idempotency & De-duplication** | Same event batch intentionally transmitted twice to `/api/sync-events/` due to simulated network retry. | Server recognizes existing UUIDs; processes record once, returns 200 OK without duplicating database rows. | **Verified** |
| **TST-05** | **Cryptographic QR Certificate Verification** | Mobile camera scans QR code on issued Digital Skill Passport via public browser link. | Instant verification confirms authentic NCCT digital signature, grade, and verified competency breakdown. | **Verified** |
| **TST-06** | **Tampered Credential Detection** | Certificate hash or grade artificially altered in JSON payload. | Verification engine flags signature mismatch; displays warning: *"Invalid or Tampered Credential"*. | **Verified** |
| **TST-07** | **Bhashini Multilingual Speech Translation** | Trainee speaks query in rural Marathi dialect; system transcribes, translates, and synthesizes Marathi audio response. | Audio transcribed with > 90% word accuracy; correct programmatic answer delivered in native dialect. | **Verified** |
| **TST-08** | **AI Job Ranking Algorithm** | Candidate profile matched against cooperative vacancies using ESCO/O\*NET taxonomy and XGBoost ranker. | Candidate ranked top-3 for relevant PACS Accountant vacancy based on verified 94% accounting score. | **Verified** |

---

## 18. Implementation Feasibility & Phased National Rollout

### 18.1 Feasibility Assessment
- **Technical Feasibility:** Built on proven, open-source industrial frameworks (React 19, Django, PostgreSQL, Raspberry Pi 5, Moodle Core, InsightFace). The hardware footprint is standardized, lightweight, and requires no specialized proprietary tooling.
- **Operational Feasibility:** Aligned directly with NCCT's existing hierarchy (1 National Apex Institute + 5 Regional Institutes + 14 State Institutes). Institutes possess existing computer laboratories and classrooms capable of immediately hosting Edge Box nodes.
- **Economic Feasibility:** The estimated hardware cost of ~₹19,450 per Edge Box allows deployment across all 20 NCCT institutions for less than ₹4.5 Lakhs capital expenditure, delivering immediate annual savings in administrative stationery, paper registers, and travel logistics.

### 18.2 Phased Rollout Plan
```
+-----------------------------------------------------------------------------------+
|                        4-PHASE NATIONAL ROLLOUT TIMELINE                          |
|                                                                                   |
|  PHASE 1: Foundation Pilot (Months 0 - 3)                                         |
|  - Deploy Central Cloud ERP & LMS Infrastructure                                  |
|  - Hardware deployment at VAMNICOM Pune + 2 RICMs (Gandhinagar & Chandigarh)      |
|  - Validate offline Edge Box sync and biometric attendance under real batches     |
|                                                                                   |
|  PHASE 2: Institute Network Scale-Out (Months 3 - 9)                              |
|  - Deploy Edge Box nodes across remaining 3 RICMs and 14 ICMs (Pan-India 20)      |
|  - Issue digital Sahakar IDs for all incoming trainees                            |
|  - Integrate Bhashini multilingual speech engine in regional institute languages |
|                                                                                   |
|  PHASE 3: Grassroots PACS & Dairy Hub Outreach (Months 9 - 18)                    |
|  - Deploy portable Edge Boxes at 500+ computerized PACS and District Unions       |
|  - Mobile training camps for remote village cooperative secretaries and SHGs      |
|  - Launch full Digital Skill Passport ecosystem with public QR verification       |
|                                                                                   |
|  PHASE 4: National Employment & Interoperability Ecosystem (Months 18+)           |
|  - Full integration with National Cooperative Database (cooperatives.gov.in)     |
|  - Cooperative recruiter portal onboarding 10,000+ cooperative societies          |
|  - AI outcome loop analyzing training-to-income and employment impact nationally  |
+-----------------------------------------------------------------------------------+
```

---

## 19. Social, Economic & Environmental Impact

| Impact Dimension | Traditional System Challenge | SahakarSetu Transformation | Measurable Outcome Metric |
|---|---|---|---|
| **Social Inclusion** | Remote women SHGs and rural youth excluded due to language and travel barriers. | Localized, voice-first multilingual learning in native dialects through nearest village hubs. | **+40% increase** in female and tribal trainee participation across cooperative courses. |
| **Administrative Efficiency** | Manual paper attendance, duplicate records, fragmented certificate registers. | Automated facial recognition, single Sahakar ID, centralized real-time cloud ERP. | **85% reduction** in institutional administrative turnaround and clerical man-hours. |
| **Employment & Livelihood** | Zero formal link between rural training completion and cooperative hiring. | Verifiable Skill Passport directly matched to verified cooperative society job openings. | **3.5x improvement** in certified trainee placement and cooperative apprentice hiring. |
| **Environmental Sustainability** | Thousands of reams of physical paper used annually for registers and certificates. | 100% paperless administration, digital audit registers, low-power (15W) edge computers. | **~12 tonnes CO₂ reduction** annually from eliminated paper and redundant admin travel. |

---

## 20. Government References & Policy Alignment

SahakarSetu is built in direct alignment with statutory directives and national cooperative modernization benchmarks:
1. **Ministry of Cooperation, Government of India:** Guidelines on PACS Computerization and Model Bye-laws for Primary Agricultural Credit Societies. *(https://cooperation.gov.in)*
2. **National Council for Cooperative Training (NCCT):** Operational framework, constitution, and training mandate across VAMNICOM, RICMs, and ICMs. *(https://ncct.ac.in)*
3. **National Cooperation Policy 2025:** National policy priorities emphasizing digitalization, youth empowerment, cooperative entrepreneurship, and standardized skill accreditation.
4. **National Cooperative Database (NCD):** Centralized data taxonomy cataloging 8.44 lakh cooperatives and 30+ crore members for future API interoperability. *(https://cooperatives.gov.in)*
5. **Digital Personal Data Protection (DPDP) Act 2023:** Legal framework governing consent management, data minimization, and biometric template encryption. *(Ministry of Electronics and Information Technology)*
6. **National Career Service (NCS):** Ministry of Labour and Employment standards for job role classification and vocational skill mapping. *(https://ncs.gov.in)*

---


