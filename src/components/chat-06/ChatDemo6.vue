<script setup>
 import { onMounted } from 'vue';
 import FloatFeedChatApp from './components/FloatFeedChatApp.vue';
import {
  messages, chats,
  userProfiles, templates
} from './data';
import { useChatsStore } from '../../stores/chatsStore';
import { useIndexedTitle } from '../../useIndexedTitle';

const {set} = useIndexedTitle()
const chatsStore = useChatsStore()
// Mock data
const data3 = {
  messages,
  chats,
  userProfiles,
  templates
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
  getTemplates() {
    return data3.templates;
  },
  getChats() {
    return data3.chats;
  },
  getMessages() {
    return data3.messages;
  },
  addMessage(message) {
    data3.messages.push(message);
    console.log("Добавлено новое сообщение:", message);
  },
};

onMounted(() => {
  chatsStore.messages = dataProvider.getMessages();
  set(6)
})
</script>

<template>
  <div class="container">
    <FloatFeedChatApp
      :auth-provider="authProvider"
      :data-provider="dataProvider"
      :index="0"
    />
  </div>
</template>

<style scoped>
.container {
  width: 1300px;
  height: 600px;
  margin: 30px auto;
  position: relative;
}
</style>
