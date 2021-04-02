
export async function mockFolderStructure() {
    const res = {
        name: 'Тесты',
        type: 'dir',
        content: [
            {
                name: 'Категория 1',
                type: 'dir',
                content: []
            },
            {
                name: 'Тест 1',
                type: 'test',
                description: 'Первый тест. На самом деле, пуст. Непримечательный ничем кроме того, что первый.'
            },
            {
                name: 'Категория 2',
                type: 'dir',
                content: [
                    {
                        name: 'Тест 2',
                        type: 'test',
                        description: 'Второй тест, бла-бла-бла'
                    },
                    {
                        name: 'Категория 3',
                        type: 'dir',
                        content: [
                            {
                                name: 'папка',
                                type: 'dir',
                                content: []
                            },
                            {
                                name: 'тоже папка',
                                type: 'dir',
                                content: []
                            },
                            {
                                name: 'еще папка',
                                type: 'dir',
                                content: []
                            },
                            {
                                name: 'опять папка',
                                type: 'dir',
                                content: []
                            },
                            {
                                name: 'папка!',
                                type: 'dir',
                                content: []
                            },
                            {
                                name: 'папка :)',
                                type: 'dir',
                                content: []
                            },
                            {
                                name: 'папка ???',
                                type: 'dir',
                                content: []
                            },
                        ]
                    }
                ]
            }
        ]
    }
    await new Promise(r => setTimeout(r, 200))
    return res
}

export async function mockTestDescription() {
    const res = {
        name: 'Самый первый тест',
        path: '/Users/boris/Desktop/test',
        settings: {},
        questions: [
            {
                sound: 'bb.wav',
                answers: [
                    {
                        image: 'bb.png',
                        correct: true
                    },
                    {
                        image: 'rr.png',
                        correct: false
                    },
                    {
                        image: 'bbr.png',
                        correct: false
                    }
                ]
            },
            {
                sound: 'bb.wav',
                answers: [
                    {
                        image: 'bbr.png',
                        correct: false
                    },
                    {
                        image: 'rr.png',
                        correct: false
                    },
                    {
                        image: 'bb.png',
                        correct: true
                    }
                ]
            },
            {
                sound: 'bbbbr.wav',
                answers: [
                    {
                        image: 'bb.png',
                        correct: true
                    },
                    {
                        image: 'rr.png',
                        correct: false
                    },
                    {
                        image: 'bbr.png',
                        correct: true
                    }
                ]
            },
        ]
    };
    return res;
}

export async function mockUserList() {
    const res = [
        {
            userId: 1,
            name: 'Борис',
            surname: 'Старков',
            patronal: 'Михайлович'
        },
        {
            userId: 2,
            name: 'Иван',
            surname: 'Иванов',
            patronal: 'Петрович'
        },
        {
            userId: 3,
            name: 'Джон',
            surname: 'Леннон'
        },
        {
            userId: 4,
            name: 'Пол',
            surname: 'Маккартни'
        },
        {
            userId: 5,
            name: 'Ринго',
            surname: 'Старр'
        },
        {
            userId: 6,
            name: 'Джордж',
            surname: 'Харрисон'
        }
    ];
    return res;
}

export async function mockDetailedStats() {
    const res = [
        {
            ts: Date.parse('01 Apr 2021 00:00:00 GMT'),
            time: '01 Apr 2021 00:00:00 GMT',
            correct: 5,
            total: 6
        },
        {
            ts: Date.parse('02 Apr 2021 02:00:00 GMT'),
            time: '02 Apr 2021 02:00:00 GMT',
            correct: 3,
            total: 6
        },
        {
            ts: Date.parse('02 Apr 2021 03:27:00 GMT'),
            time: '02 Apr 2021 03:27:00 GMT',
            correct: 5,
            total: 6
        },
        {
            ts: Date.parse('02 Apr 2021 12:00:00 GMT'),
            time: '02 Apr 2021 12:00:00 GMT',
            correct: 6,
            total: 6
        },
    ]
    return res;
}