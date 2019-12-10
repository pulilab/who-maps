import random
import string
import tempfile


def create_temp_file_with_random_content(extension='.txt', size_in_bytes=10):
    tmp_file = tempfile.NamedTemporaryFile(suffix=extension)

    with open(tmp_file.name, 'w') as f:
        letters = string.ascii_lowercase
        content = ''.join(random.choice(letters) for _ in range(size_in_bytes))
        f.write(content)

    return tmp_file
