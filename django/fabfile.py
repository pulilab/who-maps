from fabric.api import local

def test():
    local("docker exec -it whomaps_django_1 python manage.py test")

def migrate():
    local("docker exec -it whomaps_django_1 python manage.py migrate")
