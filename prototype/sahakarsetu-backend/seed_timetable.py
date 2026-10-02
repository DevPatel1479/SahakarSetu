import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import TimetableSession

sessions = [
    {
        "date": "2026-10-02",
        "start_time": "09:30",
        "end_time": "11:00",
        "time": "09:30 AM - 11:00 AM",
        "subject": "Cooperative Governance & Multi-State Cooperative Societies Act",
        "programme_title": "Diploma in Cooperative Business Management (DCBM)",
        "trainer": "Dr. Aniruddha Sharma (Senior Faculty, VAMNICOM)",
        "room": "Lecture Hall 101, Main Academic Block",
        "venue_type": "Lecture Hall"
    },
    {
        "date": "2026-10-02",
        "start_time": "11:30",
        "end_time": "01:00",
        "time": "11:30 AM - 01:00 PM",
        "subject": "PACS Computerization & ERP Software Hands-on Lab",
        "programme_title": "Certificate in PACS Digitization & Accounting",
        "trainer": "Prof. Rekha Pillai (IT & Systems Specialist)",
        "room": "Computer Lab B - Terminal 14-40",
        "venue_type": "Computer Lab"
    },
    {
        "date": "2026-10-02",
        "start_time": "02:00",
        "end_time": "03:30",
        "time": "02:00 PM - 03:30 PM",
        "subject": "Statutory Audit & Financial Reporting for Cooperative Banks",
        "programme_title": "Executive Program in Cooperative Banking & Risk",
        "trainer": "CA M. K. Deshpande (Visiting Expert)",
        "room": "Seminar Hall 2, VAMNICOM",
        "venue_type": "Seminar Hall"
    },
    {
        "date": "2026-10-03",
        "start_time": "10:00",
        "end_time": "11:30",
        "time": "10:00 AM - 11:30 AM",
        "subject": "Supply Chain & Cold Chain Management for Dairy Cooperatives",
        "programme_title": "Dairy Cooperative Management & Cold Storage Operations",
        "trainer": "Dr. Sunita Kurien (Agri-Business Faculty)",
        "room": "Auditorium Annex",
        "venue_type": "Lecture Hall"
    }
]

for s in sessions:
    TimetableSession.objects.get_or_create(
        subject=s["subject"],
        date=s["date"],
        defaults=s
    )

print("Timetable sessions seeded successfully!")
