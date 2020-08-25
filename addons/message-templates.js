const MESSAGE_TEMPLATES = [
    {
        type: 'lagging',
        isSocial: true,
        text: [
            {locale: 'en_US', value: '{friend_name} has beaten your record!'},
            {locale: 'ru_RU', value: '{friend_name} побил твой рекорд!'},
        ]
    },
    {
        type: 'connect',
        isSocial: true,
        text: [
            {locale: 'en_US', value: '{friend_name} has joined the game!'},
            {locale: 'ru_RU', value: '{friend_name} присоединился в игру!'},
        ]

    },
    {
        type: 'new_levels',
        isSocial: false,
        text: [
            {locale: 'en_US', value: 'New levels are now available!'},
            {locale: 'ru_RU', value: 'Теперь стали доступны новые уровни!'},
        ]
    },
    {
        type: 'relax',
        isSocial: false,
        text: [
            {locale: 'en_US', value: 'It\'s time to relax!'},
            {locale: 'ru_RU', value: 'Самое время отдохнуть!'},
        ]
    }
];

module.exports = MESSAGE_TEMPLATES;