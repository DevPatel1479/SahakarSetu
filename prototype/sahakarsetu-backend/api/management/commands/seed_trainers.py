from django.core.management.base import BaseCommand
from api.models import Institute, Trainer

class Command(BaseCommand):
    help = 'Seeds realistic NCCT faculty and trainer data'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding NCCT Faculty & Trainers...")

        # Ensure institutes exist
        vamnicom, _ = Institute.objects.get_or_create(
            id='INST001',
            defaults={'name': 'VAMNICOM, Pune', 'type': 'National', 'state': 'Maharashtra'}
        )
        ricm_chd, _ = Institute.objects.get_or_create(
            id='INST002',
            defaults={'name': 'RICM, Chandigarh', 'type': 'Regional', 'state': 'Punjab'}
        )
        icm_bhopal, _ = Institute.objects.get_or_create(
            id='INST003',
            defaults={'name': 'ICM, Bhopal', 'type': 'State', 'state': 'Madhya Pradesh'}
        )
        icm_gandhinagar, _ = Institute.objects.get_or_create(
            id='INST-757',
            defaults={'name': 'ICM, Gandhinagar', 'type': 'State', 'state': 'Gujarat'}
        )

        trainers_data = [
            {
                'id': 'TRN-001',
                'name': 'Dr. Sneha Patil',
                'institute': vamnicom,
                'designation': 'Professor & Head of Cooperative Banking',
                'department': 'Banking & Financial Governance',
                'email': 'sneha.patil@vamnicom.gov.in',
                'phone': '+91 98230 44120',
                'specialization': 'PACS Computerization, Cooperative Audit & RBI Compliance',
                'experience_years': 14,
                'status': 'active',
                'avatar': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
            },
            {
                'id': 'TRN-002',
                'name': 'Prof. Rajeshwar Kulkarni',
                'institute': vamnicom,
                'designation': 'Associate Professor of Dairy Tech & Agri ERP',
                'department': 'Agri-Business & Cold Chain',
                'email': 'rajeshwar.kulkarni@vamnicom.gov.in',
                'phone': '+91 94220 18563',
                'specialization': 'Dairy Cold Chain Logistics, Farmer Producer Organizations (FPOs)',
                'experience_years': 11,
                'status': 'active',
                'avatar': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
            },
            {
                'id': 'TRN-003',
                'name': 'Dr. Harpreet Singh Sodhi',
                'institute': ricm_chd,
                'designation': 'Senior Faculty - Cooperative Accounts',
                'department': 'Accounts & Financial Management',
                'email': 'h.sodhi@ricmchandigarh.nic.in',
                'phone': '+91 98141 55290',
                'specialization': 'Double-entry Bookkeeping, Tally ERP, PACS Balance Sheet Audit',
                'experience_years': 16,
                'status': 'active',
                'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            },
            {
                'id': 'TRN-004',
                'name': 'Smt. Ananya Sharma',
                'institute': ricm_chd,
                'designation': 'Assistant Professor of Cooperative Law',
                'department': 'Legal Framework & Statutory Compliance',
                'email': 'ananya.sharma@ricmchandigarh.nic.in',
                'phone': '+91 97802 33140',
                'specialization': 'Multi-State Cooperative Societies Act 2002, Bye-laws Amendment',
                'experience_years': 7,
                'status': 'active',
                'avatar': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
            },
            {
                'id': 'TRN-005',
                'name': 'Dr. Manoj Verma',
                'institute': icm_bhopal,
                'designation': 'Faculty Member - Rural Credit',
                'department': 'Rural Development & SHG Promotion',
                'email': 'manoj.verma@icmbhopal.nic.in',
                'phone': '+91 94250 88219',
                'specialization': 'Microfinance, SHG Federation Governance, NABARD Refinancing',
                'experience_years': 12,
                'status': 'active',
                'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
            },
            {
                'id': 'TRN-006',
                'name': 'Shri Bhavesh Patel',
                'institute': icm_gandhinagar,
                'designation': 'Technical Trainer - Digital Banking & IT',
                'department': 'Information Technology & Cyber Security',
                'email': 'bhavesh.patel@icmgandhinagar.org',
                'phone': '+91 98980 12764',
                'specialization': 'Core Banking Solutions (CBS), Cyber Security, Sahakar Edge Box Ops',
                'experience_years': 9,
                'status': 'active',
                'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
            }
        ]

        created_count = 0
        for td in trainers_data:
            trainer_id = td.pop('id')
            trainer, created = Trainer.objects.update_or_create(
                id=trainer_id,
                defaults=td
            )
            if created:
                created_count += 1
            self.stdout.write(f"  {'Created' if created else 'Updated'}: {trainer.name} ({trainer.designation})")

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {len(trainers_data)} NCCT Trainers/Faculty ({created_count} newly created)."))
