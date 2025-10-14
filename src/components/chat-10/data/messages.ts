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
/**Chat 3 */
  {
    messageId: '30',
    header: 'Татьяна',
    senderId:3, chatId: 3, type: "message.text", text: "Направила уточнения по заявке",
    status: 'read', timestamp: '1727790000'
  },
  {
    messageId: '31',
    header: 'Борис',
    chatId: 3, type: "message.image", url: 'https://placehold.jp/30/336633/ffffff/480x240.png?text=скан',
    text: 'Вот скан', direction: 'incoming', status: 'received', timestamp: '1727795000'
  },
  {
    messageId: '32',
    header: 'Борис',
    chatId: 3, type: "message.text", text: "Добрый день! Подскажите по заявке...",
    direction: 'incoming', status: 'received', timestamp: '1727800000'
  },
/**Chat 4 */
  {
    messageId: '33',
    header: 'Василий',
    chatId: 4, type: "message.file", url: "https://axiomabio.com/pdf/test.pdf", filename: "Договор_черновик.pdf",
    status: 'received', direction: 'incoming', timestamp: '1727695000',
    avatar:'https://placehold.jp/30/2b87e8/ffffff/64x64.png?text=VP'
  },
  {
    chatId: 4,
    dialogId: 'dlg_6_new',
    messageId: '614',
    type: "message.text",
    text: "Уважаемые Алексей и Марина, Благодарим вас за оперативную подготовку обновлённой версии макетов (v.2.1). Мы провели внутренний ревью с маркетингом, продуктом и юзабилити-командой — в целом прогресс заметен, и многие замечания из предыдущей итерации учтены. Однако остаются важные моменты, которые необходимо доработать до финального согласования. Прошу вас внимательно ознакомиться с перечнем правок ниже. Для удобства я разделила их по разделам и приоритетам. Также прикрепляю PDF с аннотациями — там вы найдёте визуальные пояснения к каждому пункту.",
    direction: 'incoming',
    status: 'received',
    timestamp: '1757411101',
    header: 'Ярослав',
    subText: 'Ярослав',
    senderId: 5,
    avatar:'https://placehold.jp/30/1b97e4/ffffff/64x64.png?text=Jar',
  },
/**Chat 5 */
  {
    messageId: '35',
    header: 'Георгий',
    senderId: 5,
    chatId: 5, type: "message.audio", url: "https://file-examples.com/storage/fe40e015d566f1504935cfd/2017/11/file_example_MP3_700KB.mp3",
    status: 'received', direction: 'incoming', timestamp: '1727875000',
    transcript: { text: 'Скинул акты, проверь, пожалуйста' }
  },
  {
    messageId: '36',
    header: 'Татьяна',
    senderId:3, chatId: 5, type: "message.text", text: "Приняла, посмотрю позже",
    status: 'read', direction: 'outgoing', timestamp: '1727877000'
  },
  {
    messageId: '37',
    header: 'Радий',
    chatId: 5, type: "message.text", text: "Проверь, пожалуйста, акты за сентябрь",
    status: 'received', direction: 'incoming', timestamp: '1727880000'
  },
/**Chat 6 */
  {
    messageId: '38',
    header: 'Виталий',
    chatId: 6, type: "message.video", url: "https://filebump2.services.mobilon.ru/file/i3UQnryC89WwxtigxSUXWq0ltJBhLfJXp5hT",
    views: 245, alt: 'Пример видео', text: 'Посмотри демо',
    status: 'received', direction: 'incoming', timestamp: '1727595000'
  },
  {
    messageId: '39',
    header: 'Татьяна',
    senderId:3, chatId: 6, type: "message.text", text: "Дедлайн перенесли на пятницу",
    direction: 'outgoing', status: 'sent', timestamp: '1727600000'
  },
];
