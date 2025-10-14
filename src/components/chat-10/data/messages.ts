export const messages = [
/**Chat 1 */
  {
    messageId: '2',
    senderId:1, chatId: 1, type: "message.text", text: "Созвонимся сегодня?", status: 'read', timestamp: '1727027859',
    actions: [
      { action: 'edit', title: 'изменить', icon: 'https://placehold.jp/30/336633/ffffff/64x64.png?text=pin' },
      { action: 'delete', title: 'удалить' }],
    header: 'Юрий',
  },
  {
    messageId: '3',
    header: 'Татьяна',
    senderId:3,chatId: 1, type: "message.text", text: "Привет! Давай сейчас",
    status: 'read', timestamp: '1727028959',
    actions: [
      { action: 'edit', title: 'изменить', icon: 'https://placehold.jp/30/336633/ffffff/64x64.png?text=pin' },
      { action: 'delete', title: 'удалить' }]
  },
  {
    messageId: '4',
    header: 'Татьяна',
    chatId: 1, senderId:3, type: "message.video", url: "https://filebump2.services.mobilon.ru/file/i3UQnryC89WwxtigxSUXWq0ltJBhLfJXp5hT",
    direction: 'outgoing', status: 'read', timestamp: '1727087959',views: 1667,alt: "Example Video",
    text: 'Посмотри это видео, пожалуйста'
  },
  {
    senderId:1, chatId: 1, url: 'https://placehold.jp/30/336633/ffffff/320x160.png?text=кроссовки',
    type: "message.image", text: "классное фото, тоже такие хочу",
    messageId: '20',
    header: 'Юрий',
    direction: 'outgoing', status: 'received', timestamp: '1727027959',
  },
  {
    chatId: 1,senderId:3, type: "message.text", text: "Привет! Извини, давно тебе не писала. Как дела?",
    direction: 'incoming', status: 'received', timestamp: '1727027959',
    messageId: '21',
    header: 'Татьяна',
  },
/**Chat 2 */
  {
    messageId: '6',
    header: 'Татьяна',
    senderId:3,chatId: 2, text:'Привет! Можешь распечатать?',type: "message.file", url: "https://axiomabio.com/pdf/test.pdf", filename: "Документ.pdf",
    status: 'read', timestamp: '1727026959', actions: [{ action: 'edit', title: 'изменить' }, { action: 'delete', title: 'удалить' }]
  },
  { 
    messageId: '7',
    header: 'Татьяна',
    senderId:3,chatId: 2, type: "message.text", text: "Очень нужно!", status: 'read', timestamp: '1727027969' },
  {
    messageId: '8',
    header: 'Алексей',
    senderId:2,chatId: 2, type: "message.audio", url: "https://file-examples.com/storage/fe40e015d566f1504935cfd/2017/11/file_example_MP3_700KB.mp3",
    status: 'received', timestamp: '1727527159',
    actions: [{ action: 'edit', title: 'изменить' }, { action: 'delete', title: 'удалить' }],
    transcript: {
      text: 'Хорошо, заходи через полчаса',
    },
  },
];
