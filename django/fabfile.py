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
        time.sleep(20)

        if env.name == 'dev':
            run('docker-compose -f docker-compose.yml -f docker-compose.dev.yml restart')
        elif env.name == 'staging':
            run('docker-compose -f docker-compose.yml -f docker-compose.test.yml restart')
        else:
            run('docker-compose restart')

        time.sleep(5)

        # handle backend
        with cd(env.backend_root):

            # backup DB
            _backup_db()
            # build
            if env.name == 'dev':
                options = "-f ../docker-compose.yml -f ../docker-compose.dev.yml "
            elif env.name == 'staging':
                options = "-f ../docker-compose.yml -f ../docker-compose.test.yml "
            else:
                options = ""
            run('docker-compose {}build'.format(options))
            run('docker-compose {}down'.format(options))
            run("docker-compose {}up -d".format(options))

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
            time.sleep(1)
            _import_geodata()


        # handle frontend
        with cd(env.frontend_root):
            run('npm install')
            run('npm run dist')
            run('npm run clean-server-folder')
            run('npm run copy-to-server')

    tear_down()


def tear_down():
    if 'tear_down' in env:
        env.tear_down()


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


def _import_geodata():
    run('python geodata_import.py')


# LOCAL STUFF #


def test(app=""):
    local("docker exec -it whomaps_django_1 py.test {} --cov".format(app))


def migrate():
    local("docker exec -it whomaps_django_1 python manage.py migrate")


def import_geodata():
    local("python geodata_import.py")


def rebuild_db():
    local("docker exec -it whomaps_postgres_1 dropdb -U postgres postgres")
    local("docker exec -it whomaps_postgres_1 createdb -U postgres postgres")
    local("cat ./dump.sql | docker exec -i whomaps_postgres_1 psql -Upostgres")


def backup_db():
    local("docker exec -it whomaps_postgres_1 pg_dumpall -U postgres -c > ./dump.sql")


def down():
    backup_db()
    local("docker-compose down")


def up():
    local("docker-compose up -d")
    time.sleep(5)
    rebuild_db()


def up_debug():
    up()
    time.sleep(2)
    local("docker stop whomaps_django_1")
    local("docker-compose run --service-ports django python manage.py runserver 0.0.0.0:8000")
