from rest_framework import serializers
from .models import Institute, Skill, Programme, Trainer, Trainee, Job, JobApplication, Certificate, SyncEvent, Nomination

class InstituteSerializer(serializers.ModelSerializer):
    active_programmes = serializers.SerializerMethodField()
    trainee_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Institute
        fields = '__all__'

    def get_active_programmes(self, obj):
        return list(Programme.objects.filter(institute=obj, status='active').values_list('title', flat=True))
        
    def get_trainee_count(self, obj):
        return Trainee.objects.filter(institute=obj).count()

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class ProgrammeSerializer(serializers.ModelSerializer):
    institute_name = serializers.CharField(source='institute.name', read_only=True)
    cutoff_score = serializers.SerializerMethodField()

    class Meta:
        model = Programme
        fields = '__all__'

    def get_cutoff_score(self, obj):
        title = obj.title.lower()
        if 'pacs' in title:
            return 75
        elif 'bookkeeping' in title or 'accounting' in title:
            return 70
        elif 'diary' in title or 'dairy' in title:
            return 65
        return 75

class TrainerSerializer(serializers.ModelSerializer):
    institute_name = serializers.CharField(source='institute.name', read_only=True)

    class Meta:
        model = Trainer
        fields = '__all__'


class TraineeSerializer(serializers.ModelSerializer):
    skills = serializers.SlugRelatedField(many=True, slug_field='id', queryset=Skill.objects.all(), required=False)
    
    class Meta:
        model = Trainee
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    skills_required = serializers.SlugRelatedField(many=True, slug_field='id', queryset=Skill.objects.all(), required=False)
    skills_list = serializers.SerializerMethodField()
    application_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = '__all__'

    def get_skills_list(self, obj):
        return [s.name for s in obj.skills_required.all()]

    def get_application_count(self, obj):
        return obj.job_applications.count()

class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    employer_name = serializers.CharField(source='job.employer_name', read_only=True)
    job_location = serializers.CharField(source='job.location', read_only=True)
    job_salary = serializers.CharField(source='job.salary', read_only=True)
    trainee_name = serializers.CharField(source='trainee.name', read_only=True)
    trainee_sahakar_id = serializers.CharField(source='trainee.id', read_only=True)
    trainee_phone = serializers.CharField(source='trainee.phone', read_only=True)
    trainee_email = serializers.CharField(source='trainee.email', read_only=True)
    trainee_institute = serializers.CharField(source='trainee.institute.name', read_only=True)
    trainee_skills = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication
        fields = '__all__'

    def get_trainee_skills(self, obj):
        return [s.name for s in obj.trainee.skills.all()]

class CertificateSerializer(serializers.ModelSerializer):
    trainee_name = serializers.CharField(source='trainee.name', read_only=True)
    institute = serializers.CharField(source='programme.institute.name', read_only=True)
    programme_name = serializers.CharField(source='programme.title', read_only=True)
    skills = serializers.SerializerMethodField()

    class Meta:
        model = Certificate
        fields = '__all__'

    def get_skills(self, obj):
        return [skill.id for skill in obj.trainee.skills.all()]

class SyncEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyncEvent
        fields = '__all__'

from .models import HostelBlock, HostelRoom, RoomAllocation, LogisticsDispatch, TimetableSession

class HostelBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = HostelBlock
        fields = '__all__'

class HostelRoomSerializer(serializers.ModelSerializer):
    block_name = serializers.CharField(source='block.name', read_only=True)
    class Meta:
        model = HostelRoom
        fields = '__all__'

class RoomAllocationSerializer(serializers.ModelSerializer):
    trainee_name = serializers.CharField(source='trainee.name', read_only=True)
    trainee_id = serializers.CharField(source='trainee.id', read_only=True)
    room_number = serializers.CharField(source='room.room_number', read_only=True)
    block_name = serializers.CharField(source='room.block.name', read_only=True)
    class Meta:
        model = RoomAllocation
        fields = '__all__'

class LogisticsDispatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogisticsDispatch
        fields = '__all__'

class TimetableSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimetableSession
        fields = '__all__'
class NominationSerializer(serializers.ModelSerializer):
    programme_title = serializers.CharField(source='programme.title', read_only=True)
    institute_name = serializers.CharField(source='programme.institute.name', read_only=True)

    class Meta:
        model = Nomination
        fields = '__all__'
