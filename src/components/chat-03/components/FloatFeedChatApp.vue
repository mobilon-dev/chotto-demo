<template>
    <button v-if="!userProfile.online" @mousedown="onlineUser">
      Открыть чат
    </button>
    <FloatContainer
      v-else
      :title="userProfile ? userProfile.name : ''"
      color-title="#d4d4d4"
      :avatar="userProfile ? userProfile.avatar : ''"
      height="500px"
      width="500px"
      @close-window="offlineUser"
    >
      <template #controls>
        <ButtonContextMenu
          :actions="actions"
          :mode="'click'"
          :menu-side="'bottom'"
          :context-menu-key="'top-actions'"
          @click="headerButtonClick"
        >
          <span class="pi pi-list header-bcm"></span>
        </ButtonContextMenu>

      </template>
      <FeedLayout>
        <template #default>
          <chat-wrapper
            :is-open-chat-panel="isOpenChatPanel"
            :is-selected-chat="!!selectedChat"
          >
            <template #default>
              <ThemeMode
                :themes="themes"
                :show="false"
              />
              <FeedSearch 
                v-if="isOpenSearchPanel"
                :is-feed-location="true"
                @search="searchMessages"
                @cancel="isOpenSearchPanel = !isOpenSearchPanel"
                @switch="isShowFeedWhileSearch = !isShowFeedWhileSearch"
              />
              <FeedFoundObjects
                v-if="isOpenSearchPanel && !isShowFeedWhileSearch"
                :not-found="notFoundMessage"
                :objects="foundMessages"
                :foundAmount="foundMessages.length"
                @clicked-search="handleClickMessage"
              />
              <Feed
                v-if="!isOpenSearchPanel || isShowFeedWhileSearch"
                :button-params="selectedChat.countUnreadOut > 0 ? {unreadAmount: selectedChat.countUnreadOut} : null"
                :objects="messages"
                :scroll-to-bottom="isScrollToBottomOnUpdateObjectsEnabled"
                :typing="selectedChat.typingIn"
                :scroll-to="clickedMessage"
                :enable-double-click-reply="true"
                @message-action="messageAction"
                @load-more="loadMore"
                @message-visible="messageVisible"
              />
              <ChatInput
                :state="'disabled'"
                @send="addMessage"
                @typing="sendTyping"
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
                </template>
              </ChatInput>
            </template>
          </chat-wrapper>
        </template>
      </FeedLayout>
    </FloatContainer>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from "vue";

import {
  ChatInput,
  Feed,
  FloatContainer,
  FeedLayout,
  FileUploader,
  ButtonEmojiPicker,
  ChatWrapper,
  playNotificationAudio,
  formatTimestamp,
  ThemeMode,
  ButtonContextMenu,
  FeedSearch,
  FeedFoundObjects,
} from "@mobilon-dev/chotto";

import { useChatsStore } from "../../../stores/chatsStore";
import { transformToFeed } from "../../../transform/transformToFeed";
import { useNewMessage } from "../useNewMessage";

const {newMessage} = useNewMessage()

watch(
  () => newMessage.value,
  () => {
    if (messages.value.length != getFeedObjects(false).length){
      messages.value = getFeedObjects(true);
    }
    else messages.value = getFeedObjects(false);
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
    code: "custom",
    name: "custom",
  },
];
const chatsStore = useChatsStore();

// Reactive data
const selectedChat = ref(null);
const messages = ref([]);
const userProfile = ref({});
const isScrollToBottomOnUpdateObjectsEnabled = ref(false);
const filebumpUrl = ref('https://filebump2.services.mobilon.ru');
const isOpenChatPanel = ref(false);

const isOpenSearchPanel = ref(false)
const isShowFeedWhileSearch = ref(false)
const notFoundMessage = ref(false)
const clickedMessage = ref('')
const foundMessages = ref([])
const actions = [
  {action: 'search', title: 'Поиск'},
];

const headerButtonClick = (action) => {
  console.log(action)
  if (action.action == 'search' && selectedChat.value != null) isOpenSearchPanel.value = !isOpenSearchPanel.value
}

const searchMessages = (string) => {
  if (string && string.length > 0){
    isShowFeedWhileSearch.value = false
    foundMessages.value = transformToFeed(props.dataProvider.getMessagesBySearch(selectedChat.value.chatId, string))
    foundMessages.value = foundMessages.value.reverse()
    notFoundMessage.value = false
    if (foundMessages.value.length == 0) 
      notFoundMessage.value = true

    if (foundMessages.value.length > 0){
      let t = []
      for (let m of foundMessages.value){
        if (m.direction == 'outgoing') m.subtext = userProfile.value.name
        else m.subtext = "Татьяна"
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
  isShowFeedWhileSearch.value = true
  const message = messages.value.find((m) => {
    if (m.messageId == messageId) return m
    })
  if (!message) {
    const messages1 = props.dataProvider.getFeedByMessage(selectedChat.value.chatId, messageId)
    messages.value = transformToFeed(messages1)
  }
  setTimeout(() => {
    highlightMessage(messageId)
  }, 150)
}

let timer1
const highlightMessage = (messageId) => {
  clearTimeout(timer1)
  const message = messages.value.find((m) => {
      if (m.messageId == messageId) return m
    })
  if (message) {
    clickedMessage.value = JSON.stringify(message)
    timer1 = setTimeout(() => {
      clickedMessage.value = ''
    }, 100)
  }
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

const messageAction = (data) => {
  console.log("message action", data);
};

const messageVisible = (message) => {
  if (message.chatId && message.chatId == selectedChat.value.chatId){
    if (message.senderId != props.index + 1 && message.status == 'received' && message.position == 'left'){
      chatsStore.readCurrentMessage(selectedChat.value.chatId, message)
      chatsStore.decreaseUnreadCounterOut(selectedChat.value.chatId, 1)
      newMessage.value = !newMessage.value
    }
  }
}

let timer;
const sendTyping = () => {
  chatsStore.setTyping(selectedChat.value.chatId, true)
  clearTimeout(timer)
  timer = setTimeout(() => {
    chatsStore.setTyping(selectedChat.value.chatId, false)
  },5000)
}

const loadMore = () => {
  // do load more messages to feed
  console.log("load more");
};

const getFeedObjects = (scrollFlag) => {
  if (selectedChat.value) {
    // здесь обработка для передачи сообщений в feed
    isScrollToBottomOnUpdateObjectsEnabled.value = scrollFlag
    const messages = props.dataProvider.getFeed(selectedChat.value.chatId);
    const messages3 = transformToFeed(messages, props.index);
    return messages3;
  } else {
    return [];
  }

};

const addMessage = (message) => {
  console.log(message, selectedChat.value.chatId);
  // Добавление сообщения в хранилище

  props.dataProvider.addMessage({
    text: message.text,
    type: message.type,
    reply: message.reply,
    header: userProfile.value.name,
    chatId: selectedChat.value.chatId,
    senderId: props.index + 1,
    timestamp: Date.now()/ 1000,
    status: 'received',
    url: message.url,
    filename: message.filename,
  });
  const chatMessageText = message.text == '' ? '↺ ' + message.filename : message.text
  chatsStore.updateChatNewMessage(
    selectedChat.value.chatId, 
    1, 
    chatMessageText, 
    formatTimestamp(Date.now()/ 1000),
    Date.now()/ 1000,
    'in'
  )
  messages.value = getFeedObjects(true); // Обновление сообщений
  newMessage.value = !newMessage.value
};

onMounted(() => {
  userProfile.value = props.authProvider.getUserProfile(props.index);
  chatsStore.chats = props.dataProvider.getChats();
  selectedChat.value = chatsStore.chats[props.index]
  messages.value = getFeedObjects(false)
  themes[props.index].default = true
});
</script>

<style>
.header-bcm{
  padding: 14px;
  cursor: pointer;
}
</style>
