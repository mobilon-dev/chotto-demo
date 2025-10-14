<script setup>
 import { onMounted, ref, watch } from 'vue';
 import BaseAdaptiveExtendedLayoutChat from './components/BaseAdaptiveExtendedLayoutChat.vue';
import {
  messages, chats, channels,
  userProfiles, templates,
  sidebarItems
} from './data';
import { useChatsStore } from '../../stores/chatsStore';
import { useIndexedTitle } from '../../useIndexedTitle';

const {set} = useIndexedTitle()
const chatsStore = useChatsStore()
const width = ref(1300)

watch(() => width.value,
()=> {
  console.log(width.value)
  const container = document.getElementById('container-adaptive-width')
  container.style.setProperty('--width', width.value + 'px')
})

// Mock data
const data3 = {
  messages,
  chats,
  channels,
  userProfiles,
  templates,
  sidebarItems
};

// Define the auth provider
const authProvider = {
  getUserProfile(index) { return data3.userProfiles[index] },
  setUserProfileOnline(index, online){
    if (online){
      data3.userProfiles[index].online = true
      data3.userProfiles[index].status = 'lightgreen'
    }
    else if (!online){
      data3.userProfiles[index].online = false
      data3.userProfiles[index].status = 'gray'
    }
  }
};

// Define the data provider
const dataProvider = {
  setAuth(auth) {
    console.log('auth', auth);
  },
  getFeed(chatId) {
    return data3.messages.filter(m => m.chatId === chatId);
  },
  getOutterUserFeed(chatId) {
    return data3.messages.filter(m => m.chatId === chatId && m.type != "message.system");
  },
  getChannels() {
    return data3.channels;
  },
  getTemplates() {
    return data3.templates;
  },
  getChats() {
    return data3.chats;
  },
  getMessages() {
    return data3.messages;
  },
  getMessagesBySearch(chatId, string){
    const messages = data3.messages.filter(m => m.chatId === chatId);
    const search = messages.filter(m => {
      if (m.text) {
        const index = m.text.indexOf(string)
        if (index != -1) return m
      }
    })
    return search
  },
  addMessage(message) {
    data3.messages.push(message);
    console.log("Добавлено новое сообщение:", message);
  },
  getSidebarItems() {
    return data3.sidebarItems
  }
};

onMounted(() => {
  chatsStore.messages = dataProvider.getMessages();
  set(10)
})
</script>

<template>
  <input type="range" min="500" max="1300" step="200" value="50" v-model="width"/>
  <div class="container" id="container-adaptive-width">
    <BaseAdaptiveExtendedLayoutChat
      :auth-provider="authProvider"
      :data-provider="dataProvider"
      :index="2"
    />
  </div>
</template>

<style scoped>
.container {
  --width: 1300px;

  width: var(--width);
  height: 600px;
  margin: 20px auto;
}
</style>