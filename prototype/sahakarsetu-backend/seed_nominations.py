import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Nomination, Programme

Programme.objects.get_or_create(id='PROG001', defaults={
    'title': 'Management Development Programme for PACS',
    'start_date': '2026-11-01',
    'end_date': '2026-11-15',
    'capacity': 40,
    'mode': 'Blended',
    'language': 'English',
    'institute_id': 'INST001'
})

prog1 = Programme.objects.first()

if prog1:
    Nomination.objects.create(
        id='NOM-2026-0001',
        programme=prog1,
        nominee_name='Rajesh Kumar',
        nominee_email='rajesh@example.com',
        nominee_phone='9876543210',
        nominator_organization='PACS Pune',
        nominator_name='Suresh Verma',
        nominator_designation='Secretary',
        status='pending'
    )
    Nomination.objects.create(
        id='NOM-2026-0002',
        programme=prog1,
        nominee_name='Anita Desai',
        nominee_email='anita@example.com',
        nominee_phone='9876543212',
        nominator_organization='Dairy Cooperative Mumbai',
        nominator_name='Ramesh Patil',
        nominator_designation='Chairman',
        status='approved'
    )
    print("Nominations seeded!")
else:
    print("No programmes found!")
