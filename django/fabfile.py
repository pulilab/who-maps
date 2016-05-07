from fabric.api import local, settings, abort, run, cd, env, lcd
import time

# ENVIRONMENTS #


def dev():
    """Configure dev"""
    env.hosts = ['whomaps@dev.whomaps.pulilab.com']
    env.name = 'dev'
    env.port = 22
    env.branch = "master"
    env.project_root = '/home/whomaps/who-maps'
    env.backend_root = 'django'
    env.frontend_root = 'frontend'


def staging():
    """Configure staging"""
    env.hosts = ['whomaps@test.whomaps.pulilab.com']
    env.name = 'staging'
    env.port = 22
    env.branch = "master"
    env.project_root = '/home/whomaps/who-maps'
    env.backend_root = 'django'
    env.frontend_root = 'frontend'


# COMMANDS #

def deploy():
    """Updates the server and restarts the apps"""
    with cd(env.project_root):
        # get new stuff from git
        run('git checkout %s' % env.branch)
        run('git pull origin %s' % env.branch)

        # handle backend
        with cd(env.backend_root):
            run('docker-compose restart')
            time.sleep(2)
            # backup DB
            _backup_db()
            # build
            run('docker-compose build')
            run('docker-compose down')
            run('docker-compose up -d')

            # drop & create DB
            time.sleep(10)
            _drop_db()
            time.sleep(1)
            _create_db()
            # restore DB
            time.sleep(1)
            _restore_db()
            # migrate DB
            time.sleep(1)
            _migrate_db()

            # restart
            run('docker-compose restart')

        # handle frontend
        with cd(env.frontend_root):
            run('npm install')
            run('npm run dist')

    tear_down()


def tear_down():
    if 'tear_down' in env:
        env.tear_down()


def test(app=""):
    local("docker exec -it whomaps_django_1 py.test {} --cov".format(app))


def migrate():
    local("docker exec -it whomaps_django_1 python manage.py migrate")


def import_geodata():
    local("python manage.py fetch_geodata --selected")
    local("python manage.py topojson")
    local("docker exec -it whomaps_django_1 python manage.py import_geodata")


def _drop_db():
    run('docker exec -it whomaps_postgres_1 dropdb -U postgres postgres')


def _create_db():
    run('docker exec -it whomaps_postgres_1 createdb -U postgres postgres')


def _backup_db():
    run('docker exec -it whomaps_postgres_1 pg_dumpall -U postgres -c > ~/backup/dump`date +%d-%m-%Y`.sql')


def _restore_db():
    run('cat ~/backup/dump`date +%d-%m-%Y`.sql | docker exec -i whomaps_postgres_1 psql -Upostgres')
    # run('cat ../dump.json | docker exec -i whomaps_django_1 python manage.py loaddata_stdin')


def _migrate_db():
    run('docker exec -it whomaps_django_1 python manage.py migrate')