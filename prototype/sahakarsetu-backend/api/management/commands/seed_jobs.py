from django.core.management.base import BaseCommand
from api.models import Institute, Skill, Programme, Trainee, Job, JobApplication, Certificate

class Command(BaseCommand):
    help = 'Seeds realistic cooperative jobs, skills and candidate applications'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding enhanced cooperative jobs & applications...')

        # Ensure skills exist
        sk1, _ = Skill.objects.get_or_create(id='SK001', defaults={'name': 'PACS Accounting & Ledger', 'category': 'Finance'})
        sk2, _ = Skill.objects.get_or_create(id='SK002', defaults={'name': 'Tally ERP & Day Book', 'category': 'Technology'})
        sk3, _ = Skill.objects.get_or_create(id='SK003', defaults={'name': 'PACS Governance & Operations', 'category': 'Management'})
        sk4, _ = Skill.objects.get_or_create(id='SK004', defaults={'name': 'Dairy Cooperative Management', 'category': 'Agri-Business'})
        sk5, _ = Skill.objects.get_or_create(id='SK005', defaults={'name': 'Statutory Audit & NPA Provisioning', 'category': 'Audit'})
        sk6, _ = Skill.objects.get_or_create(id='SK006', defaults={'name': 'GST & Statutory Compliance', 'category': 'Finance'})
        sk7, _ = Skill.objects.get_or_create(id='SK007', defaults={'name': 'Cold Storage & Inventory Management', 'category': 'Agri-Business'})
        sk8, _ = Skill.objects.get_or_create(id='SK008', defaults={'name': 'Core Banking Software (CBS)', 'category': 'Technology'})

        # Seed Jobs
        jobs_data = [
            {
                'id': 'JOB-901',
                'title': 'Cooperative Accounts Assistant',
                'employer_id': 'EMP-GUJ-01',
                'employer_name': 'Gujarat Ambuja Co-op Society',
                'location': 'Ahmedabad, Gujarat',
                'salary': '₹25,000 - ₹35,000 / month',
                'applicants': 4,
                'status': 'open',
                'skills': [sk1, sk2, sk6]
            },
            {
                'id': 'JOB-902',
                'title': 'Primary Society Auditor',
                'employer_id': 'EMP-MSCB-01',
                'employer_name': 'Maharashtra State Cooperative Bank',
                'location': 'Pune, Maharashtra',
                'salary': '₹30,000 - ₹45,000 / month',
                'applicants': 3,
                'status': 'open',
                'skills': [sk1, sk3, sk5]
            },
            {
                'id': 'JOB-903',
                'title': 'Dairy Logistics & Cold Chain Supervisor',
                'employer_id': 'EMP-VERKA-01',
                'employer_name': 'Punjab State Coop Milk Fed (VERKA)',
                'location': 'Chandigarh, Punjab',
                'salary': '₹28,000 - ₹38,000 / month',
                'applicants': 2,
                'status': 'open',
                'skills': [sk4, sk7]
            },
            {
                'id': 'JOB-904',
                'title': 'Agri-Credit Appraisal Officer',
                'employer_id': 'EMP-KRIBHCO-01',
                'employer_name': 'KRIBHCO Rural Federation',
                'location': 'Bhopal, Madhya Pradesh',
                'salary': '₹32,000 - ₹48,000 / month',
                'applicants': 2,
                'status': 'open',
                'skills': [sk1, sk3, sk8]
            },
            {
                'id': 'JOB-905',
                'title': 'PACS Secretary & Head Cashier',
                'employer_id': 'EMP-GUJ-01',
                'employer_name': 'Gujarat Ambuja Co-op Society',
                'location': 'Vadodara, Gujarat',
                'salary': '₹24,000 - ₹32,000 / month',
                'applicants': 1,
                'status': 'open',
                'skills': [sk1, sk2]
            }
        ]

        created_jobs = {}
        for jd in jobs_data:
            skills = jd.pop('skills')
            job, _ = Job.objects.update_or_create(id=jd['id'], defaults=jd)
            job.skills_required.set(skills)
            created_jobs[job.id] = job
            self.stdout.write(f"Job: {job.id} - {job.title}")

        # Get trainees
        trainees = list(Trainee.objects.all())
        if trainees:
            arjun = next((t for t in trainees if 'arjun' in t.name.lower() or t.id == 'SAH-2026-000001'), trainees[0])
            arjun.skills.set([sk1, sk2, sk3, sk5, sk6])
            
            apps_data = [
                {
                    'id': 'APP-2026-0001',
                    'job': created_jobs['JOB-901'],
                    'trainee': arjun,
                    'status': 'shortlisted',
                    'match_score': 96,
                    'notes': 'Candidate holds certified credentials CERT-2026-001847 & CERT-2026-001849 with 98% PACS Bookkeeping cutoff.'
                },
                {
                    'id': 'APP-2026-0002',
                    'job': created_jobs['JOB-902'],
                    'trainee': arjun,
                    'status': 'interview',
                    'match_score': 94,
                    'notes': 'Invited for Technical Interview with Chief Auditor on Oct 10.'
                }
            ]

            for i, t in enumerate(trainees[1:5], start=3):
                t.skills.set([sk1, sk4, sk7])
                target_job = created_jobs['JOB-901'] if i % 2 == 0 else created_jobs['JOB-903']
                apps_data.append({
                    'id': f'APP-2026-000{i}',
                    'job': target_job,
                    'trainee': t,
                    'status': 'applied' if i == 3 else 'selected',
                    'match_score': 82 + (i * 3),
                    'notes': 'Direct nomination from Institute Placement Cell.'
                })

            for ad in apps_data:
                app, _ = JobApplication.objects.update_or_create(id=ad['id'], defaults=ad)
                self.stdout.write(f"Application: {app.id} - {app.trainee.name} ({app.status})")

        self.stdout.write(self.style.SUCCESS('Successfully seeded cooperative jobs and applications!'))
