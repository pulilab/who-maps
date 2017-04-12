const resources = [
    {
        domain: 'Data'
    },
    {
        domain: 'Adaptability'
    },
    {
        domain: 'Scientific Basis'
    }
];
const lessons =  [
    {
        domain: 'Data'
    },
    {
        domain: 'Adaptability'
    }
];
const experiences =  [
    {
        domain: 'Data'
    },
    {
        domain: 'Adaptability'
    },
    {
        domain: 'Scientific Basis'
    },
    {
        domain: 'Financial Model'
    }
];

let seq = 0;

const randomString = size => {
    const text = [];
    const possible = 'abcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < size; i++) {
        text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
        if (Math.random() <= 0.25) {
            text.push(' ');
        }
    }

    return text.join('');
};

const randomDate = () => {
    return new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
};

const addRandomStuff = (item) => {
    const randInteger = Math.floor(Math.random() * 10);
    item.id = seq;
    item.reported = Math.random() < 0.5;
    item.name = randomString(40);
    item.body = randomString(350);
    item.cover = Math.random() <= 0.65 ? 'https://unsplash.it/120/170/' : null;
    item.avatar = Math.random() <= 0.65 ? 'https://unsplash.it/80/' : null;
    item.comments = [];
    for (let i = 0; i <= randInteger; i++) {
        const comment = {
            text: randomString(150),
            date: randomDate(),
            username: randomString(10)
        };
        item.comments.push(comment);
    }
    seq += 1;
};

experiences.forEach(item => {
    addRandomStuff(item);
    item.date = randomDate();
    item.type = 'experiences';
});
resources.forEach(item => {
    addRandomStuff(item);
    item.type = 'resources';
});
lessons.forEach(item => {
    addRandomStuff(item);
    item.type = 'lessons';
});

export default {
    resources,
    lessons,
    experiences
};
