<template>
  <div>
    <BaseContainer
      ref="refContainer"
      height="90vh"
    >
    <AdaptiveExtendedLayout
        :is-second-col-visible="isSecondColVisible"
        :is-third-col-visible="isThirdColVisible"
      >
        <template #first-col>
          <SideBar
            v-if="sidebarFirstCol"
            :sidebar-items="sidebarItems"
          />
          <ThemeMode
            :themes="themes"
            :show="true"
          />
        </template>

        <template #second-col>
          <UserProfile :user="userProfile" />
          <div class="chat-list-title-container">
            <h2>
              Чаты
            </h2>
            <ButtonContextMenu 
              v-if="actions"
              :actions="actions"
              mode="hover"
              menuSide="right"
            >
              <span class="pi pi-plus bcm-chat-action"></span>
            </ButtonContextMenu>

          </div>
          
          <ChatList
            v-if="!isOpenSearchPanel || (isOpenSearchPanel && feedSearchFeedCol)"
            ref="refChatList"
            :chats="chatsStore.chats"
            filter-enabled
            :title-enabled="false"
            @select="selectChat"
          >
            <template #sidebar>
              <SideBar
                v-if="!sidebarFirstCol"
                horizontal
                :sidebar-items="sidebarItems"
              />
            </template>
          </ChatList>
          <FeedSearch 
            v-if="isOpenSearchPanel && !feedSearchFeedCol"
            @search="searchMessages"
            @cancel="isOpenSearchPanel = !isOpenSearchPanel"
          />
          <FeedFoundObjects
            v-if="isOpenSearchPanel && !feedSearchFeedCol"
            :not-found="notFoundMessage"
            :objects="foundMessages"
            :foundAmount="foundMessages.length"
            @clicked-search="handleClickMessage"
          />
        </template>

        <template #third-col>
          <chat-wrapper
            ref="refChatWrapper"
            :is-open-chat-panel="isOpenChatPanel"
            :is-selected-chat="!!selectedChat"
            :chat-panel-width="chatPanelWidth"
          >
            <template #default>
              <div style="display: flex;
                flex-direction: column;
                height: 100%;"
                :id="'feed-location'"
              >
                <ChatInfo 
                  :chat="selectedChat"
                  :show-return-button="isShowReturnButton"
                  @return-to-chats="handleReturnToChats">
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
                      @click="handleOpenSearchPanel"
                    >
                      <span class="pi pi-search" />
                    </button>
                    
                  </div>
                </template>
              </ChatInfo>
              <FeedSearch 
                v-if="isOpenSearchPanel && feedSearchFeedCol"
                @search="searchMessages"
                @cancel="handleOpenSearchPanel"
                @switch="isShowFeedWhileSearch = !isShowFeedWhileSearch"
                is-feed-location
              />
              <FeedFoundObjects
                v-if="isOpenSearchPanel && feedSearchFeedCol && !isShowFeedWhileSearch"
                :not-found="notFoundMessage"
                :objects="foundMessages"
                :foundAmount="foundMessages.length"
                @clicked-search="handleClickMessage"
              />
              <Feed
                v-if="isShowFeedWhileSearch || !feedSearchFeedCol || !isOpenSearchPanel"
                :button-params="selectedChat.countUnread > 0 ? {unreadAmount: selectedChat.countUnread} : null"
                :objects="messages"
                :typing="selectedChat.typing"
                :scroll-to="clickedMessage"
                :scroll-to-bottom="isScrollToBottomOnUpdateObjectsEnabled"
                :enable-double-click-reply="true"
                :chat-background="chatBackground"
                @message-action="messageAction"
                @message-visible="messageVisible"
              />
              <ChatInput 
                @send="addMessage"
              >
                <template #inline-buttons>
                  <FileUploader
                    :filebump-url="filebumpUrl"
                    :state="'active'"
                  />
                  <ButtonEmojiPicker
                    :mode="'hover'"
                    :state="'active'"
                  />
                </template>
                <template #buttons>
                  <ButtonTemplateSelector
                    :templates="templates.templates"
                    :group-templates="templates.tgroups"
                    :mode="'click'"
                    :state="'active'"
                  />
                  <ButtonWabaTemplateSelector
                    :waba-templates="templates.wabaTemplates"
                    :group-templates="templates.groups"
                    :mode="'click'"
                    :state="'active'"
                    :filebump-url="filebumpUrl"
                    @send-waba-values="sendWabaValues"
                  />
                  <ChannelSelector
                    :channels="channels"
                    :mode="'hover'"
                    :state="'active'"
                  />
                </template>
              </ChatInput>
            </div>
              
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
      </AdaptiveExtendedLayout>
    </BaseContainer>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick, computed, unref } from "vue";

import {
  ChatInfo,
  ChatInput,
  ChatList,
  Feed,
  UserProfile,
  ChatPanel,
  BaseContainer,
  ChatWrapper,
  AdaptiveExtendedLayout,
  FileUploader,
  ButtonEmojiPicker,
  ChannelSelector,
  ThemeMode,
  ButtonWabaTemplateSelector,
  FeedSearch,
  FeedFoundObjects,
  SideBar,
  ButtonTemplateSelector,
  ButtonContextMenu,
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

const actions = [
  {
    title: 'Создать чат'
  },
  {
    title: 'Пригласить'
  }
]

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

const sidebarItems = ref([]);
const clickedMessage = ref('')
const notFoundMessage = ref(false)
const foundMessages = ref([])
const isOpenSearchPanel = ref(false)
const feedSearchFeedCol = ref(false)
const sidebarFirstCol = ref(true)
const isShowFeedWhileSearch = ref(true)
const isSecondColVisible = ref(false)
const isThirdColVisible = ref(false)
const isShowReturnButton = ref(false)
const chatPanelWidth = ref(50)

const refContainer = ref()
const refChatWrapper = ref()

const handleOpenSearchPanel = () => {
  isOpenSearchPanel.value = !isOpenSearchPanel.value
  isShowFeedWhileSearch.value = !isShowFeedWhileSearch.value
}

const handleReturnToChats = () => {
  isSecondColVisible.value = true
  isThirdColVisible.value = false
}

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


const selectChat = (args) => {
  isSecondColVisible.value = false
  isThirdColVisible.value = true
  selectedChat.value = args.chat;
  if (selectedChat.value.countUnread > 0){
    chatsStore.setUnreadCounter(args.chat.chatId, 0);
    chatsStore.readMessages(args.chat.chatId, props.index + 1)
  }
  messages.value = getFeedObjects(); // Обновляем сообщения при выборе контакта
};

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

const resizeObserver = new ResizeObserver((entries) => {
  if (entries[0] && entries[1]){
    const containerWidth = entries[0].target.clientWidth
    const chatwrapperWidth = entries[1].target.clientWidth
    if (chatwrapperWidth < 700) chatPanelWidth.value = 80
    if (chatwrapperWidth > 700) chatPanelWidth.value = 60

    if (containerWidth < 920){
      feedSearchFeedCol.value = true
      isShowReturnButton.value = true
    }
    if (containerWidth > 920){
      feedSearchFeedCol.value = false
      isShowReturnButton.value = false
    }
    if (containerWidth < 720){
      sidebarFirstCol.value = false
    }
    if (containerWidth > 720){
      sidebarFirstCol.value = true
    }
  }
});

onMounted(() => {
  userProfile.value = props.authProvider.getUserProfile(props.index);
  chatsStore.chats = props.dataProvider.getChats();
  channels.value = props.dataProvider.getChannels();
  templates.value = props.dataProvider.getTemplates()
  sidebarItems.value = props.dataProvider.getSidebarItems();
  if (unref(refContainer).$el){
    resizeObserver.observe(unref(refContainer).$el)
  }
  if (unref(refChatWrapper).$el){
    resizeObserver.observe(unref(refChatWrapper).$el)
  }
});
</script>

<style scoped>
.chat-list-title-container{
  display: flex;
  justify-content: space-between;
  padding: 0 10px 0 10px;

  h2{
    font-size: 20px;
    margin: auto 0;
  }
}

.bcm-chat-action{
  line-height: 27px;
}

:deep(.chat-input__third-line) {
  --chotto-chatinput-third-line-grid-column-start: 1;
}
</style>
