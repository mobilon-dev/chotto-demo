<template>
    <button v-if="!userProfile.online" @mousedown="onlineUser">
      Открыть чат
    </button>
    <FloatContainer
      v-else
      :title="userProfile ? userProfile.name : ''"
      color-title="#d4d4d4"
      :avatar="userProfile ? userProfile.avatar : ''"
      height="700px"
      width="800px"
      @close-window="offlineUser"
    >
      <FeedLayout>
        <template #default>
          <chat-wrapper
            :is-open-chat-panel="isOpenChatPanel"
            :is-selected-chat="!!selectedChat"
          >
            <template #default>
              <ThemeMode
                :themes="themes"
                :show="true"
              />
              <Feed
                :button-params="selectedChat.countUnreadOut > 0 ? {unreadAmount: selectedChat.countUnreadOut} : null"
                :objects="messages"
                :scroll-to-bottom="isScrollToBottomOnUpdateObjectsEnabled"
                :typing="selectedChat.typingIn"
                :chat-background="chatBackground"
                @message-action="messageAction"
                @load-more="loadMore"
                @message-visible="messageVisible"
              />
              <ChatInput
                @send="addMessage"
                @typing="sendTyping"
              >
                <template #inline-buttons>
                  <ButtonCommandsSelector
                    :mode="'hover'"
                    :commands="commands"
                    @send="addMessage"
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
import { onMounted, ref, watch, computed } from "vue";
import { AuthClient } from "../api-client/AuthClient";
import {
  ChatInput,
  Feed,
  FloatContainer,
  FeedLayout,
  ChatWrapper,
  ThemeMode,
  ButtonCommandsSelector,
  formatTimestamp
} from "@mobilon-dev/chotto";

import chatBackground from '../../../../public/chat-background.svg';

import { useChatsStore } from "../../../stores/chatsStore";
import { useAuthStore } from "../store/authStore";
import { transformToFeed } from "../../../transform/transformToFeed";
import { useNewMessage } from "../useNewMessage";
import { ApiClient } from "../api-client/ApiClient";

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

const authClient = new AuthClient()

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
const authStore = useAuthStore()

// Reactive data
const apiClient = ref(null)
const selectedChat = ref(null);
const messages = ref([]);
const userProfile = ref({});
const isScrollToBottomOnUpdateObjectsEnabled = ref(false);
const filebumpUrl = ref('https://filebump2.services.mobilon.ru');
const isOpenChatPanel = ref(false);

const command = ref()
const step = ref()
const variableName = ref('')
const prompt = ref([])
const currentIncomingMessage = ref([])

const commands = computed(() => {
  if (selectedChat.value && selectedChat.value.commands) return selectedChat.value.commands
  else return null
})
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
    if (scrollFlag){
      isScrollToBottomOnUpdateObjectsEnabled.value = false
      setTimeout(() => {
        isScrollToBottomOnUpdateObjectsEnabled.value = true
      }, 20)
    }
      

    const messages = props.dataProvider.getFeed(selectedChat.value.chatId);
    const messages3 = transformToFeed(messages, props.index);
    const messages2 = messages3.map((m) => {
    return {
      ...m,
      position: m.direction === 'outgoing' ? 'right' : 'left',
    };
  });
    return messages2;
  } else {
    return [];
  }

};

const addMessage = async (message) => {
  console.log(message, selectedChat.value.chatId);
  // Добавление сообщения в хранилище
  if (message.text.startsWith('/')){
    addCommandMessage(message)
  }
  else{
    props.dataProvider.addMessage({
      text: message.text,
      type: message.type,
      chatId: selectedChat.value.chatId,
      senderId: props.index + 1,
      timestamp: Date.now()/ 1000,
      status: 'read',
      url: message.url,
      filename: message.filename,
      direction: 'outgoing',
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
    if (variableName.value != ''){
      localStorage.setItem(variableName.value, message.text)
      variableName.value = ''
    }
    if (step.value) {
      step.value += 1
      addCommandMessage({text: command.value})
    }
    messages.value = getFeedObjects(true); // Обновление сообщений
    newMessage.value = !newMessage.value

    if (apiClient.value && authStore.isAuthenticated){
      addResponseMessage(message)
    }
  }
  messages.value = getFeedObjects(true); // Обновление сообщений
  newMessage.value = !newMessage.value
};

const addResponseMessage = async (reqMessage) => {
  prompt.value.push({
    role: 'user',
    content: reqMessage.text,
    attachments: [],
  })
 chatsStore.setTypingIn(selectedChat.value.chatId, true)
      
  const response = await apiClient.value.sendStreamRequest('GigaChat',prompt.value,true,0.2)
  currentIncomingMessage.value = response
  let t = ''
  props.dataProvider.addMessage({
    text: t,
    type: 'message.text',
    chatId: selectedChat.value.chatId,
    direction: 'incoming',
    timestamp: Date.now()/ 1000,
  })
  const inter = setInterval(() => {
    if (response.length == 0){
      chatsStore.setTypingIn(selectedChat.value.chatId, false)
      clearInterval(inter)
    }
    else {
      t += response.shift()
      props.dataProvider.editMessage(t)
      messages.value = getFeedObjects(true); // Обновление сообщений
      newMessage.value = !newMessage.value
      if (response.length == 0)
        prompt.value.push({
          role:'assistant',
          content: t,
          attachments: [],
        })
    }
  }, 500)
  
}

const addCommandMessage = async (message, filter = null) => {
  if (command.value != message.text){
    step.value = undefined
    command.value = message.text
  }
  const msgTemplate = props.dataProvider.getCommandMessage(message.text, step.value, filter)
  if (message.text != '/tokens'){
    props.dataProvider.addMessage({
      text: msgTemplate.text,
      type: msgTemplate.type,
      timestamp: Date.now()/ 1000,
      chatId: selectedChat.value.chatId,
      status: 'read',
    })
  }

  if (msgTemplate.step && !msgTemplate.last) 
    step.value = msgTemplate.step
  else
    step.value = undefined

  if (msgTemplate.mode == 'input'){
    variableName.value = msgTemplate.value
  }

  if (msgTemplate.mode == 'request'){
    const response = await networkAccess(message.text)
    console.log(response)
    step.value += 1
    if (!response){
      addCommandMessage({text: '/error'})
      command.value = undefined
      step.value = undefined
    }
    else {
      if (command.value == '/auth') addCommandMessage({text: command.value}, 'success')
      if (command.value == '/tokens') {
        props.dataProvider.addMessage({
          text: msgTemplate.text + response,
          type: msgTemplate.type,
          timestamp: Date.now()/ 1000,
          chatId: selectedChat.value.chatId,
          status: 'read',
        })
      }
    }
    messages.value = getFeedObjects(true); // Обновление сообщений
    newMessage.value = !newMessage.value
  }
}

const networkAccess = async (postfix) => {
  switch(postfix){
    case '/auth': 
      let interval;
      clearInterval(interval)
      const response =  await authenticate()
      if (response) {
        interval = setInterval(async () => {
          const response = await authenticate()
          if (!response){
            clearInterval(interval)
          }
        }, 30  * 60 * 1000)
      }
      return response
    case '/tokens': 
      if (apiClient.value && authStore.isAuthenticated)
        return await apiClient.value.getAvailableTokens()
      else return false
  }
}

const authenticate = async () => {
  const response = await authClient.getToken(localStorage.getItem('CLIENT_ID'), localStorage.getItem('CLIENT_SECRET'))
  if (response) {
    authStore.setToken(response.access_token)
    apiClient.value = new ApiClient(response.access_token)
  }
  else {
    authStore.resetToken()
    apiClient.value = null
  }
  return response
}

onMounted(() => {
  userProfile.value = props.authProvider.getUserProfile(props.index);
  chatsStore.chats = props.dataProvider.getChats();
  selectedChat.value = chatsStore.chats[props.index]
  messages.value = getFeedObjects(false)
  themes[props.index].default = true
});
</script>
