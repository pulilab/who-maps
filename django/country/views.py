from rest_framework import generics
from .models import Country
from .serializers import CountryListSerializer


class CountryListAPIView(generics.ListAPIView):
    queryset = Country.objects.values('id', 'name', 'code')
    serializer_class = CountryListSerializer
