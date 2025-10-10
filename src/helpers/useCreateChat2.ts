import { useModal, Modal, CreateDialog } from '@mobilon-dev/chotto';

export const useModalCreateChat2 = async (title: string, theme: string) => {
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
  return data;
}


