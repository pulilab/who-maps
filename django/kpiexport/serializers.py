# DEPRECATED: replaced by new JSON ORM functions

# class AuditLogHFABasicSerializer(serializers.ModelSerializer):
#     date = serializers.CharField(read_only=True, max_length=10)
#     country = serializers.PrimaryKeyRelatedField(read_only=True)
#     hfa = serializers.SerializerMethodField()
#
#     def get_hfa(self, obj):
#         donor = self.context['request'].query_params.get('investor')
#         all_data = obj.hfa
#         if donor:
#             all_data = obj.data.get(donor, {})
#
#         category_id = self.context.get("category_id")
#         if category_id:
#             all_data = all_data.get(str(category_id))
#             return {hfa: len(val) for hfa, val in all_data.items()}
#
#         bool_data = {}
#         for category, hfa_dict in all_data.items():
#             bool_data[category] = {hfa: len(val) > 0 for hfa, val in hfa_dict.items()}
#
#         return bool_data
#
#     class Meta:
#         model = AuditLogHFA
#         fields = ("date", "country", "hfa")
