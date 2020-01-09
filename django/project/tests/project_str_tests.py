from rest_framework.test import APITestCase

from core.factories import TechnologyPlatformFactory, DigitalStrategyFactory, HSCGroupFactory, HSCChallengeFactory, \
    LicenceFactory, InteroperabilityStandardFactory, HISBucketFactory
from project.models import InteroperabilityLink


class ProjectStrTests(APITestCase):

    def test_digital_strategies_str(self):
        ds1 = DigitalStrategyFactory(name='ds1', group='Client')
        ds2 = DigitalStrategyFactory(name='ds2', group='Client', parent=ds1)
        self.assertEqual(str(ds1), '[Client] ds1')
        self.assertEqual(str(ds2), '[Client] [ds1] ds2')

    def test_interop_str(self):
        io = InteroperabilityLink.objects.create(pre='bla', name='io')
        self.assertEqual(str(io), 'io')

    def test_platforms_str(self):
        tp = TechnologyPlatformFactory(name='tp')
        self.assertEqual(str(tp), 'tp')

    def test_licences_str(self):
        item = LicenceFactory(name='name')
        self.assertEqual(str(item), 'name')

    def test_iop_standard_str(self):
        item = InteroperabilityStandardFactory(name='name')
        self.assertEqual(str(item), 'name')

    def test_his_bucket_str(self):
        item = HISBucketFactory(name='name')
        self.assertEqual(str(item), 'name')

    def test_hsc_str(self):
        hsc_group = HSCGroupFactory(name='name')
        item = HSCChallengeFactory(name='challenge', group=hsc_group)
        self.assertEqual(str(item), '(name) challenge')
