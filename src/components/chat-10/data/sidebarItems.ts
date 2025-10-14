export const sidebarItems = [
  {
    itemId: 'itemId0',
    icon: 'https://placehold.jp/30/dd6699/ffffff/64x64.png?text=SD',
    name: 'Василий Петрович',
    notificationCount: 100,
    selected: false,
    // Чаты, которые должны отображаться при клике на этот элемент
    chatIds: [4],
  },
  {
    itemId: 'itemId1',
    icon: 'https://placehold.jp/30/336633/ffffff/64x64.png?text=PN',
    name: 'Радий Юсупович',
    notificationCount: 10,
    notificationColor: '#FF0000',
    selected: false,
    chatIds: [5],
  },
  {
    itemId: 'itemId2',
    icon: 'https://placehold.jp/30/336633/ffffff/64x64.png?text=MV',
    name: 'Виталий',
    notificationCount: 7,
    notificationColor: '#FF0000',
    selected: true,
    chatIds: [6],
  },
  {
    itemId: 'itemId3',
    icon: 'https://placehold.jp/30/336633/ffffff/64x64.png?text=DP',
    name: 'Юрий',
    notificationCount: 0,
    notificationColor: '#FF0000',
    selected: false,
    // пример группы: несколько чатов
    chatIds: [1,2,3],
  },
  {
    itemId: 'itemId4',
    icon: 'https://placehold.jp/30/336633/ffffff/64x64.png?text=PN',
    name: 'Борис',
    isFixedBottom: true,
    notificationCount: 99,
    notificationColor: '#00FF00',
    selected: false,
    chatIds: [3,4],
  },
];
