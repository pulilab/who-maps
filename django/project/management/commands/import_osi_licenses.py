import json
from django.core.management.base import BaseCommand

from project.models import OSILicence


class Command(BaseCommand):
    help = """
    Import OSI Licenses from a previously saves list of licenses grabbed from: https://opensource.org/licenses/

    1. Grab a list from the website: https://opensource.org/licenses/

    var licenses = [];
    $0.querySelectorAll('tr').forEach((element) => {
      obj = Object.create(null);
      element.querySelectorAll('td').forEach((e) => {
        if (e.classList.contains('license-table--title')) {
          obj.title = e.querySelector('a').text.trim()
          obj.url = e.querySelector('a').href.trim()
          // console.log(e.querySelector('a').text.trim(), e.querySelector('a').href.trim())
        } else if (e.classList.contains('license-table--spdx')) {
          obj.spdx = e.innerHTML.trim()
          // console.log(e.innerHTML.trim())
        } else {
          try {
            obj.category = e.querySelector('a').innerHTML.trim()
            //console.log(e.querySelector('a').innerHTML.trim())
          } catch (e) {
          }
        }

      })
      licenses.push(obj)
    })
    JSON.stringify(licenses)

    2. Save it to a file
    3. Use this script to load to DB
    """

    def handle(self, *args, **options):

        with open('project/static-json/osi_licenses.json', 'r') as f:
            data = json.load(f)

        for license in data:
            category_id = None
            for cat_id, cat_name in OSILicence.Categories.choices:
                if license.get('category') == cat_name:
                    category_id = cat_id

            OSILicence.objects.create(category=category_id,
                                      name=license.get('title'),
                                      url=license.get('url'),
                                      spdx_id=license.get('spdx'))

        self.stdout.write(f"Imported {len(data)} licenses")
