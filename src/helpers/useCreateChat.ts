import { useModal, Modal } from '@mobilon-dev/chotto';

export const useModalCreateChat = async (title: string, theme: string) => {
  const data = await useModal({
    component: () => import('@mobilon-dev/chotto'),
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


