from django.core.management.base import BaseCommand
from api.models import Institute, Skill, Programme, Trainee, Job, Certificate

class Command(BaseCommand):
    help = 'Seeds the database with synthetic demo data for SIH 2026 Prototype'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        Certificate.objects.all().delete()
        Job.objects.all().delete()
        Trainee.objects.all().delete()
        Programme.objects.all().delete()
        Skill.objects.all().delete()
        Institute.objects.all().delete()

        self.stdout.write('Seeding Institutes...')
        inst1 = Institute.objects.create(id='INST001', name='VAMNICOM, Pune', type='National', state='Maharashtra')
        inst2 = Institute.objects.create(id='INST002', name='RICM, Chandigarh', type='Regional', state='Punjab')
        inst3 = Institute.objects.create(id='INST003', name='ICM, Bhopal', type='State', state='Madhya Pradesh')

        self.stdout.write('Seeding Skills...')
        sk1 = Skill.objects.create(id='SK001', name='Cooperative Accounting', category='Finance')
        sk2 = Skill.objects.create(id='SK002', name='Tally ERP', category='Technology')
        sk3 = Skill.objects.create(id='SK003', name='PACS Operations', category='Business')
        sk4 = Skill.objects.create(id='SK004', name='Dairy Cooperative Management', category='Business')

        self.stdout.write('Seeding Programmes...')
        prog1 = Programme.objects.create(
            id='PROG001', title='Management Development Programme for PACS', institute=inst1,
            start_date='2026-11-01', end_date='2026-11-15', capacity=40, enrolled=35, mode='Blended', language='Hindi/English'
        )
        prog2 = Programme.objects.create(
            id='PROG002', title='Digital Bookkeeping & Accounting', institute=inst2,
            start_date='2026-10-15', end_date='2026-10-30', capacity=30, enrolled=30, mode='Offline', language='Punjabi/English'
        )

        self.stdout.write('Seeding Trainees...')
        t1 = Trainee.objects.create(
            id='SAH-2026-000001', name='Arjun Kumar Verma', gender='M', category='General', state='Maharashtra', 
            district='Pune', cooperative='Pune District Central Cooperative Bank', institute=inst1, programme=prog1,
            attendance_pct=88, assessment_score=92, email='arjun.demo@example.com', phone='9876543210', employed=True
        )
        t1.skills.set([sk1, sk3])

        t2 = Trainee.objects.create(
            id='SAH-2026-000002', name='Priya Sharma', gender='F', category='OBC', state='Punjab', 
            district='Ludhiana', cooperative='Ludhiana Dairy Coop', institute=inst2, programme=prog2,
            attendance_pct=100, assessment_score=85, email='priya.demo@example.com', phone='9876543211', employed=False
        )
        t2.skills.set([sk2])

        self.stdout.write('Seeding Certificates...')
        Certificate.objects.create(
            id='CERT-2026-001847', trainee=t1, programme=prog1, issued_date='2026-08-15', grade='A+'
        )
        Certificate.objects.create(
            id='CERT-2026-001848', trainee=t2, programme=prog2, issued_date='2026-09-10', grade='A'
        )

        self.stdout.write('Seeding Jobs...')
        j1 = Job.objects.create(
            id='JOB001', title='PACS Accounts Assistant', employer_id='EMP001', employer_name='Maharashtra State Cooperative Bank',
            location='Pune', salary='₹2.5L - ₹3.5L', applicants=45
        )
        j1.skills_required.set([sk1, sk2, sk3])

        j2 = Job.objects.create(
            id='JOB002', title='Dairy Plant Supervisor', employer_id='EMP002', employer_name='Punjab State Coop Milk Federation',
            location='Chandigarh', salary='₹3L - ₹4L', applicants=12
        )
        j2.skills_required.set([sk4])

        self.stdout.write(self.style.SUCCESS('Successfully seeded synthetic database!'))
