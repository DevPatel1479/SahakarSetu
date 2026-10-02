from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    InstituteViewSet, SkillViewSet, ProgrammeViewSet, TrainerViewSet,
    TraineeViewSet, JobViewSet, JobApplicationViewSet, CertificateViewSet, SyncEventViewSet,
    HostelBlockViewSet, HostelRoomViewSet, RoomAllocationViewSet, 
    LogisticsDispatchViewSet, TimetableSessionViewSet, NominationViewSet,
    get_analytics
)

router = DefaultRouter()
router.register(r'institutes', InstituteViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'programmes', ProgrammeViewSet)
router.register(r'trainers', TrainerViewSet)
router.register(r'trainees', TraineeViewSet)
router.register(r'jobs', JobViewSet)
router.register(r'applications', JobApplicationViewSet)
router.register(r'certificates', CertificateViewSet)
router.register(r'sync-events', SyncEventViewSet)
router.register(r'hostel-blocks', HostelBlockViewSet)
router.register(r'hostel-rooms', HostelRoomViewSet)
router.register(r'room-allocations', RoomAllocationViewSet)
router.register(r'logistics', LogisticsDispatchViewSet)
router.register(r'timetables', TimetableSessionViewSet)
router.register(r'nominations', NominationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('analytics/', get_analytics, name='analytics'),
]
