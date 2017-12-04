from django.dispatch import Signal

intervention_save = Signal(providing_args=[
    "instance",
])
