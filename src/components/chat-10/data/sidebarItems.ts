import image13 from './images/13.jpg'
import image10 from './images/10.jpg'
import image9 from './images/9.jpg'
import image4 from './images/4.jpg'

export const sidebarItems = [
  {
    itemId: 'itemId0',
    icon: image13,
    name: 'Василий Петрович',
    notificationCount: 100,
    selected: false,
    // Чаты, которые должны отображаться при клике на этот элемент
    chatIds: [4],
  },
  {
    itemId: 'itemId1',
    icon: image10,
    name: 'Радий Юсупович',
    notificationCount: 10,
    notificationColor: '#FF0000',
    selected: false,
    chatIds: [5],
  },
  {
    itemId: 'itemId2',
    icon: image9,
    name: 'Виталий',
    notificationCount: 7,
    notificationColor: '#FF0000',
    selected: true,
    chatIds: [6],
  },
  {
    itemId: 'itemId3',
    icon: image4,
    name: 'Юрий',
    notificationCount: 0,
    notificationColor: '#FF0000',
    selected: false,
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
    chatIds: [1,2,3,4,5,6],
  },
];
