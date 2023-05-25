from rest_framework import serializers
from kpiexport.models import AuditLogUsers, AuditLogTokens, AuditLogProjectStatus, AuditLogProjectStages, \
    AuditLogDataStandards, AuditLogHealthCategories, AuditLogHFA


class AuditLogUserBasicSerializer(serializers.ModelSerializer):
    date = serializers.CharField(read_only=True, max_length=10)
    country = serializers.PrimaryKeyRelatedField(read_only=True)
    registered = serializers.SerializerMethodField()
    active = serializers.SerializerMethodField()

    class Meta:
        model = AuditLogUsers
        fields = ("date", "country", "registered", "active")

    def get_registered(self, obj):
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return obj.data.get(donor)['total']['registered']
        return obj.registered

    def get_active(self, obj):
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return obj.data.get(donor)['total']['active']
        return obj.active


class AuditLogUserDetailedSerializer(AuditLogUserBasicSerializer):
    data = serializers.SerializerMethodField()

    class Meta:
        model = AuditLogUsers
        fields = ("date", "country", "data", "registered", "active")

    def get_data(self, obj):
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return obj.data.get(donor)
        return obj.data


class AuditLogTokenBasicSerializer(serializers.ModelSerializer):
    date = serializers.CharField(read_only=True, max_length=10)
    country = serializers.PrimaryKeyRelatedField(read_only=True)
    tokens = serializers.SerializerMethodField()

    class Meta:
        model = AuditLogTokens
        fields = ("date", "country", "tokens")

    def get_tokens(self, obj):
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return obj.data.get(donor)['total']
        return obj.tokens


class AuditLogTokenDetailedSerializer(AuditLogTokenBasicSerializer):
    data = serializers.SerializerMethodField()

    class Meta:
        model = AuditLogTokens
        fields = ("date", "country", "data", "tokens")

    def get_data(self, obj):
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return obj.data.get(donor)
        return obj.data


class AuditLogProjectStatusBasicSerializer(serializers.ModelSerializer):
    date = serializers.CharField(read_only=True, max_length=10)
    country = serializers.PrimaryKeyRelatedField(read_only=True)
    published = serializers.SerializerMethodField()
    unpublished = serializers.SerializerMethodField()
    archived = serializers.SerializerMethodField()
    ready_to_publish = serializers.SerializerMethodField()
    to_delete = serializers.SerializerMethodField()
    draft = serializers.SerializerMethodField()
    growth = serializers.SerializerMethodField()

    def get_published(self, obj):
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return len(obj.data[donor]['published']) if donor in obj.data else 0
        return len(obj.published)

    def get_unpublished(self, obj):
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return len(obj.data[donor]['unpublished']) if donor in obj.data else 0
        return len(obj.unpublished)

    def get_archived(self, obj):
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return len(obj.data[donor]['archived']) if donor in obj.data else 0
        return len(obj.archived)

    def get_ready_to_publish(self, obj):
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return len(obj.data[donor]['ready_to_publish']) if donor in obj.data else 0
        return len(obj.ready_to_publish)

    def get_to_delete(self, obj):
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return len(obj.data[donor]['to_delete']) if donor in obj.data else 0
        return len(obj.to_delete)

    def get_draft(self, obj):
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return len(obj.data[donor]['draft']) if donor in obj.data else 0
        return len(obj.draft)

    def get_growth(self, obj):
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return obj.data[donor]['growth'] if donor in obj.data else 0
        return obj.growth

    class Meta:
        model = AuditLogProjectStatus
        fields = ("date", "country", "published", "unpublished", "ready_to_publish", "to_delete", "draft", "growth")


class AuditLogProjectStatusDetailedSerializer(AuditLogProjectStatusBasicSerializer):
    data = serializers.SerializerMethodField()

    def get_data(self, obj):
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return {
                'published': len(obj.data[donor]['published']) if donor in obj.data else 0,
                'unpublished': len(obj.data[donor]['unpublished']) if donor in obj.data else 0,
                'ready_to_publish': len(obj.data[donor]['ready_to_publish']) if donor in obj.data else 0,
                'to_delete': len(obj.data[donor]['to_delete']) if donor in obj.data else 0,
                'draft': len(obj.data[donor]['draft']) if donor in obj.data else 0,
                'growth': obj.data[donor]['growth'] if donor in obj.data else 0
            }
        summary_dict = {}
        for donor_id in obj.data:
            summary_dict[donor_id] = {
                'published': len(obj.data[donor_id]['published']),
                'unpublished': len(obj.data[donor_id]['unpublished']),
                'ready_to_publish': len(obj.data[donor_id]['ready_to_publish']),
                'to_delete': len(obj.data[donor_id]['to_delete']),
                'draft': len(obj.data[donor_id]['draft']),
                'growth': obj.data[donor_id]['growth']
            }
        return summary_dict

    class Meta:
        model = AuditLogProjectStatus
        fields = ("date", "country", "data", "published", "unpublished", "ready_to_publish", "to_delete",
                  "draft", "growth")


class AuditLogProjectStagesBasicSerializer(serializers.ModelSerializer):
    date = serializers.CharField(read_only=True, max_length=10)
    country = serializers.PrimaryKeyRelatedField(read_only=True)
    stages = serializers.SerializerMethodField()

    def get_stages(self, obj):
        donor = self.context['request'].query_params.get('investor')
        stages_dict = obj.stages
        if donor:
            stages_dict = obj.data.get(donor, {})
        return {stage: len(val) for stage, val in stages_dict.items()}

    class Meta:
        model = AuditLogProjectStages
        fields = ("date", "country", "stages")


class AuditLogProjectStagesDetailedSerializer(AuditLogProjectStagesBasicSerializer):
    data = serializers.SerializerMethodField()

    def get_data(self, obj):
        result_dict = {}
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return {stage: len(val) for stage, val in obj.data.get(donor, {}).items()}
        for donor_id, donor_dict in obj.data.items():  # pragma: no cover
            result_dict[donor_id] = {stage: len(val) for stage, val in donor_dict.items()}
        return result_dict  # pragma: no cover

    class Meta:
        model = AuditLogProjectStages
        fields = ("date", "country", "stages", "data")


class AuditLogStandardsBasicSerializer(serializers.ModelSerializer):
    date = serializers.CharField(read_only=True, max_length=10)
    country = serializers.PrimaryKeyRelatedField(read_only=True)
    standards = serializers.SerializerMethodField()

    def get_standards(self, obj):
        donor = self.context['request'].query_params.get('investor')
        standards_dict = obj.standards
        if donor:
            standards_dict = obj.data.get(donor, {})
        return {standard: len(val) for standard, val in standards_dict.items()}

    class Meta:
        model = AuditLogDataStandards
        fields = ("date", "country", "standards")


class AuditLogStandardsDetailedSerializer(AuditLogStandardsBasicSerializer):
    data = serializers.SerializerMethodField()

    def get_data(self, obj):
        result_dict = {}
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return {standard: len(val) for standard, val in obj.data.get(donor, {}).items()}
        for donor_id, donor_dict in obj.data.items():  # pragma: no cover
            result_dict[donor_id] = {standard: len(val) for standard, val in donor_dict.items()}
        return result_dict  # pragma: no cover

    class Meta:
        model = AuditLogDataStandards
        fields = ("date", "country", "standards", "data")


class AuditLogHealthCategoriesBasicSerializer(serializers.ModelSerializer):
    date = serializers.CharField(read_only=True, max_length=10)
    country = serializers.PrimaryKeyRelatedField(read_only=True)
    categories = serializers.SerializerMethodField()

    def get_categories(self, obj):
        donor = self.context['request'].query_params.get('investor')
        cat_dict = obj.categories
        if donor:
            cat_dict = obj.data.get(donor, {})
        return {cat: len(val) for cat, val in cat_dict.items()}

    class Meta:
        model = AuditLogHealthCategories
        fields = ("date", "country", "categories")


class AuditLogHealthCategoriesDetailedSerializer(AuditLogHealthCategoriesBasicSerializer):
    data = serializers.SerializerMethodField()

    def get_data(self, obj):
        result_dict = {}
        donor = self.context['request'].query_params.get('investor')
        if donor:
            return {cat: len(val) for cat, val in obj.data.get(donor, {}).items()}
        for donor_id, donor_dict in obj.data.items():  # pragma: no cover
            result_dict[donor_id] = {cat: len(val) for cat, val in donor_dict.items()}
        return result_dict  # pragma: no cover

    class Meta:
        model = AuditLogHealthCategories
        fields = ("date", "country", "categories", "data")


class AuditLogHFABasicSerializer(serializers.ModelSerializer):
    date = serializers.CharField(read_only=True, max_length=10)
    country = serializers.PrimaryKeyRelatedField(read_only=True)
    hfa = serializers.SerializerMethodField()

    def get_hfa(self, obj):
        donor = self.context['request'].query_params.get('investor')
        all_data = obj.hfa
        if donor:
            all_data = obj.data.get(donor, {})

        category_id = self.context.get("category_id")
        if category_id:
            all_data = all_data.get(str(category_id))
            return {hfa: len(val) for hfa, val in all_data.items()}

        bool_data = {}
        for category, hfa_dict in all_data.items():
            bool_data[category] = {hfa: len(val) > 0 for hfa, val in hfa_dict.items()}

        return bool_data

    class Meta:
        model = AuditLogHFA
        fields = ("date", "country", "hfa")
