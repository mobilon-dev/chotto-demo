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
            v-if="!isOpenSearchPanel"
            :chats="chatsStore.chats"
            filter-enabled
            @select="selectChat"
          />
          <FeedSearch 
            v-if="isOpenSearchPanel"
            @search="searchMessages"
            @cancel="isOpenSearchPanel = !isOpenSearchPanel"
          />
          <FeedFoundObjects
            v-if="isOpenSearchPanel"
            :not-found="notFoundMessage"
            :objects="foundMessages"
            :foundAmount="foundMessages.length"
            @clicked-search="handleClickMessage"
          />
          <ThemeMode
            :themes="themes"
            :show="true"
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
                    <button
                      class="chat-info__button-panel"
                      @click="isOpenSearchPanel = !isOpenSearchPanel"
                    >
                      <span class="pi pi-search" />
                    </button>
                  </div>
                </template>
              </ChatInfo> 
              
              <Feed
                :button-params="selectedChat.countUnread > 0 ? {unreadAmount: selectedChat.countUnread} : null"
                :objects="messages"
                :scroll-to-bottom="isScrollToBottomOnUpdateObjectsEnabled"
                :typing="selectedChat.typing"
                :scroll-to="clickedMessage"
                :enable-double-click-reply="true"
                :chat-background="chatBackground"
                @message-action="messageAction"
                @load-more="loadMore"
                @message-visible="messageVisible"
                />
              <ChatInput
                @send="addMessage"
                @typing="sendTyping"
                :state="'disabled'"
              >
                <template #buttons>
                  <FileUploader
                    :filebump-url="filebumpUrl"
                    :state="'disabled'"
                  />
                  <ButtonEmojiPicker 
                    :mode="'hover'"
                    :state="'disabled'"
                  />
                  <ButtonTemplateSelector
                    :mode="'click'"
                    :state="'disabled'"
                  />
                </template>
              </ChatInput>
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
  FeedSearch,
  FeedFoundObjects,
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
const messages = ref([]);
const userProfile = ref({});
const isOpenChatPanel = ref(false);
const isScrollToBottomOnUpdateObjectsEnabled = ref(false);
const isOpenSearchPanel = ref(false)
const foundMessages = ref([])
const notFoundMessage = ref(false)
const clickedMessage = ref('')
const filebumpUrl = ref('https://filebump2.services.mobilon.ru');

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


const messageAction = (data) => {
  console.log("message action", data);
};

const messageVisible = (message) => {
  if (message.chatId && message.chatId == selectedChat.value.chatId){
    if (message.senderId != props.index + 1 && message.status == 'received' && message.position == 'left'){
      chatsStore.readCurrentMessage(selectedChat.value.chatId, message)
      chatsStore.decreaseUnreadCounter(selectedChat.value.chatId, 1)
      newMessage.value = !newMessage.value
    }
  }
}

const searchMessages = (string) => {
  if (string && string.length > 0){
    foundMessages.value = transformToFeed(props.dataProvider.getMessagesBySearch(selectedChat.value.chatId, string))
    foundMessages.value = foundMessages.value.reverse()
    notFoundMessage.value = false
    if (foundMessages.value.length == 0) 
      notFoundMessage.value = true

    if (foundMessages.value.length > 0){
      let t = []
      for (let m of foundMessages.value){
        if (m.senderId != 4) m.subtext = selectedChat.value.name
        if (m.senderId == 4) m.subtext = userProfile.value.name
        if (m.type != 'system.date' && m.type != 'message.system') t.push(m)
      }
      foundMessages.value = t
    }
  }
  else {
    foundMessages.value = []
  }
}

const handleClickMessage = (messageId) => {
  const message = messages.value.find((m) => {
    if (m.messageId == messageId) return m
    })
  if (!message) {
    const messages1 = props.dataProvider.getFeedByMessage(selectedChat.value.chatId, messageId)
    messages.value = transformToFeed(messages1)
  }
  setTimeout(() => {
      highlightMessage(messageId)
  }, 50)
}

let timer
const highlightMessage = (messageId) => {
  clearTimeout(timer)
  const message = messages.value.find((m) => {
      if (m.messageId == messageId) return m
    })
  if (message) {
    clickedMessage.value = JSON.stringify(message)
    timer = setTimeout(() => {
      clickedMessage.value = ''
    }, 100)
  }
}

const loadMore = () => {
  // do load more messages to feed
  console.log("load more");
};

const getFeedObjects = () => {

  if (selectedChat.value) {
    // здесь обработка для передачи сообщений в feed
    isScrollToBottomOnUpdateObjectsEnabled.value = true;
    const messages1 = props.dataProvider.getFeed(selectedChat.value.chatId);
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
  chatsStore.increaseUnreadCounterOut(selectedChat.value.chatId, 1)
};

let timer2;
const sendTyping = () => {
  chatsStore.setTypingIn(selectedChat.value.chatId, true)
  clearTimeout(timer2)
  timer2 = setTimeout(() => {
    chatsStore.setTypingIn(selectedChat.value.chatId, false)
  },5000)
}

const selectChat = (args) => {
  selectedChat.value = args.chat;
  if (selectedChat.value.countUnread > 0){
    chatsStore.setUnreadCounter(args.chat.chatId, 0);
    chatsStore.readMessages(args.chat.chatId, props.index + 1)
  }
  messages.value = getFeedObjects(); // Обновляем сообщения при выборе контакта
};

onMounted(() => {
  userProfile.value = props.authProvider.getUserProfile(props.index);
  chatsStore.chats = props.dataProvider.getChats();
});
</script>
