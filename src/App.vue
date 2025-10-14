<script setup>
import { ButtonContextMenu } from '@mobilon-dev/chotto';
import router from './router';
import { useIndexedTitle } from './useIndexedTitle';
import { provide, useId } from 'vue';

const {currentIndex} = useIndexedTitle()

// Предоставляем chatAppId и extChatAppId для компонентов библиотеки chotto
const chatAppId = useId()
provide('chatAppId', chatAppId)
provide('extChatAppId', '')
const chats = [
  {
    index: 0,
    title: 'Chat00 - two persons chat demo',
  },
  {
    index: 1,
    title: 'Chat01 - conversation 3 to 1 demo',
  },
  {
    index: 2,
    title: 'Chat02 - waba templates demo',
  },
  {
    index: 3,
    title: 'Chat03 - messages search in chat',
  },
  {
    index: 4,
    title: 'Chat04 - adaptive extended layout',
  },
  {
    index: 5,
    title: 'Chat05 - chat multidialog system',
  },
  {
    index: 6,
    title: 'Chat06 - audio and video recording',
  },
  {
    index: 7,
    title: 'Chat07 - GigaChat conversation',
  },
  {
    index: 8,
    title: 'Chat08 - re-styling by user`s conditions',
  },
  {
    index: 9,
    title: 'Chat09 - custom placeholders',
  },
  {
    index: 10,
    title: 'Chat10 - sidebar items',
  },
]

const handleClick = (action) => {
  router.push('/' + action.index)
}
</script>

<template>
  <div class="toolbar" data-theme="light">
    <ButtonContextMenu 
      style="margin-left: 150px; z-index: 1001; padding: 14px;"
      :actions="chats"
      mode="hover"
      button-class="pi pi-list"
      menuSide="bottom"
      @click="handleClick"
    >
      <span class="pi pi-list"></span>
    </ButtonContextMenu>
    
    <h2 class="toolbar-title">
      {{ chats[currentIndex].title }}
    </h2>
  </div>
  <RouterView />
</template>

<style scoped>
  .toolbar{
    height: 48px;
    display: flex;
    font-family: "Montserrat", sans-serif;
    margin-bottom: 15px;
    background-color: lightgray;
    border-radius: 5px;
  }

  .context-menu{
    font-family: "Montserrat", sans-serif;
  }

  .toolbar-title{
    margin: 0;
    line-height: 48px;
    width: 100%;
    text-align: center;
  }
</style>
