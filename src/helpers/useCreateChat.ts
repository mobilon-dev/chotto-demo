import { useModal, Modal, CreateDialog } from '@mobilon-dev/chotto';

export const useModalCreateChat = async (title: string, theme: string) => {
  const data = await useModal({
    component: CreateDialog,
    attrs: {
      title, 
    },
    Modal,
    modalAttrs: {
      theme,
    },
  });
  console.log('data', data);
  return data;
}


