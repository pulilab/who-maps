from django.db import models


class GetObjectOrNoneManager(models.Manager):

    def get_object_or_none(self, select_for_update=False, **kwargs):
        """
        Hides Exception handling boilerplate when querying for single objects.
        Locks object (if selected for update) if exists else None
        """
        try:
            if select_for_update:
                return self.select_for_update().get(**kwargs)
            else:
                return self.get(**kwargs)
        except self.model.DoesNotExist:
            return None


class ExtendedModel(models.Model):
    """
    Adds nice to have behaviors to the Model class, such as:
        - adds timestamps on create, update
        - simplifies single object queries by removing Exception handling boilerplate
    """
    created = models.DateTimeField(auto_now=False, auto_now_add=True)
    modified = models.DateTimeField(auto_now=True, auto_now_add=False)

    objects = GetObjectOrNoneManager()

    class Meta:
        abstract = True
