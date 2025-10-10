import { useModal, Modal } from '@mobilon-dev/chotto';

export const useModalCreateChat2 = async (title: string, theme: string) => {
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
  return data;
}


