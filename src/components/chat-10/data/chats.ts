export const chats = [
  {
    chatId: 1, name: "Юрий",
    avatar: 'https://img.freepik.com/free-photo/smiley-man-relaxing-outdoors_23-2148739334.jpg',
    countUnread: 0, countUnreadOut: 0,
    lastMessage: 'Посмотри это видео, пожалуйста',
    'lastActivity.time': '23.09.2024',         // читаемый формат - для пользователей
    'lastActivity.timestamp': '1727087959',   // для сортировки
    isFixedBottom: false,
    isFixedTop: false,
    status: 'lightgreen',
    'lastMessage.status': 'read', // received|read|sent|in
    actions: [
      { action: 'pinUp', title: 'прикрепить сверху' },
      { action: 'pinDown', title: 'прикрепить снизу' }
    ],
    //В данном случае typing совершает "владелец" чата (поле name)
    //typing in - собеседник (Татьяна)
    typingIn: false,
    typing: false,
    metadata: 'юрий',    // фильтр работает по name и данным в metadata
  },
  {
    chatId: 2, name: "Алексей",
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    countUnread: 1, countUnreadOut: 0,
    isFixedBottom: false,
    isFixedTop: false,
    'lastActivity.time': '23.09.2024',
    'lastMessage.status': 'in', // received|read|sent|in
    'lastActivity.timestamp': '1727027959',
    actions: [
      { action: 'pinUp', title: 'прикрепить сверху' },
      { action: 'pinDown', title: 'прикрепить снизу' }
    ],
    typing: false,
    typingIn: false,
    lastMessage: 'Аудиосообщение',
    metadata: 'алексей',
    status: 'lightgreen',
  },
  {
    chatId: 3, name: "Борис",
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    countUnread: 3, countUnreadOut: 0,
    isFixedBottom: false,
    isFixedTop: false,
    'lastActivity.time': '01.10.2024',
    'lastMessage.status': 'received',
    'lastActivity.timestamp': '1727800000',
    actions: [
      { action: 'pinUp', title: 'прикрепить сверху' },
      { action: 'pinDown', title: 'прикрепить снизу' }
    ],
    typing: false,
    typingIn: false,
    lastMessage: 'Добрый день! Подскажите по заявке...',
    metadata: 'борис',
    status: 'lightgreen',
  },
  {
    chatId: 4, name: "Виктор",
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    countUnread: 0, countUnreadOut: 0,
    isFixedBottom: false,
    isFixedTop: false,
    'lastActivity.time': '30.09.2024',
    'lastMessage.status': 'read',
    'lastActivity.timestamp': '1727700000',
    actions: [
      { action: 'pinUp', title: 'прикрепить сверху' },
      { action: 'pinDown', title: 'прикрепить снизу' }
    ],
    typing: false,
    typingIn: false,
    lastMessage: 'Согласовали условия, отправляю договор',
    metadata: 'василий петрович',
    status: 'lightgreen',
  },
  {
    chatId: 5, name: "Святослав",
    avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    countUnread: 5, countUnreadOut: 0,
    isFixedBottom: false,
    isFixedTop: false,
    'lastActivity.time': '02.10.2024',
    'lastMessage.status': 'in',
    'lastActivity.timestamp': '1727880000',
    actions: [
      { action: 'pinUp', title: 'прикрепить сверху' },
      { action: 'pinDown', title: 'прикрепить снизу' }
    ],
    typing: false,
    typingIn: false,
    lastMessage: 'Проверь, пожалуйста, акты за сентябрь',
    metadata: 'радий юсупович',
    status: 'lightgreen',
  },
  {
    chatId: 6, name: "Анатолий",
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    countUnread: 0, countUnreadOut: 1,
    isFixedBottom: false,
    isFixedTop: false,
    'lastActivity.time': '29.09.2024',
    'lastMessage.status': 'sent',
    'lastActivity.timestamp': '1727600000',
    actions: [
      { action: 'pinUp', title: 'прикрепить сверху' },
      { action: 'pinDown', title: 'прикрепить снизу' }
    ],
    typing: false,
    typingIn: false,
    lastMessage: 'Дедлайн перенесли на пятницу',
    metadata: 'виталий',
    status: 'lightgreen',
  },
];
