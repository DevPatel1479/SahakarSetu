import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Institute, HostelBlock, HostelRoom, Trainee

inst = Institute.objects.first()
if inst:
    block, created = HostelBlock.objects.get_or_create(id='BLK-A', defaults={'name': 'Sahakar Bhavan', 'institute': inst, 'capacity': 50})
    HostelRoom.objects.get_or_create(block=block, room_number='A-101', defaults={'capacity': 2})
    HostelRoom.objects.get_or_create(block=block, room_number='A-102', defaults={'capacity': 2})

    block2, created = HostelBlock.objects.get_or_create(id='BLK-B', defaults={'name': 'Nivedita Bhavan', 'institute': inst, 'capacity': 40})
    HostelRoom.objects.get_or_create(block=block2, room_number='B-101', defaults={'capacity': 2})

    Trainee.objects.get_or_create(id='SAH-2026-999999', defaults={
        'name': 'Test Trainee', 'gender': 'M', 'email': 'test@example.com', 'phone': '99999', 'cooperative': 'Test Coop', 'district': 'Pune', 'state': 'MH', 'category': 'General'
    })
print("Seeded successfully!")
