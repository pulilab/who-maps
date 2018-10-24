# Generated by Django 2.1 on 2018-09-28 12:25

from django.db import migrations, transaction

from project.models import Project

@transaction.atomic
def migrate_country_fields_to_country_custom_questions(apps, schema_editor):
    Country = apps.get_model('country', 'Country')
    CountryField = apps.get_model('country', 'CountryField')
    CountryCustomQuestion = apps.get_model('country', 'CountryCustomQuestion')
    sid = transaction.savepoint()

    try:
        for country in Country.objects.all():
            for index, field in enumerate(CountryField.objects.filter(country=country, enabled=True, schema=True)):
                q = CountryCustomQuestion._default_manager.create(order=index,
                                                                  country=field.country,
                                                                  question=field.question,
                                                                  type=field.type,
                                                                  options=field.options,
                                                                  required=field.required)
                answers = CountryField.objects.filter(question=field.question, country=country, enabled=True,
                                                      schema=False)
                project_list = list(set(CountryField.objects.filter(question=field.question, country=country, enabled=True,
                                                               schema=False).values_list('project_id', flat=True)))
                for project in Project.objects.filter(id__in=project_list):
                    answers_for_project = answers.filter(project_id=project.id)
                    for answer in answers_for_project:
                        project.data.setdefault('country_custom_answers', {})
                        project.draft.setdefault('country_custom_answers', {})
                        if answer.answer == 'true':
                            ans = 'yes'
                        elif answer.answer == 'false':
                            ans = 'no'
                        else:
                            ans = answer.answer

                        if answer.draft == 'true':
                            drft = 'yes'
                        elif answer.draft == 'false':
                            drft = 'no'
                        else:
                            drft = answer.draft

                        project.data['country_custom_answers'][str(q.id)] = [ans]
                        project.draft['country_custom_answers'][str(q.id)] = [drft]
                    project.save()
    except:
        transaction.savepoint_rollback(sid)
    else:
        transaction.savepoint_commit(sid)

class Migration(migrations.Migration):
    dependencies = [
        ('country', '0041_countrycustomquestion_donorcustomquestion'),
    ]

    operations = [
        migrations.RunPython(migrate_country_fields_to_country_custom_questions)
    ]