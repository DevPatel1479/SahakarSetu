# SahakarSetu External-Round Prototype Plan

## Build this first

### Stage 1 - Edge Box proof

- Raspberry Pi 5
- local Wi-Fi
- local web server
- React PWA
- SQLite
- sample learners/courses
- one offline course video

### Stage 2 - Offline events

- QR attendance
- assessment submission
- local event IDs
- sync status screen

### Stage 3 - Cloud sync

- Django API
- PostgreSQL
- event ingestion endpoint
- idempotency using event ID
- retry/backoff
- sync dashboard

### Stage 4 - Credential

- course completion
- certificate generation
- signed payload / integrity hash
- QR verification page

### Stage 5 - AI evidence

- RAG chatbot over synthetic course/job/scheme data
- multilingual text/voice demo
- optional face-recognition PoC
- deterministic skill-job matching baseline

## The live demo

1. Show connected mode.
2. Connect phone to Edge Box Wi-Fi.
3. Open learner PWA.
4. Play local course video.
5. Scan QR for attendance.
6. Complete quiz.
7. Disconnect internet.
8. Repeat one action and show local queue.
9. Reconnect internet.
10. Show successful sync in admin dashboard.
11. Generate/open Skill Passport.
12. Scan QR and verify certificate.
13. Ask RAG assistant one verified question.

## Evidence to record

- one continuous screen recording of offline test
- photo of physical Edge Box
- terminal/log screenshot of sync
- database rows before/after sync
- certificate verification screen
- GitHub commit history
