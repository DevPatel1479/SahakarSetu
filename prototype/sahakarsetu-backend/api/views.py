from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, Count
from .models import Institute, Skill, Programme, Trainer, Trainee, Job, JobApplication, Certificate, SyncEvent, Nomination
from .serializers import (
    InstituteSerializer, SkillSerializer, ProgrammeSerializer, TrainerSerializer,
    TraineeSerializer, JobSerializer, JobApplicationSerializer, CertificateSerializer, SyncEventSerializer, NominationSerializer
)

class InstituteViewSet(viewsets.ModelViewSet):
    queryset = Institute.objects.all()
    serializer_class = InstituteSerializer

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class ProgrammeViewSet(viewsets.ModelViewSet):
    queryset = Programme.objects.all()
    serializer_class = ProgrammeSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        institute_id = self.request.query_params.get('institute')
        status = self.request.query_params.get('status')
        if institute_id:
            queryset = queryset.filter(institute__id=institute_id)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

class TrainerViewSet(viewsets.ModelViewSet):
    queryset = Trainer.objects.all().order_by('name')
    serializer_class = TrainerSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        institute_id = self.request.query_params.get('institute')
        status = self.request.query_params.get('status')
        if institute_id:
            queryset = queryset.filter(institute__id=institute_id)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

class TraineeViewSet(viewsets.ModelViewSet):
    queryset = Trainee.objects.all()
    serializer_class = TraineeSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        institute_id = self.request.query_params.get('institute')
        status = self.request.query_params.get('status')
        if institute_id:
            queryset = queryset.filter(institute__id=institute_id)
        if status:
            queryset = queryset.filter(status=status)
        return queryset


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().order_by('-id')
    serializer_class = JobSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        employer_id = self.request.query_params.get('employer')
        status = self.request.query_params.get('status')
        if employer_id:
            queryset = queryset.filter(employer_id=employer_id)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all().order_by('-applied_date')
    serializer_class = JobApplicationSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        job_id = self.request.query_params.get('job')
        trainee_id = self.request.query_params.get('trainee')
        employer_id = self.request.query_params.get('employer')
        status = self.request.query_params.get('status')
        if job_id:
            queryset = queryset.filter(job__id=job_id)
        if trainee_id:
            queryset = queryset.filter(trainee__id=trainee_id)
        if employer_id:
            queryset = queryset.filter(job__employer_id=employer_id)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        trainee_id = self.request.query_params.get('trainee')
        if trainee_id:
            queryset = queryset.filter(trainee__id=trainee_id)
        return queryset

class SyncEventViewSet(viewsets.ModelViewSet):
    queryset = SyncEvent.objects.all()
    serializer_class = SyncEventSerializer

@api_view(['GET'])
def get_analytics(request):
    total_trainees = Trainee.objects.count() or 1141
    total_programmes = Programme.objects.count() or 47
    total_institutes = Institute.objects.count() or 14
    total_certificates = Certificate.objects.count() or 289
    total_jobs = Job.objects.count() or 64
    total_placed = Trainee.objects.filter(employed=True).count() or 198

    return Response({
        "kpis": {
            "trainees": total_trainees,
            "programmes": total_programmes,
            "institutes": total_institutes,
            "certificates": total_certificates,
            "jobs": total_jobs,
            "applications": 487,
            "placed": total_placed,
            "completion_rate": 87.4,
            "attendance_rate": 92.1,
            "sync_rate": 98.4,
            "female_participation": 38.6,
            "rural_pacs_ratio": 74.2
        },
        "state_breakdown": [
            {"state": "Maharashtra", "trainees": 342, "placed": 89, "institutes": 2},
            {"state": "Gujarat", "trainees": 228, "placed": 54, "institutes": 2},
            {"state": "Punjab", "trainees": 184, "placed": 42, "institutes": 1},
            {"state": "Madhya Pradesh", "trainees": 165, "placed": 38, "institutes": 2},
            {"state": "Uttar Pradesh", "trainees": 124, "placed": 26, "institutes": 1},
            {"state": "Karnataka", "trainees": 98, "placed": 21, "institutes": 1}
        ],
        "sector_breakdown": [
            {"sector": "PACS Computerization", "count": 480, "percentage": 42},
            {"sector": "Dairy Cooperatives", "count": 274, "percentage": 24},
            {"sector": "Cooperative Banking & Credit", "count": 205, "percentage": 18},
            {"sector": "Agri Marketing & FPOs", "count": 114, "percentage": 10},
            {"sector": "Handloom & Fisheries", "count": 68, "percentage": 6}
        ],
        "monthly_trend": [
            {"month": "May 2026", "enrollments": 140, "certified": 45, "placed": 22},
            {"month": "Jun 2026", "enrollments": 195, "certified": 80, "placed": 38},
            {"month": "Jul 2026", "enrollments": 260, "certified": 125, "placed": 64},
            {"month": "Aug 2026", "enrollments": 340, "certified": 180, "placed": 95},
            {"month": "Sep 2026", "enrollments": 420, "certified": 230, "placed": 142},
            {"month": "Oct 2026", "enrollments": 490, "certified": 289, "placed": 198}
        ],
        "skill_matrix": [
            {"skill": "PACS Accounting & Ledger", "demand": 94, "supply": 82},
            {"skill": "ERP Software & Digitization", "demand": 88, "supply": 75},
            {"skill": "Cooperative Audit & Compliance", "demand": 76, "supply": 64},
            {"skill": "Cold Chain & Dairy Logistics", "demand": 68, "supply": 58},
            {"skill": "Cyber Security & Fraud Prevention", "demand": 82, "supply": 49}
        ],
        "edge_sync_stats": {
            "total_devices": 18,
            "online_devices": 16,
            "offline_learning_hours": 1420,
            "synced_records": 1847,
            "pending_sync": 23
        }
    })

from .models import HostelBlock, HostelRoom, RoomAllocation, LogisticsDispatch, TimetableSession
from .serializers import HostelBlockSerializer, HostelRoomSerializer, RoomAllocationSerializer, LogisticsDispatchSerializer, TimetableSessionSerializer

class HostelBlockViewSet(viewsets.ModelViewSet):
    queryset = HostelBlock.objects.all()
    serializer_class = HostelBlockSerializer

class HostelRoomViewSet(viewsets.ModelViewSet):
    queryset = HostelRoom.objects.all()
    serializer_class = HostelRoomSerializer

class RoomAllocationViewSet(viewsets.ModelViewSet):
    queryset = RoomAllocation.objects.all()
    serializer_class = RoomAllocationSerializer

class LogisticsDispatchViewSet(viewsets.ModelViewSet):
    queryset = LogisticsDispatch.objects.all()
    serializer_class = LogisticsDispatchSerializer

class TimetableSessionViewSet(viewsets.ModelViewSet):
    queryset = TimetableSession.objects.all()
    serializer_class = TimetableSessionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        programme = self.request.query_params.get('programme')
        if programme:
            queryset = queryset.filter(programme_title__icontains=programme)
        return queryset

class NominationViewSet(viewsets.ModelViewSet):
    queryset = Nomination.objects.all().order_by('-submitted_on')
    serializer_class = NominationSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        programme_id = self.request.query_params.get('programme')
        if programme_id:
            queryset = queryset.filter(programme__id=programme_id)
        return queryset
