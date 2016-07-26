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
    owner = fields.EmailField(label="Owner of the project")
    name = fields.CharField(label="Name of the project")
    organisation = models.ModelChoiceField(queryset=Organisation.objects.all(), label="Name of the organization")
    contact_name = fields.CharField(label="Contact name")
    contact_email = fields.EmailField(label="Contact email")
    implementation_overview = fields.CharField(max_length=500, label="Overview of Digital health implementation")
    implementing_partners = fields.CharField(required=False, label="Implementing Partners")
    implementation_dates = fields.CharField(label="Implementing Dates")
    geographic_coverage = fields.CharField(label="Geographic coverage")
    intervention_areas = fields.MultipleChoiceField(choices={(x,x) for x in project_structure["intervention_areas"]}, label="Interventions Areas")
    strategy = fields.MultipleChoiceField(required=False, choices={(x,x) for x in project_structure["strategies"]}, label="Select strategies")
    country = models.ModelChoiceField(queryset=Country.objects.all(), label="Select project's country")
    technology_platforms = fields.MultipleChoiceField(required=False, choices={(x,x) for x in project_structure["technology_platforms"]}, label="Technology Platforms")
    licenses = fields.MultipleChoiceField(required=False, choices={(x,x) for x in project_structure["licenses"]}, label="Licenses")
    started = fields.DateField(widget=AdminDateWidget, required=False, label="Start date")
    donors = fields.CharField(required=False, label="Donors name")
    pipeline = fields.MultipleChoiceField(required=False, choices={(x,x) for x in project_structure["pipelines"]}, label="Accelerator or innovation pipeline")
    goals_to_scale = fields.CharField(required=False, label="Your goals")
    anticipated_time = fields.CharField(required=False, label="Your timeframe")
    repository = fields.URLField(required=False, label="Code documentation or download link")
    mobile_application = fields.CharField(required=False, label="Link to the application")
    wiki = fields.URLField(required=False, label="Link to wiki page")

    class Meta:
        fields = (
                "owner",
                "name",
                "organisation",
                "strategy",
                "country",
                "started",
                "pipeline",
                "donors",
                "goals_to_scale",
                "anticipated_time",
                "technology_platforms",
                "licenses",
                "repository",
                "mobile_application",
                "wiki",
                "contact_name",
                "contact_email",
                "implementation_overview",
                "implementing_partners",
                "implementation_dates",
                "geographic_coverage",
                "intervention_areas",
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
            #project.team.add(self.inventory_user.userprofile)
            # Add default HSS structure for the new project.
            HSS.objects.create(project_id=project.id, data=hss_default)
            # Add default Toolkit structure for the new project.
            Toolkit.objects.create(project_id=project.id, data=toolkit_default)
            return project
