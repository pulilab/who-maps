import time

from fabric import task, Connection
from invoke import Exit

"""
ENVIRONMENTS
"""
ROOT_DIR = '~/who-maps'
BACKEND_ROOT = '/django'
FRONTEND_ROOT = '/frontend'
BACKUP_DIR = '~/backup'


@task
def dev(ctx):
    ctx.name = 'DEV'
    ctx.user = 'whomaps'
    ctx.host = 'dev.whomaps.pulilab.com'
    ctx.connect_kwargs.disabled_algorithms = dict(pubkeys=['rsa-sha2-256', 'rsa-sha2-512'])
    ctx.branch = 'development'
    ctx.docker_file = 'docker-compose.dev.yml'


@task
def qa(ctx):
    ctx.name = 'QA'
    ctx.user = 'whomaps'
    ctx.host = 'qa.whomaps.pulilab.com'
    # ctx.connect_kwargs.key_filename = os.environ['SSH_KEY']
    # ctx.connect_kwargs.key_filename = '/path/to/id_rsa'
    # ctx.ssh_config_path = ''
    # ctx.load_ssh_configs = False
    # ctx.look_for_keys = False
    # ctx.connect_kwargs.pkey = RSAKey.from_private_key_file('/path/to/id_rsa')
    ctx.connect_kwargs.disabled_algorithms = dict(pubkeys=['rsa-sha2-256', 'rsa-sha2-512'])
    ctx.branch = None
    ctx.docker_file = 'docker-compose.test.yml'


@task
def prod(ctx):
    ctx.name = 'PRODUCTION'
    ctx.user = 'whomaps'
    ctx.host = 'digitalhealthatlas.org'
    ctx.connect_kwargs.disabled_algorithms = dict(pubkeys=['rsa-sha2-256', 'rsa-sha2-512'])
    ctx.branch = None
    ctx.docker_file = 'docker-compose.prod.yml'


"""
COMMANDS
"""


def command_executor(ctx, commands: list, root_dir=ROOT_DIR, warn=False):
    with Connection(ctx.host, ctx.user, connect_kwargs=ctx.connect_kwargs) as conn:
        with conn.cd(root_dir):
            for cmd in commands:
                conn.run(cmd, echo=True, warn=warn)


@task
def drop_db(ctx):
    command_executor(ctx, ['docker-compose exec postgres dropdb -U postgres postgres'])


@task
def create_db(ctx):
    command_executor(ctx, ['docker-compose exec postgres createdb -U postgres postgres'])


@task
def backup_db(ctx):
    with Connection(ctx.host, ctx.user, connect_kwargs=ctx.connect_kwargs) as c:
        with c.cd(ROOT_DIR):
            date_string = c.run("date +%Y-%m-%d,%H:%M", hide='out').stdout.strip()
            c.run(f'docker-compose exec postgres pg_dumpall -U postgres -c > {BACKUP_DIR}/dump_{date_string}.sql',
                  echo=True)
            c.run(f'gzip -f {BACKUP_DIR}/dump_{date_string}.sql', echo=True)


@task
def list_dumps(ctx):
    command_executor(ctx, ['ls -halt'], root_dir=BACKUP_DIR)


@task
def restore_db(ctx, dump_name):
    command_executor(ctx, [f'cat {BACKUP_DIR}/{dump_name} '
                           f'| docker exec -i $(docker-compose ps -q postgres) psql -Upostgres'])


@task
def update_translations_frontend(ctx):
    command_executor(ctx, ['docker-compose exec django python manage.py update_translations master.pot'], warn=True)


@task
def update_translations_frontend(ctx):
    command_executor(ctx, [
        'docker-compose exec django django-admin makemessages -a',
        'docker-compose exec django django-admin compilemessages'
    ], warn=True)


@task
def deploy(ctx, tag=None):
    with Connection(ctx.host, ctx.user, connect_kwargs=ctx.connect_kwargs) as c:
        with c.cd(ROOT_DIR):
            # DOCKER CONFIG AND MAKE SURE EVERYTHING IS RUNNING
            docker_config = f"-f docker-compose.yml -f {ctx.docker_file}"
            ps = c.run(f'docker-compose {docker_config} ps', echo=True).stdout
            running = "".join([l for l in ps.split('\n') if 'Up' in l])
            time.sleep(3)
            if any([x for x in ['django', 'nginx', 'postgres', 'redis'] if x not in running]):
                raise Exit("Pre-deploy failed: not all instances are running properly")

            # BACKUP DB
            date_string = c.run("date +%Y-%m-%d,%H:%M", hide='out').stdout.strip()
            c.run(f'docker-compose exec postgres pg_dumpall -U postgres -c > {BACKUP_DIR}/dump_{date_string}.sql',
                  echo=True)
            c.run(f'gzip -f {BACKUP_DIR}/dump_{date_string}.sql', echo=True)

            # CLEAN DOCKER LEFTOVERS
            c.run('docker system prune -f', echo=True)
            time.sleep(10)

            # GIT NEW CODE
            c.run('git fetch --all --tags', echo=True)
            if tag:
                c.run(f'git checkout tags/{tag}', echo=True)
            elif ctx.branch:
                c.run(f'git checkout {ctx.branch}', echo=True)
                c.run(f'git pull origin {ctx.branch}', echo=True)
            else:
                raise Exit('No branch or tag is selected')
            time.sleep(10)

            # NEW VERSION TO ENV
            env = f"{ROOT_DIR}{BACKEND_ROOT}/.env"  # BACKEND ENV FILE PATH
            c.run(f'[ -f {env} ] || echo "DEPLOY_VERSION=0.0.0" > {env}')
            c.run(f'if [ -z $(grep "DEPLOY_VERSION=" "{env}") ]; then echo "DEPLOY_VERSION=0.0.0" >> {env}; fi')
            version = c.run('git describe --tags --always', echo=True).stdout.strip()
            c.run(f'sed -i "s/DEPLOY_VERSION=.*/DEPLOY_VERSION={version}/g" {env}')

            # BUILD DOCKER
            c.run(f'docker-compose {docker_config} build', echo=True)

            # DOWN & UP TO RUN NEW BUILD
            c.run(f'docker-compose {docker_config} down', echo=True)
            c.run(f'docker-compose {docker_config} up -d', echo=True)
            time.sleep(20)

            # MIGRATE DB
            c.run('docker-compose exec django python manage.py migrate --noinput', echo=True)
            time.sleep(2)

            # HANDLE TRANSLATIONS
            c.run('docker-compose exec django python manage.py update_translations master.pot', warn=True, echo=True)
            c.run('docker-compose exec django django-admin makemessages -a', warn=True, echo=True)
            c.run('docker-compose exec django django-admin compilemessages', warn=True, echo=True)
            c.run('docker-compose restart django', echo=True)


"""
LOCAl COMMANDS
"""


@task
def cov(c):
    c.run(
        "docker-compose exec django py.test -x --cov --cov-report html --cov-fail-under 100 --cov-report term-missing"
        " --cov-config .coveragerc", pty=True
    )


@task
def lint(c):
    c.run('docker-compose exec django flake8', pty=True)


@task
def migrate(c):
    c.run('docker-compose exec django python manage.py migrate --noinput', pty=True)


@task
def makemigrations(c):
    c.run('docker-compose exec django python manage.py makemigrations', pty=True)


@task
def shell(c):
    c.run("docker-compose exec django python manage.py shell", pty=True)

