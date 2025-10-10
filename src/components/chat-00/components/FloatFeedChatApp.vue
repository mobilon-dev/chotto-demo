<template>
  <button
    class="button-open-chat"
    v-if="!userProfile.online"
    @mousedown="onlineUser"
  >
    Открыть чат
  </button>
  <FloatContainer
    v-else
    :title="userProfile ? userProfile.name : ''"
    color-title="#d4d4d4"
    :avatar="userProfile ? userProfile.avatar : ''"
    height="600px"
    width="700px"
    @close-window="offlineUser"
  >
    <FeedLayout>
      <template #default>
        <chat-wrapper :is-selected-chat="!!selectedChat">
          <template #default>
            <ThemeMode
              :themes="themes"
              :show="true"
            />
            <Feed
              :button-params="selectedChat.countUnreadOut > 0 ? { unreadAmount: selectedChat.countUnreadOut } : null"
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
              @send="addMessage"
              @typing="sendTyping"
            >
              <template #buttons>
                <FileUploader :filebump-url="filebumpUrl" />
                <ButtonEmojiPicker :mode="'hover'" />
                <ButtonTemplateSelector
                  :templates="templates"
                  :group-templates="groupTemplates"
                  :mode="'click'"
                  :state="'active'"
                />
                <ButtonWabaTemplateSelector
                  :waba-templates="wabaTemplates"
                  :group-templates="groupTemplates"
                  :mode="'click'"
                  :state="'active'"
                  :filebump-url="filebumpUrl"
                  @send-waba-values="sendWabaValues"
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
import { onMounted, ref, watch } from "vue";

import {
  ChatInput,
  Feed,
  FloatContainer,
  FeedLayout,
  FileUploader,
  ButtonEmojiPicker,
  ChatWrapper,
  ButtonTemplateSelector,
  ButtonWabaTemplateSelector,
  ThemeMode,
  formatTimestamp
} from "@mobilon-dev/chotto";

import chatBackground from '../../../../public/chat-background.svg';

import { useChatsStore } from "../../../stores/chatsStore";
import { transformToFeed } from "../../../transform/transformToFeed";
import { useNewMessage } from "../useNewMessage";

const { newMessage } = useNewMessage()

watch(
  () => newMessage.value,
  () => {
    if (messages.value.length != getFeedObjects(false).length) {
      messages.value = getFeedObjects(true);
    }
    else messages.value = getFeedObjects(false);
  },
)

const emit = defineEmits(['typing', 'add-message'])

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
  },
  chat: {
    type: Object,
    required: true,
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
const selectedChat = ref(null)
const messages = ref([]);
const userProfile = ref({});
const templates = ref([]);
const wabaTemplates = ref([])
const groupTemplates = ref([])
const isScrollToBottomOnUpdateObjectsEnabled = ref(false);
const filebumpUrl = ref('https://filebump2.services.mobilon.ru');

const offlineUser = () => {
  userProfile.value.online = false
}

const onlineUser = () => {
  userProfile.value.online = true
}

const messageAction = (data) => {
  console.log("message action", data);
};

const messageVisible = (message) => {
  if (message.chatId && message.chatId !== selectedChat.value.chatId) {
    if (message.senderId != props.index + 1 && message.status == 'received' && message.position == 'left') {
      chatsStore.readCurrentMessage(selectedChat.value.chatId, message)
      chatsStore.decreaseUnreadCounterOut(selectedChat.value.chatId, 1)
      newMessage.value = !newMessage.value
    }
  }
}

let timer;
const sendTyping = () => {
  emit('typing', selectedChat.value.chatId, true)
  clearTimeout(timer)
  timer = setTimeout(() => {
    emit('typing', selectedChat.value.chatId, false)
  }, 5000)
}

const loadMore = () => {
  console.log("load more");
};

const getFeedObjects = (scrollFlag) => {
  if (selectedChat.value) {
    isScrollToBottomOnUpdateObjectsEnabled.value = scrollFlag
    const messages = props.dataProvider.getFeed(selectedChat.value.chatId);
    const messages3 = transformToFeed(messages, props.index);
    return messages3;
  } else {
    return [];
  }
};

const addMessage = (message) => {
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
  messages.value = getFeedObjects();
  chatsStore.updateChatNewMessage(
    selectedChat.value.chatId,
    0,
    message.text,
    formatTimestamp(Date.now() / 1000),
    Date.now() / 1000,
    'received',
  )
};

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

onMounted(() => {
  userProfile.value = props.authProvider.getUserProfile(props.index);
  chatsStore.chats = props.dataProvider.getChats();
  selectedChat.value = chatsStore.chats[props.index]
  templates.value = props.dataProvider.getTemplates()
  wabaTemplates.value = props.dataProvider.getWABATemplates()
  groupTemplates.value = props.dataProvider.getGroupTemplates()
  messages.value = getFeedObjects(false)
  themes[props.index].default = true
});
</script>

<style>
.button-open-chat {
  display: block;
}
</style>