from fabric.api import local

def test(app=""):
    local("docker exec -it whomaps_django_1 py.test {} --cov".format(app))

def migrate():
    local("docker exec -it whomaps_django_1 python manage.py migrate")
