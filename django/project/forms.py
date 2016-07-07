from django.forms import ModelForm, fields, ValidationError, models
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.admin.widgets import AdminDateWidget

from hss.models import HSS
from hss.hss_data import hss_default
from toolkit.models import Toolkit
from toolkit.toolkit_data import toolkit_default
from user.models import Organisation
from country.models import Country
from .models import Project
from .project_data import project_structure


class ProjectInventoryForm(ModelForm):
    """
    Project form for bulk creation.
    """
    # "reports", "publications", and "coverage" removed for now to cut corners.
    # "other" fields are removed.
    # "owner" needs to be already registered.
    owner = fields.EmailField()
    name = fields.CharField()
    organisation = models.ModelChoiceField(queryset=Organisation.objects.all())
    contact_name = fields.CharField()
    contact_email = fields.EmailField()
    implementation_overview = fields.CharField(max_length=500)
    implementing_partners = fields.CharField(required=False)
    implementation_dates = fields.CharField()
    geographic_coverage = fields.CharField()
    intervention_areas = fields.MultipleChoiceField(choices={(x,x) for x in project_structure["intervention_areas"]})
    strategy = fields.MultipleChoiceField(required=False, choices={(x,x) for x in project_structure["strategies"]})
    country = models.ModelChoiceField(queryset=Country.objects.all())
    objective = fields.CharField(required=False, max_length=250)
    technology_platforms = fields.MultipleChoiceField(required=False, choices={(x,x) for x in project_structure["technology_platforms"]})
    licenses = fields.MultipleChoiceField(required=False, choices={(x,x) for x in project_structure["licenses"]})
    application = fields.MultipleChoiceField(required=False, choices={(x,x) for x in project_structure["applications"]})
    started = fields.DateField(widget=AdminDateWidget, required=False)
    donors = fields.CharField(required=False)
    pipeline = fields.MultipleChoiceField(required=False, choices={(x,x) for x in project_structure["pipelines"]})
    goals_to_scale = fields.CharField(required=False)
    anticipated_time = fields.CharField(required=False)
    repository = fields.URLField(required=False)
    mobile_application = fields.CharField(required=False)
    wiki = fields.URLField(required=False)

    class Meta:
        fields = (
                "owner",
                "name",
                "organisation",
                "contact_name",
                "contact_email",
                "implementation_overview",
                "implementing_partners",
                "implementation_dates",
                "geographic_coverage",
                "intervention_areas",
                "strategy",
                "country",
                "objective",
                "technology_platforms",
                "licenses",
                "application",
                "started",
                "donors",
                "pipeline",
                "goals_to_scale",
                "anticipated_time",
                "repository",
                "mobile_application",
                "wiki",
            )

    def save_m2m(self):
        # Needs to be here to trick out saving MultipleChoiceFields
        pass

    def save(self, force_insert=False, force_update=False, commit=True):
        try:
            user = User.objects.get(email=self.cleaned_data["owner"])
        except ObjectDoesNotExist:
            raise ValidationError("No such user: {}".format(self.cleaned_data["owner"]))
        else:
            self.cleaned_data["started"] = str(self.cleaned_data["started"])
            self.cleaned_data["organisation"] = int(self.cleaned_data["organisation"].id)
            self.cleaned_data["country"] = int(self.cleaned_data["country"].id)
            project = Project(name=self.cleaned_data["name"], data=self.cleaned_data)
            project.save()
            project.team.add(user.userprofile)
            # Add default HSS structure for the new project.
            HSS.objects.create(project_id=project.id, data=hss_default)
            # Add default Toolkit structure for the new project.
            Toolkit.objects.create(project_id=project.id, data=toolkit_default)
            return project
