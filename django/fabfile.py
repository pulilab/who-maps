from fabric.api import local

def test(app=""):
    local("docker exec -it whomaps_django_1 py.test {} --cov".format(app))

def migrate():
    local("docker exec -it whomaps_django_1 python manage.py migrate")

def import_geodata():
    local("python manage.py fetch_geodata --selected")
    local("python manage.py topojson")
    local("docker exec -it whomaps_django_1 python manage.py import_geodata")
