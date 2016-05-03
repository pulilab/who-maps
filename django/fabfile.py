from fabric.api import local, settings, abort, run, cd, env, lcd

# ENVIRONMENTS #


def dev():
    """Configure dev"""
    env.hosts = ['IP']
    env.name = 'dev'
    env.port = 21215
    env.branch = "master"

    env.project_root = '/home/' # TODO: fix this


def staging():
    """Configure staging"""
    env.hosts = ['test.whomaps.pulilab.com']
    env.name = 'staging'
    env.port = 21215
    env.branch = "staging"

    env.project_root = '/home/'


# COMMANDS #


def deploy():
    """Updates the server and restarts the apps"""
    with cd(env.project_root):
        _run_with_failure('git checkout %s' % env.branch, 'Git checkout failed.')
        _run_with_failure('git pull origin %s' % env.branch, 'Git pull failed.')

        # TODO:
        # - npm install
        # - npm run dist
        # - compose build
        # - compose up -d

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


def _run_with_failure(command, question):
    """Utility script to run a command with a confirmation to exit on failure

    :param command: the command to run
    :param question: the user friendly notice what failed
    """
    with settings(warn_only=True):
        result = run(command)
    if result.failed and (not env.interactive or not confirm("%s Continue anyway?" % question)):
        abort('Aborting on your request because of error in command %s' % command)
        tear_down()
