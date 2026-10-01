# SahakarSetu - Technical Architecture & External Evaluation Evidence Report

**Smart India Hackathon 2026**  
**Problem Statement:** 26087 - AI & LMS-Enabled Cooperative Capacity Building, ERP & Employment Ecosystem  
**Theme:** Smart Education  
**PS Category:** Hardware  
**Idea:** SahakarSetu  
**Purpose:** External-round technical annexure / GitHub documentation

---

## 1. Executive Summary

SahakarSetu is proposed as a centralized training-to-employment ecosystem for NCCT institutions. The platform combines training ERP, LMS, offline learning, attendance, assessments, certification, skill mapping, employment discovery, analytics, and AI-assisted guidance.

The key differentiator for the Hardware category is the **Sahakar Edge Box**: a low-cost local edge computer deployed at an institute that provides local Wi-Fi access to learning and attendance services even when the institute has little or no internet connectivity. When connectivity returns, the edge node synchronizes eligible records with the central cloud platform.

The external-round implementation should demonstrate the smallest end-to-end path that proves this differentiator:

> **Register -> Sahakar ID -> Offline Learning -> Attendance -> Assessment -> Certificate -> QR Verification -> Job Match -> Sync/Analytics**

The prototype should clearly distinguish between:

- **Working prototype:** features that can be demonstrated live.
- **Prototype-grade modules:** features implemented sufficiently for a technical proof but not production-hardened.
- **Planned integrations:** government, institutional, or employer integrations requiring authorization/data access.

This distinction is intentional and should be preserved in the PPT, demo video, and GitHub documentation.

---

## 2. Problem Understanding

The problem statement identifies fragmented/manual training operations across cooperative training institutions and the need to connect training with learning, certification, analytics, and employment.

SahakarSetu addresses this as a single lifecycle rather than as separate applications:

```text
Programme / Nomination
        |
        v
Trainee Identity (Sahakar ID)
        |
        v
Training ERP + LMS
        |
        +----> Attendance
        |
        +----> Assessments
        |
        v
Verified Skill Credential
        |
        v
Skills / Role Mapping
        |
        v
Employment Discovery
        |
        v
Outcome Analytics
        |
        v
Programme Planning Feedback
```

### Core design principle

The system must not become only another cloud LMS. The differentiator is the **training-to-employment data loop plus offline edge capability**.

---

## 3. Requirement-to-Solution Mapping

| Problem-statement requirement | SahakarSetu response | Prototype target |
|---|---|---|
| Online registration & nomination | Web/admin registration workflow and nomination status | Working |
| Participant/institution/trainee profiles | Central profile model + Sahakar ID | Working |
| Multilingual e-learning | PWA/mobile learner interface + language layer | Working / prototype |
| Face / QR attendance | Rotating QR first; biometric module as optional prototype | Working QR; face prototype |
| Timetable, hostel, logistics | ERP modules and allocation workflow | Planned/prototype |
| LMS + assessment + certification | Moodle-compatible LMS + assessment service + certificate service | Working core |
| Skill certification repository | Signed credential record + QR verification page | Working |
| Career counseling chatbot | Retrieval-augmented knowledge assistant | Prototype |
| Employer dashboard | Employer job posting + candidate discovery | Prototype |
| Mobile/offline learning | PWA/mobile client + Edge Box cache/local services | Working core |
| Centralized monitoring | Central cloud database + analytics dashboard | Working core |

---

## 4. System Architecture

### 4.1 High-level architecture

```text
                                      INTERNET / GOVERNMENT NETWORK
                                                  |
                            +---------------------+---------------------+
                            |                                           |
                            v                                           v
                 +-----------------------+                    +----------------------+
                 |     SAHAKAR CLOUD     |                    | External Integrations|
                 |-----------------------|                    | NCD / DigiLocker /   |
                 | API Gateway / Backend |                    | Bhashini / employers |
                 | Django ERP APIs       |                    +----------------------+
                 | PostgreSQL             |
                 | LMS / Moodle          |
                 | Credential Service    |
                 | Analytics             |
                 | AI/RAG services       |
                 | Central Object Store  |
                 +-----------+-----------+
                             |
                      Secure Sync API
                             |
                             v
                +--------------------------------+
                |       SAHAKAR EDGE BOX         |
                |       Raspberry Pi 5           |
                |--------------------------------|
                | Local API                      |
                | Local SQLite / event store     |
                | LMS content cache              |
                | Attendance service             |
                | Assessment service             |
                | Sync queue / retry worker      |
                | Local Wi-Fi access point       |
                +----------+----------+-----------+
                           |          |
             +-------------+          +----------------+
             |                                         |
             v                                         v
       +-------------+                           +-------------+
       | Trainee PWA |                           | Trainer/Admin|
       | / Flutter   |                           | Web console |
       +-------------+                           +-------------+

             OFFLINE MODE: Edge Box operates independently.
             ONLINE MODE: Edge Box synchronizes events with the cloud.
```

### 4.2 Logical layers

**Presentation layer**
- React PWA for browser-based access.
- Flutter mobile app for supported mobile workflows.
- Responsive admin dashboards.

**Application layer**
- Django REST APIs for ERP and learner services.
- Authentication, RBAC, validation, business rules.
- Attendance, assessment, credential, employment, and analytics services.

**Learning layer**
- Moodle as the proposed LMS core.
- Local content cache at Edge Box for offline delivery.

**Data layer**
- PostgreSQL in the cloud.
- SQLite/local event store on Edge Box.
- Object storage for approved learning media and documents.
- Audit/event records for synchronization.

**AI layer**
- Bhashini-compatible language/voice pipeline.
- RAG chatbot over verified knowledge sources.
- Face embedding + liveness prototype for attendance.
- Skill/job matching baseline; supervised ML only after sufficient labelled outcome data exists.

**Integration layer**
- Versioned REST APIs.
- Webhooks/background sync where appropriate.
- Government integrations only after authorization and interface availability.

---

## 5. Sahakar Edge Box

### 5.1 Purpose

The Edge Box is designed for training locations where internet availability is unreliable, expensive, or intermittent.

It provides a local network so that phones/tablets can access cached course content and locally available application services without contacting the cloud for every action.

### 5.2 Minimum responsibilities

1. Start a local Wi-Fi network or connect to an institute LAN.
2. Serve the learner PWA and local APIs.
3. Store approved course media locally.
4. Store attendance/assessment events locally.
5. Maintain a synchronization queue.
6. Retry synchronization after connectivity returns.
7. Provide basic device/site health information.

### 5.3 Offline workflow

```text
Trainee action
     |
     v
Local PWA / Local API
     |
     v
Local DB -> Create Event ID
     |
     v
Sync Queue (PENDING)
     |
     +---- Internet unavailable ----> Continue locally
     |
     +---- Internet available ------> Secure Sync API
                                       |
                                       v
                                  Cloud validates
                                       |
                                       v
                                  ACK / REJECT
                                       |
                                       v
                              Local status updated
```

### 5.4 Sync reliability design

Each offline event should carry at least:

- `event_id` (globally unique UUID)
- `trainee_id`
- `institute_id`
- `device_id`
- `event_type`
- `created_at`
- `client_version`
- `payload`
- `sync_status`
- `retry_count`

The server should process event IDs idempotently so that a repeated request does not create duplicate attendance, assessment, or certificate records.

### 5.5 Reconnection test

The core external-demo test is:

1. Connect trainee device to Edge Box.
2. Confirm cloud is reachable.
3. Disconnect internet.
4. Complete a learning action and attendance action.
5. Verify records exist locally.
6. Reconnect internet.
7. Observe queue processing.
8. Verify cloud records are created exactly once.
9. Show a synchronization log.

---

## 6. Identity and Sahakar ID

A Sahakar ID is the platform-level learner identity used to link registration, training, learning, attendance, assessments, credentials, and employment activity.

### Proposed logical model

```text
Sahakar ID
   |
   +-- Profile
   +-- Institute / Programme
   +-- Attendance Events
   +-- Learning Progress
   +-- Assessments
   +-- Skills
   +-- Credentials
   +-- Job Applications
   +-- Outcome Records
```

The prototype should use synthetic/anonymized records. Production deployment requires authorized institutional data access and approved data-sharing procedures.

---

## 7. Attendance Architecture

### 7.1 Recommended prototype order

**Primary prototype:** rotating QR attendance.

**Secondary prototype:** face recognition + liveness proof-of-concept.

QR should remain a fallback for biometric failure, consent limitations, or hardware constraints.

### 7.2 QR flow

```text
Trainer starts session
        |
        v
Server/Edge creates rotating token
        |
        v
Trainee scans token
        |
        v
Validate trainee + session + expiry + institute/device
        |
        v
Create attendance event
```

### 7.3 Face attendance flow

```text
Consent -> Enrollment -> Face embedding
                  |
                  v
             Local matching
                  |
              Liveness
                  |
                  v
           Attendance event
```

For the prototype, do not claim production biometric compliance or production-grade liveness performance without testing evidence.

---

## 8. LMS and Offline Learning

The learner interface should expose a small number of actions that work both online and offline:

- View enrolled programmes.
- Open cached lessons.
- Play approved offline videos.
- Attempt locally cached quizzes.
- Store progress locally.
- Synchronize completion and assessment events after reconnect.

### Content synchronization

Only administrator-approved content should be cached. The Edge Box can maintain content metadata such as:

- content ID
- version
- checksum
- size
- language
- programme ID
- expiry/retention rules

This prevents stale or tampered learning content from silently replacing the current version.

---

## 9. Skill Passport and Credential Verification

The prototype should generate a verifiable credential record containing:

- learner identity reference
- course/programme ID
- skill IDs
- issuing institution
- issue date
- credential ID
- verification URL/QR
- digital signature or integrity proof

### Verification flow

```text
Certificate QR
      |
      v
Verification endpoint
      |
      v
Credential ID lookup
      |
      v
Signature / integrity check
      |
      v
Show status + issuer + skills + issue date
```

The prototype should demonstrate that an altered or unknown credential is rejected.

---

## 10. Skill Graph and Employment Matching

The skill graph converts training completion into structured employability information.

Example:

```text
Course: Cooperative Accounting Basics
        |
        v
Skills: Bookkeeping, Excel, GST basics
        |
        v
Role: Cooperative Accounts Assistant
        |
        v
Job: Employer requirement profile
        |
        v
Candidate-job match
```

### Matching approach for the prototype

Use deterministic/semantic matching first:

```text
Trainee skills
      +
Job required skills
      |
      v
Skill overlap / semantic similarity
      |
      v
Match score + missing skills
```

A supervised model such as XGBoost should be treated as a future phase unless a sufficiently large, labelled employment-outcome dataset is available.

---

## 11. AI Career Assistant - RAG Architecture

The chatbot should answer from verified platform knowledge rather than from unrestricted model memory.

```text
User question
    |
    v
Language / speech layer
    |
    v
Intent + query normalization
    |
    v
Retriever
    |
    +--> Courses
    +--> Skills
    +--> Jobs
    +--> Approved schemes / FAQs
    +--> Institute information
    |
    v
LLM response generation
    |
    v
Answer + source/context reference
```

### Prototype policy

The assistant should clearly indicate when information is unavailable. It should not fabricate job vacancies, salaries, government benefits, or programme details.

---

## 12. Data Architecture

### Main entities

```text
Institute
Programme
Nomination
Trainee
SahakarID
Enrollment
Session
AttendanceEvent
Course
LearningContent
Assessment
Attempt
Skill
Role
Credential
Employer
Job
Application
Outcome
SyncEvent
AuditLog
```

### Important relationships

```text
Institute 1---N Programme
Programme 1---N Nomination
Trainee 1---1 SahakarID
Trainee N---N Programme (Enrollment)
Enrollment 1---N AttendanceEvent
Enrollment 1---N AssessmentAttempt
Programme N---N Skill
Role N---N Skill
Employer 1---N Job
Job N---N Skill
Trainee 1---N Application
```

---

## 13. Security and Privacy-by-Design

The prototype should demonstrate the following controls:

- Role-based access control.
- HTTPS/TLS for network communication.
- Encryption at rest for sensitive records.
- Password hashing and secure session/token handling.
- Audit logs for sensitive administrative actions.
- Data minimization.
- Consent capture where required.
- Retention/deletion policy placeholders.
- QR fallback to reduce dependency on biometrics.
- Segregation of institute and central-admin permissions.

Use wording such as **“privacy-by-design aligned with applicable DPDP requirements”** rather than claiming legal compliance of a prototype.

Government data integrations, DigiLocker connectivity, and access to NCCT institutional records should be shown as **proposed/subject to authorization** unless the team has a real approved integration.

---

## 14. Proposed API Surface

Illustrative API groups:

```text
POST   /api/auth/login
POST   /api/trainees
GET    /api/trainees/{id}
POST   /api/nominations
GET    /api/programmes
POST   /api/enrollments
POST   /api/attendance/events
POST   /api/assessments/attempts
POST   /api/credentials
GET    /api/credentials/{id}/verify
GET    /api/jobs
POST   /api/jobs
POST   /api/applications
POST   /api/sync/events
GET    /api/sync/status
GET    /api/analytics/summary
POST   /api/assistant/query
```

The exact API paths may change during implementation; the GitHub repository should publish an OpenAPI/Swagger specification once the endpoints stabilize.

---

## 15. Hardware Prototype

### Recommended pilot BOM categories

| Component | Function |
|---|---|
| Raspberry Pi 5 | Edge compute |
| SSD / high-endurance storage | Offline course content + local data |
| Camera | Attendance proof-of-concept |
| Wi-Fi/networking | Local trainee access |
| Power backup / UPS | Continuity during power/network interruptions |
| Enclosure | Physical deployment |
| Optional QR scanner | Institute/kiosk workflows |

The current submitted deck uses an approximate Edge Box figure; replace that figure with an actual BOM and current quotations before making a cost claim in the external presentation.

---

## 16. Prototype Scope - What to Build First

### Phase A - Must-have external demo

**Goal:** prove the hardware + offline proposition.

Build:

1. Raspberry Pi 5 Edge Box setup.
2. Local Wi-Fi hotspot/LAN.
3. React PWA served locally.
4. Local SQLite database.
5. Sample course/video cache.
6. QR attendance.
7. Local assessment.
8. Offline event queue.
9. Cloud API.
10. Reconnect and automatic sync.
11. Admin dashboard showing synced data.

### Phase B - Strong supporting evidence

12. Sahakar ID.
13. QR Skill Passport.
14. Verification page.
15. Trainer dashboard.
16. Basic analytics.

### Phase C - AI proof

17. RAG career assistant.
18. Multilingual text/voice pipeline.
19. Face recognition + liveness proof-of-concept.
20. Skill/job matching baseline.

### Phase D - Future/scale integrations

21. Moodle deep integration.
22. DigiLocker-ready workflow.
23. NCD interoperability.
24. Employer network expansion.
25. Advanced outcome prediction.

**Do not let Phase C or D delay Phase A.** The Edge Box offline workflow is the strongest external-round evidence because it directly supports the Hardware category.

---

## 17. Evidence Package for External Evaluation

The GitHub repository should contain:

```text
sahakarsetu/
├── README.md
├── docs/
│   ├── TECHNICAL_ARCHITECTURE.md
│   ├── REQUIREMENTS.md
│   ├── DATA_MODEL.md
│   ├── SECURITY_PRIVACY.md
│   ├── TEST_PLAN.md
│   ├── API.md
│   └── DEMO_SCRIPT.md
├── architecture/
│   ├── system-architecture.png
│   └── system-architecture.mmd
├── edge-box/
│   ├── setup/
│   ├── local-api/
│   ├── sync-service/
│   └── README.md
├── cloud/
│   ├── backend/
│   └── database/
├── web/
│   └── learner-pwa/
├── mobile/
│   └── flutter/
├── ai/
│   ├── rag/
│   └── attendance/
├── sample-data/
│   └── synthetic/
├── screenshots/
├── demo/
│   └── external-demo.mp4
└── LICENSE
```

### Evidence artifacts

The strongest evidence files are:

- 30-90 second offline demo video.
- Edge Box photos.
- Architecture diagram.
- Hardware BOM.
- Offline-to-online sync log screenshot.
- Credential verification screenshot.
- API documentation.
- Test report.
- Synthetic sample dataset.
- Git commit/release history showing implementation progress.

---

## 18. Test Plan

### Test 1 - Offline learning

**Given:** Edge Box connected to trainee device; internet disabled.  
**When:** learner opens and completes cached lesson.  
**Expected:** content loads and progress event is stored locally.

### Test 2 - Offline attendance

**Given:** internet disabled.  
**When:** trainee scans rotating QR.  
**Expected:** attendance event is recorded locally.

### Test 3 - Sync recovery

**Given:** 5 queued offline events.  
**When:** internet returns.  
**Expected:** all valid events reach cloud exactly once.

### Test 4 - Duplicate event

**Given:** same event sent twice.  
**Expected:** server remains idempotent; only one business record exists.

### Test 5 - Credential verification

**Given:** valid signed credential.  
**When:** QR is scanned.  
**Expected:** credential displays as valid.

### Test 6 - Tampered credential

**Given:** modified credential payload.  
**Expected:** verification fails.

### Test 7 - AI grounding

**Given:** question about an available course/job.  
**Expected:** response comes from approved knowledge sources.

---

## 19. Pilot KPIs

These are **proposed pilot targets**, not claims of current performance until measured:

- Offline learner workflow remains usable with internet disconnected.
- Successful synchronization of queued events after reconnection.
- Duplicate-event rate = 0 in controlled sync testing.
- Credential verification produces deterministic valid/invalid outcomes.
- Course completion and assessment records reconcile between Edge Box and cloud.
- Attendance fallback remains available when face recognition is not usable.
- AI assistant refuses/flags unsupported questions instead of fabricating information.

For biometric testing, publish measured false-acceptance and false-rejection results rather than a generic “high accuracy” claim.

---

## 20. Deployment Roadmap

### P1 - Pilot foundation

**0-3 months**  
Edge Box + cloud core + offline learning + QR attendance + basic ERP at a small pilot set.

### P2 - NCCT scale-out

**3-9 months**  
Expand to the broader NCCT institute network after pilot validation.

### P3 - Outreach

**9-18 months**  
Extend offline learning and partner-facing workflows for PACS, dairy, SHG and rural outreach contexts subject to programme design.

### P4 - Employment ecosystem

**18+ months**  
Employer network, outcome analytics, entrepreneurship links, and approved government interoperability.

The existing PPT's phased rollout should be retained, but each phase should be tied to concrete deliverables and evidence.

---

## 21. Key Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Internet outages | Edge Box + local content + sync queue |
| Power outages | UPS / power backup; optional solar-ready design |
| Low digital literacy | Local-language UI + trainer-assisted onboarding |
| Face recognition/privacy concerns | Consent + minimal storage + QR fallback |
| Duplicate sync | Idempotent event IDs |
| Stale content | Version/checksum-controlled content cache |
| Staff resistance | Bulk import + phased rollout + training |
| Hardware maintenance | Remote health monitoring + replaceable components |
| Insufficient ML training data | Start with rules/semantic matching; train models after data accrual |
| Unauthorized government integration claims | Mark integrations as proposed until approved/tested |

---

## 22. What the External Evaluator Should Be Able to Verify

At the end of the demonstration, an evaluator should be able to answer “yes” to these questions:

1. Can a trainee access learning without internet through the Edge Box?
2. Can the system record an attendance/assessment event offline?
3. Does the event synchronize after reconnection?
4. Is duplicate synchronization prevented?
5. Can a generated credential be verified independently?
6. Can an admin observe the synchronized learner record?
7. Is there a clear data flow from training to skills to employment?
8. Are AI components grounded in actual data/knowledge sources?
9. Are government integrations presented honestly as implemented or proposed?
10. Is the hardware cost and maintenance model understandable?

---

## 23. Recommended External Demo Narrative

Use one trainee story rather than showing isolated screens.

> “A trainee is nominated and receives a Sahakar ID. At the institute, the trainee connects to the Sahakar Edge Box over local Wi-Fi. We now disconnect the internet. The trainee still opens a cached course, completes a quiz and records attendance. These events are queued locally. When connectivity returns, the Edge Box synchronizes them with the cloud. The trainee receives a digitally verifiable Skill Passport, and the employment module maps the acquired skills to relevant roles. The same records then contribute to programme-level analytics.”

The most important moment is the **internet-disconnect test**.

---

## 24. Claims Policy for the PPT and Demo

Use three labels consistently:

**WORKING** - demonstrated in the repository/video.  
**PROTOTYPE** - implemented as a technical proof-of-concept.  
**PROPOSED** - depends on future deployment, scale, data, authorization, or integration access.

Avoid absolute phrases such as:

- “fraud-proof”
- “zero paperwork”
- “100% accurate”
- “DPDP compliant” for the prototype
- “DigiLocker integrated” without a real integration
- “NCD integrated” without approved API/data access
- “AI predicts placement” without validated training data

Prefer evidence-based wording such as:

- “fraud-resistant controls”
- “reduced manual paperwork”
- “measured accuracy under pilot testing”
- “privacy-by-design aligned”
- “DigiLocker-ready / proposed integration”
- “NCD interoperability planned”
- “skill/job matching baseline; ML training after labelled data accrual”

---

## 25. Sources and Reference Notes

### Problem-source baseline

The problem statement details and the current solution framing are based on the team's submitted SIH deck and the provided PS description.

### Government / domain references checked for this annexure

1. **Ministry of Cooperation - NCCT**: NCCT description, role, and 20 constituent institutes.  
   https://www.cooperation.gov.in/en/ncct

2. **Ministry of Cooperation - Annual Report 2023-24**: NCCT conducted 3,619 training programmes and trained 2,21,478 participants during April 2023-March 2024.  
   https://www.cooperation.gov.in/sites/default/files/2025-03/Annual%20Report%202023-24_English.pdf

3. **Ministry of Cooperation - National Cooperative Database**: national cooperative data platform and interoperability direction.  
   https://www.cooperation.gov.in/en/national-cooperative-database

4. **Ministry of Cooperation - Annual Report 2024-25**: reports around 8.3 lakh primary cooperative societies in the NCD and more than 32 crore members as of March 2025.  
   https://cooperation.gov.in/sites/default/files/2026-03/511_Annual%20Report%202024-25%20%28Final%29.pdf

5. **Smart India Hackathon official guidance**: use official SIH instructions for submission/process requirements; a publicly posted 2024 guideline is used as a reference for evaluation-oriented preparation because a 2026 public scoring sheet was not located during this review.  
   https://www.sih.gov.in/letters/Guidelines-College-SPOC.pdf

---

## 26. Current Deck Mapping

The current submitted PPT already contains the following concepts and this report expands them for technical review:

- Sahakar ID and unified learner lifecycle.
- Cloud ERP + offline Sahakar Edge Box.
- Multilingual learning.
- QR/face attendance.
- QR Skill Passport.
- Skill Graph.
- Outcome loop.
- React/Flutter, Django/PostgreSQL/Moodle, AI pipeline, Pi 5 Edge Box, security.
- Risks, phased rollout, and impact categories.

This annexure is therefore intended as a **technical expansion of the presentation**, not a replacement for the 6-slide submission deck.

---

## 27. External Evaluation Checklist

Before submission/demo:

- [ ] Actual Team ID entered in PPT.
- [ ] GitHub repository public and opens without authentication barriers.
- [ ] README explains one-minute project story.
- [ ] Architecture PNG is visible in README.
- [ ] Edge Box boots reliably.
- [ ] Local Wi-Fi works.
- [ ] Offline lesson works.
- [ ] Offline attendance works.
- [ ] Offline assessment works.
- [ ] Sync after reconnect works.
- [ ] Duplicate sync test documented.
- [ ] Skill Passport verification works.
- [ ] Synthetic demo dataset included.
- [ ] Demo video uploaded.
- [ ] Hardware BOM documented.
- [ ] Working/prototype/proposed labels used consistently.
- [ ] Unsupported claims removed from PPT.
- [ ] External-facing technical approach slide contains the GitHub report link.

---

**Document status:** External-round technical annexure / implementation guide.  
**Prototype data status:** Synthetic/anonymized until authorized institutional data is available.  
**Integration status:** Government and institutional integrations are proposed unless explicitly demonstrated and authorized.
