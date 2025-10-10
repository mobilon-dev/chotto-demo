<template>
  <div>
    <button v-if="!userProfile.online" @mousedown="onlineUser">
      Открыть чат
    </button>
    <FloatContainer
      v-else
      :title="userProfile ? userProfile.name : ''"
      color-title="#d4d4d4"
      :avatar="userProfile ? userProfile.avatar : ''"
      height="700px"
      width="900px"
      @close-window="offlineUser"
    >
      <BaseLayout>

        <template #first-col>
          <UserProfile :user="userProfile" />
          <ChatList
            :chats="chatsStore.chats"
            filter-enabled
            @select="selectChat"
            @expand="expandChat"
            @action="chatAction"
          />
          <ThemeMode
            :themes="themes"
            :show="true"
            @selected-theme="setTheme"
          />
        </template>

        <template #second-col>
          <chat-wrapper
            :is-open-chat-panel="isOpenChatPanel"
            :is-selected-chat="!!selectedChat"
          >
            <template #default>
              <ChatInfo
                :chat="selectedChat"
               >
               <template #actions>
                  <div style="display: flex;">
                    <button
                      class="chat-info__button-panel"
                      @click="isOpenChatPanel = !isOpenChatPanel"
                    >
                      <span class="pi pi-info-circle" />
                    </button>
                  </div>
                </template>
              </ChatInfo> 
              
              <Feed
                :button-params="selectedChat.countUnread > 0 ? {unreadAmount: selectedChat.countUnread} : null"
                :objects="messages"
                :scroll-to-bottom="isScrollToBottomOnUpdateObjectsEnabled"
                :typing="selectedChat.typing"
                :enable-double-click-reply="true"
                :chat-background="chatBackground"
                @message-action="messageAction"
                @load-more="loadMore"
                @message-visible="messageVisible"
              >
                <template #empty-feed>
                  <SplashScreen @action="resetSelectedChat">
                      <template #title>
                        <h3>Нет сообщений</h3>
                      </template>
                      <template #text>
                        <span style="max-width: 300px; display: block;">Вы можете отправить новое сообщение или нажать на кота для выхода</span>
                      </template>
                      <template #picture>
                        <img 
                          src="https://filebump2.services.mobilon.ru/file/J2PDOO0mtcsK2v7J3z6tGJ2ttG1IwtlYnHLU/"
                          width="196"
                          height="196"
                        >
                      </template>
                    </SplashScreen>
                </template>
              </Feed>
              <ChatInput
                @send="addMessage"
                @typing="sendTyping"
              >
                <template #buttons>
                  <FileUploader
                    :filebump-url="filebumpUrl"
                  />
                  <ButtonEmojiPicker 
                    :mode="'hover'"
                  />
                  <ButtonTemplateSelector
                    :templates="templates.templates"
                    :mode="'click'"
                  />
                  
                </template>
              </ChatInput>
            </template>

            <template #placeholder>
              <SplashScreen @action="selectActualChatDialog">
                <template #title>
                  <h3>Привет!</h3>
                </template>
                <template #text>
                  <span style="max-width: 250px; display: block">Выберите чат и диалог из списка слева или нажмите на кошку</span>
                </template>
                <template #picture>
                  <img 
                    src="https://filebump2.services.mobilon.ru/file/kUvCq3FDfVXR5UsJ1rB9Z7eFk23Xy3bqyQEZ"
                    width="196"
                    height="196"
                  >
                </template>
              </SplashScreen>
            </template>

            <template #chatpanel>
              <ChatPanel
                v-if="isOpenChatPanel"
                :title="selectedChat.name"
                @close-panel="isOpenChatPanel = !isOpenChatPanel"
              >
                <template #content>
                  Информация
                </template>
              </ChatPanel>
            </template>
          </chat-wrapper>
        </template>
      </BaseLayout>
    </FloatContainer>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from "vue";

import {
  ChatInfo,
  ChatInput,
  ChatList,
  Feed,
  UserProfile,
  ChatPanel,
  FloatContainer,
  ChatWrapper,
  BaseLayout,
  FileUploader,
  ButtonEmojiPicker,
  ButtonTemplateSelector,
  ThemeMode,
  SplashScreen,
  formatTimestamp
} from "@mobilon-dev/chotto";

import chatBackground from '../../../../public/chat-background.svg';

import { useChatsStore } from "../../../stores/chatsStore";
import { transformToFeed } from "../../../transform/transformToFeed";
import { useNewMessage } from "../useNewMessage";

const {newMessage} = useNewMessage()

watch(
  () => newMessage.value,
  () => {
    messages.value = getFeedObjects();
  },
)

// Define props
const props = defineProps({
  authProvider: {
    type: Object,
    required: true,
  },
  dataProvider: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true
  }
});

const themes = [
  {
    code: "light",
    name: "Light",
  },
  {
    code: "dark",
    name: "Dark",
  },
  {
    code: "green",
    name: "Green",
  },
  {
    code: "mobilon1",
    name: "mobilon1",
  },
];
const chatsStore = useChatsStore();

// Reactive data
const selectedChat = ref(null);
const selectedDialog = ref(null)
const messages = ref([]);
const userProfile = ref({});
const templates = ref([]);
const isOpenChatPanel = ref(false);
const isScrollToBottomOnUpdateObjectsEnabled = ref(false);
const filebumpUrl = ref('https://filebump2.services.mobilon.ru');

const theme = ref('')
const setTheme = (themeCode) => {
  theme.value = themeCode
}

const offlineUser = () => {
  userProfile.value.online = false
  userProfile.value.status = 'gray'
  props.authProvider.setUserProfileOnline(props.index, false);
  chatsStore.setStatus(selectedChat.value.chatId, 'gray')
}

const onlineUser = () => {
  userProfile.value.online = true
  userProfile.value.status = 'lightgreen'
  props.authProvider.setUserProfileOnline(props.index, true);
  chatsStore.setStatus(selectedChat.value.chatId, 'lightgreen')
}

const chatAction = async (data) => {
  console.log("chat action", data);
};

const messageAction = (data) => {
  console.log("message action", data);
};

const messageVisible = (message) => {
  if (message.chatId && message.chatId == selectedChat.value.chatId){
    if (message.senderId != props.index + 1 && message.status == 'received' && message.position == 'left'){
      chatsStore.readCurrentMessage(selectedChat.value.chatId, message)
      chatsStore.decreaseUnreadCounter(selectedChat.value.chatId, 1)
      chatsStore.decreaseDialogUnreadCounter(selectedChat.value.chatId, selectedDialog.value.dialogId, 1)
      newMessage.value = !newMessage.value
    }
  }
}

const loadMore = () => {
  // do load more messages to feed
  console.log("load more");
};

const getFeedObjects = () => {

  if (selectedChat.value && selectedDialog.value) {
    // здесь обработка для передачи сообщений в feed
    isScrollToBottomOnUpdateObjectsEnabled.value = true;
    const messages1 = props.dataProvider.getFeed(selectedChat.value.chatId, selectedDialog.value.dialogId);
    const messages3 = transformToFeed(messages1, props.index);
    if (JSON.stringify(messages.value) != JSON.stringify(messages3))
      nextTick(() => {
        newMessage.value = !newMessage.value
      })
    return messages3;
  } else {
    return [];
  }
};

const addMessage = (message) => {
  console.log(message);
  // Добавление сообщения в хранилище
  props.dataProvider.addMessage({
    text: message.text,
    type: message.type,
    reply: message.reply,
    header: userProfile.value.name,
    chatId: selectedChat.value.chatId,
    dialogId: selectedDialog.value.dialogId,
    senderId: props.index + 1,
    timestamp: Date.now() / 1000,
    status: 'received',
    url: message.url,
    filename: message.filename,
  });
  newMessage.value = !newMessage.value
  messages.value = getFeedObjects(); // Обновление сообщений
  const chatMessageText = message.text == '' ? '↺ ' + message.filename : message.text
  chatsStore.updateChatNewMessage(
    selectedChat.value.chatId, 
    0, 
    chatMessageText, 
    formatTimestamp(Date.now()/ 1000),
    Date.now()/ 1000,
    'received',
  )
  //chatsStore.increaseUnreadCounterOut(selectedChat.value.chatId, 1)
};

let timer;
const sendTyping = () => {
  chatsStore.setTypingIn(selectedChat.value.chatId, true)
  clearTimeout(timer)
  timer = setTimeout(() => {
    chatsStore.setTypingIn(selectedChat.value.chatId, false)
  },5000)
}

const selectChat = async (args) => {
  if (args.dialog){
    for (let chat of chatsStore.chats){

      if (args.chat != chat){
        chat.dialogsExpanded = false
        chat.isSelected = false
      }
      if (chat.dialogs && chat.dialogs.length > 0){
        for (let dialog of chat.dialogs){
          if (args.dialog != dialog)
            dialog.isSelected = false
        }
      }
    }
    selectedChat.value = args.chat;
    selectedDialog.value = args.dialog;
    if (selectedChat.value.countUnread > 0 || selectedDialog.value.countUnread > 0){
      chatsStore.decreaseUnreadCounter(args.chat.chatId, args.dialog.countUnread);
      chatsStore.setDialogUnreadCounter(args.chat.chatId,args.dialog.dialogId, 0)
      //chatsStore.readMessages(args.chat.chatId, props.index + 1)
    }
    messages.value = getFeedObjects(); // Обновляем сообщения при выборе контакта
  }
  else {
    for (let chat of chatsStore.chats){
      if (chat == args.chat) {
        chat.isSelected = false
        selectedDialog.value = null
        selectedChat.value = null
      }
    }
  }
};

const expandChat = (args) => {
  console.log(args)
  for (let chat of chatsStore.chats){
    if (chat.chatId != args.chatId) chat.dialogsExpanded = false
    else chat.dialogsExpanded = !chat.dialogsExpanded
  }
}

const selectActualChatDialog = () => {
  const chats = chatsStore.chats
    .toSorted((a, b) => {
      if (Number(a['lastActivity.timestamp']) > Number(b['lastActivity.timestamp'])) return -1;
      if (Number(a['lastActivity.timestamp']) < Number(b['lastActivity.timestamp'])) return 1;
      if (Number(a['lastActivity.timestamp']) == Number(b['lastActivity.timestamp'])) return 0;
    })
    .toSorted((a, b) => {   // immutable sort
      if (a.countUnread > b.countUnread) return -1;
      if (a.countUnread < b.countUnread) return 1;
      if (a.countUnread == b.countUnread) return 0;
    })
  for (let chat of chats){
    if (chat.dialogs && chat.dialogs.length > 0){
      for (let dialog of chat.dialogs){
        if (dialog.defaultSelected){
          chat.isSelected = true
          dialog.isSelected = true
          chat.dialogsExpanded = true
          selectChat({chat: chat, dialog: dialog})
        }
      }
    }
  }
}

const resetSelectedChat = () => {
  selectedChat.value = null
  selectedDialog.value = null
  for (let chat of chatsStore.chats){
    chat.dialogsExpanded = false
    chat.isSelected = false
    if (chat.dialogs && chat.dialogs.length > 0){
      for (let dialog of chat.dialogs){
        dialog.isSelected = false
      }
    }
  }
}

onMounted(() => {
  userProfile.value = props.authProvider.getUserProfile(props.index);
  chatsStore.chats = props.dataProvider.getChats();
  templates.value = props.dataProvider.getTemplates()
  selectActualChatDialog()
});
</script>
