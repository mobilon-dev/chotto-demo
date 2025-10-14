import { ref } from 'vue';

const newMessage = ref(false)

export const useNewMessage = () => {
    return {newMessage}
}