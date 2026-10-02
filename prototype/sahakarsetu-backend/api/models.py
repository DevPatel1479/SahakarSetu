from django.db import models
import uuid

class Institute(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=50)
    state = models.CharField(max_length=100)

class Skill(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50)

class Programme(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    title = models.CharField(max_length=200)
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    capacity = models.IntegerField()
    enrolled = models.IntegerField(default=0)
    status = models.CharField(max_length=50, default='active')
    mode = models.CharField(max_length=50)
    language = models.CharField(max_length=50)

class Trainer(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=200)
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='trainers')
    designation = models.CharField(max_length=150)
    department = models.CharField(max_length=100, default='Cooperative Management')
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    specialization = models.CharField(max_length=200)
    experience_years = models.IntegerField(default=8)
    status = models.CharField(max_length=50, default='active')
    avatar = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.designation}) - {self.institute.name}"


class Trainee(models.Model):
    id = models.CharField(max_length=50, primary_key=True) # SAH-2026-XXXXXX
    name = models.CharField(max_length=200)
    gender = models.CharField(max_length=10)
    category = models.CharField(max_length=50)
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    cooperative = models.CharField(max_length=200)
    institute = models.ForeignKey(Institute, on_delete=models.SET_NULL, null=True)
    programme = models.ForeignKey(Programme, on_delete=models.SET_NULL, null=True)
    attendance_pct = models.IntegerField(default=0)
    assessment_score = models.IntegerField(default=0)
    status = models.CharField(max_length=50, default='active')
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    employed = models.BooleanField(default=False)
    skills = models.ManyToManyField(Skill, blank=True)

class Job(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    title = models.CharField(max_length=200)
    employer_id = models.CharField(max_length=50)
    employer_name = models.CharField(max_length=200)
    location = models.CharField(max_length=100)
    salary = models.CharField(max_length=50)
    applicants = models.IntegerField(default=0)
    status = models.CharField(max_length=50, default='open')
    skills_required = models.ManyToManyField(Skill, blank=True)

class JobApplication(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='job_applications')
    trainee = models.ForeignKey(Trainee, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=50, default='applied') # applied, shortlisted, interview, selected, joined, rejected
    match_score = models.IntegerField(default=85)
    applied_date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.trainee.name} -> {self.job.title} ({self.status})"

class Certificate(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    trainee = models.ForeignKey(Trainee, on_delete=models.CASCADE)
    programme = models.ForeignKey(Programme, on_delete=models.CASCADE)
    issued_date = models.DateField()
    grade = models.CharField(max_length=10)
    document_url = models.URLField(blank=True, null=True)

class SyncEvent(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    edge_device_id = models.CharField(max_length=100)
    event_type = models.CharField(max_length=50) # 'attendance', 'assessment', etc.
    payload = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')

class HostelBlock(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE)
    capacity = models.IntegerField(default=100)
    occupied = models.IntegerField(default=0)

class HostelRoom(models.Model):
    block = models.ForeignKey(HostelBlock, on_delete=models.CASCADE, related_name='rooms')
    room_number = models.CharField(max_length=20)
    capacity = models.IntegerField(default=2)
    occupied = models.IntegerField(default=0)

    class Meta:
        unique_together = ('block', 'room_number')

class RoomAllocation(models.Model):
    trainee = models.ForeignKey(Trainee, on_delete=models.CASCADE)
    room = models.ForeignKey(HostelRoom, on_delete=models.CASCADE)
    allocated_on = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, default='active')

class LogisticsDispatch(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    item = models.CharField(max_length=200)
    destination = models.CharField(max_length=200)
    status = models.CharField(max_length=50, default='Processing')
    eta = models.CharField(max_length=100)
    lat = models.FloatField(default=20.5937)
    lng = models.FloatField(default=78.9629)

class TimetableSession(models.Model):
    date = models.DateField(null=True, blank=True)
    start_time = models.CharField(max_length=20, default='09:00')
    end_time = models.CharField(max_length=20, default='10:30')
    time = models.CharField(max_length=50, blank=True) # e.g. "09:00 AM - 10:30 AM"
    subject = models.CharField(max_length=200)
    programme_title = models.CharField(max_length=200, default='Cooperative Management')
    trainer = models.CharField(max_length=100)
    room = models.CharField(max_length=50)
    venue_type = models.CharField(max_length=50, default='Lecture Hall')
class Nomination(models.Model):
    id = models.CharField(max_length=50, primary_key=True) # NOM-2026-XXXXXX
    programme = models.ForeignKey(Programme, on_delete=models.CASCADE, related_name='nominations')
    nominee_name = models.CharField(max_length=200)
    nominee_email = models.EmailField()
    nominee_phone = models.CharField(max_length=20)
    nominator_organization = models.CharField(max_length=200)
    nominator_name = models.CharField(max_length=200)
    nominator_designation = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default='pending') # pending, approved, rejected
    submitted_on = models.DateField(auto_now_add=True)
    comments = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.nominee_name} nominated by {self.nominator_organization}"
