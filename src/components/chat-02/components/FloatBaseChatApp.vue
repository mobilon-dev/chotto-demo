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
      height="850px"
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
                />
              <ChatInput
                :state="stateButtons"
                @send="addMessage"
                @typing="sendTyping"
              >
                <template #buttons>
                  <FileUploader
                    :filebump-url="filebumpUrl"
                    :state="stateButtons"
                  />
                  <ButtonEmojiPicker 
                    :mode="'hover'"
                    :state="stateButtons"
                  />
                  <ButtonWabaTemplateSelector
                    :waba-templates="templates.wabaTemplates"
                    :group-templates="templates.groups"
                    :mode="'click'"
                    :state="stateTemplate"
                    @send-waba-values="sendWabaValues"
                    :filebump-url="filebumpUrl"
                  />
                  <ChannelSelector 
                    :channels="channels"
                    :mode="'hover'"
                    :state="'active'"
                    @select-channel="selectChannel"
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
import { onMounted, ref, watch, nextTick, computed } from "vue";

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
  ChannelSelector,
  ThemeMode,
  ButtonWabaTemplateSelector,
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
const selectedChannel = ref(null)
const messages = ref([]);
const userProfile = ref({});
const channels = ref([]);
const templates = ref([]);
const isOpenChatPanel = ref(false);
const isScrollToBottomOnUpdateObjectsEnabled = ref(false);
const filebumpUrl = ref('https://filebump2.services.mobilon.ru');

const stateTemplate = computed(() => {
  if (selectedChannel.value){
    if (selectedChannel.value.channelId == 'channelWABA')
      return 'active'
  }
  return 'disabled'
})

const stateButtons = computed(() => {
  if (selectedChannel.value){
    if (messages.value.length > 2 || selectedChannel.value.channelId == 'channelSMS' ) {
      return 'active'
    } 
  }
  return 'disabled'
})

const sendWabaValues = (obj) => {
  console.log('send waba values', obj);
  const messageObject = {
      type: '',
      text: '',
      url: '',
      filename: '',
      size: '',
    };

    if (obj.file) {
      messageObject.type = 'message.' + obj.file.filetype;
      messageObject.url = obj.file.url;
      messageObject.filename = obj.file.filename;
      messageObject.size = obj.file.filesize.toString();
      messageObject.text = obj.text.trim();
    } else {
      messageObject.type = 'message.text';
      messageObject.text = obj.text.trim();
    }

  addMessage(messageObject)
}

const selectChannel = (channel) => {
  selectedChannel.value = channel
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
      chatsStore.decreaseUnreadCounter(selectedChat.value.chatId, 1)
      newMessage.value = !newMessage.value
    }
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

let timer;
const sendTyping = () => {
  chatsStore.setTypingIn(selectedChat.value.chatId, true)
  clearTimeout(timer)
  timer = setTimeout(() => {
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
  channels.value = props.dataProvider.getChannels();
  templates.value = props.dataProvider.getTemplates()
});
</script>
