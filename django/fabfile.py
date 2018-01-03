import time
from fabric.api import local, run, cd, env
from fabric.context_managers import warn_only

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
    env.webpack_options = ''


def production():
    """Configure prod"""
    env.hosts = ['whomaps@207.154.215.126']
    env.name = 'production'
    env.port = 22
    env.branch = "tags/3.1.4"
    env.project_root = '/home/whomaps/who-maps'
    env.backend_root = 'django'
    env.frontend_root = 'frontend'
    env.webpack_options = '-live'


def staging():
    """Configure staging"""
    env.hosts = ['whomaps@139.59.148.238']
    env.name = 'staging'
    env.port = 22
    env.branch = "tags/3.2.2"
    env.project_root = '/home/whomaps/who-maps'
    env.backend_root = 'django'
    env.frontend_root = 'frontend'
    env.webpack_options = ''


# COMMANDS #

def pull_prod_dev():
    # Make backups on production
    production()
    tag = None
    with cd(env.project_root):
        # Get current tag
        tag = run('git describe --tags')
        # Backup production database
        run('docker exec -it whomaps_postgres_1 pg_dumpall -U postgres -c > ~/backup/dump`date +%d-%m-%Y`.sql')
        run('tar -czvf ~/backup/dump`date +%d-%m-%Y`.sql.tar.gz ~/backup/dump`date +%d-%m-%Y`.sql')
        # Backup production media files
        run('tar -czvf ~/backup/dump`date +%d-%m-%Y`.media.tar.gz media/')
    # Switch to dev
    dev()
    with cd(env.project_root):
        # Deploy as usual, but from the production tag
        env.branch = 'tags/{}'.format(tag)
        deploy()
        # Import production database
        run('scp whomaps@207.154.215.126:~/backup/dump`date +%d-%m-%Y`.sql.tar.gz .')
        run('cat dump`date +%d-%m-%Y`.sql | docker exec -i whomaps_postgres_1 psql -Upostgres')
        # Import production media files
        run('rm -rf media')
        run('scp whomaps@207.154.215.126:~/backup/dump`date +%d-%m-%Y`.media.tar.gz .')
        run('tar -xzvf dump`date +%d-%m-%Y`.media.tar.gz media')


def backup():
    # Backup database
    local('docker exec -it whomaps_postgres_1 pg_dumpall -U postgres -c > ~/backup/dump`date +%d-%m-%Y`.sql')
    local('tar -czvf ~/backup/dump`date +%d-%m-%Y`.sql.tar.gz ~/backup/dump`date +%d-%m-%Y`.sql')
    # Backup media files
    local('tar -czvf ~/backup/dump`date +%d-%m-%Y`.media.tar.gz media/')


def deploy():
    db_up = None
    """Updates the server and restarts the apps"""
    with cd(env.project_root):
        # get new stuff from git
        run('git fetch')
        if env.name == 'production':
            with warn_only():
                run('rm ~/who-maps/nginx/conf.d/production.conf')
        run('git checkout %s' % env.branch)
        run('git pull origin %s' % env.branch)
        time.sleep(10)

        if env.name == 'dev':
            options = "-f {}/docker-compose.yml -f {}/docker-compose.dev.yml ".format(
                env.project_root, env.project_root)
        elif env.name == 'staging':
            options = "-f {}/docker-compose.yml -f {}/docker-compose.test.yml ".format(
                env.project_root, env.project_root)
        elif env.name == 'production':
            options = "-f {}/docker-compose.yml -f {}/docker-compose.prod.yml ".format(
                env.project_root, env.project_root)
            run('cp ~/who-maps/nginx/conf.d/production.conf.disabled ~/who-maps/nginx/conf.d/production.conf')
        else:
            options = ""

        ps = run('docker-compose ps')
        running = "".join([l for l in ps.split('\n') if 'Up' in l])

        time.sleep(3)

        if 'django' in running:
            run('docker-compose {}restart django'.format(options))
        if 'celery' in running:
            run('docker-compose {}restart celery'.format(options))
        if 'nginx' in running:
            run('docker-compose {}restart nginx'.format(options))
        if 'postgres' in running:
            db_up = True
            run('docker-compose {}restart postgres'.format(options))
        if 'rabbitmq' in running:
            run('docker-compose {}restart rabbitmq'.format(options))

        time.sleep(5)

        # handle backend
        with cd(env.backend_root):

            # backup DB
            if db_up:
                _backup_db()
            # build
            run('docker-compose {}build'.format(options))
            run('docker-compose {}down'.format(options))
            run("docker-compose {}up -d".format(options))

            # drop & create DB
            time.sleep(20)
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
            # _import_geodata()

        # handle frontend
        with cd(env.frontend_root):
            run('yarn')
            run('yarn dist{}'.format(env.webpack_options))
            run('yarn clean-server-folder')
            run('yarn copy-to-server')

    # Set cron for backups
    if env.name == 'production':
        cmd = '0 4 * * * cd /home/whomaps/who-maps/django && fab backup_prod'
        run("grep '{}' /etc/crontab || echo '{}' >> /etc/crontab".format(cmd, cmd))

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
    run('docker exec -it whomaps_django_1 python manage.py migrate --noinput')


def _import_geodata():
    run('python geodata_import.py')


# LOCAL STUFF #


def test(app=""):
    local("docker-compose exec django ptw -- {} -s --testmon".format(app))


def cov():
    local(
        "docker-compose exec django py.test --cov --cov-report html --cov-fail-under 100 --cov-report term-missing"
        " --cov-config .coveragerc"
    )


def lint():
    local('docker-compose exec django flake8')


def makemigrations():
    local('docker exec -it whomaps_django_1 python manage.py makemigrations --noinput')


def migrate():
    local("docker exec -it whomaps_django_1 python manage.py migrate --noinput")


def import_geodata():
    local("python geodata_import.py prod")


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


def up_debug():
    up()
    time.sleep(2)
    local("docker stop whomaps_django_1")
    local("docker-compose run --service-ports django python manage.py runserver 0.0.0.0:8000")


def update_translations():
    local("docker-compose exec django python manage.py update_translations master.pot")
