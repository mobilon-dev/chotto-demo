import { useModal, Modal } from '@mobilon-dev/chotto';

export const useModalSelectUser2 = async (title: string, users: unknown[], theme: string) => {
  const data = await useModal({
    component: () => import('@mobilon-dev/chotto').then(module => module.ModalSelectUser),
    attrs: {
      title, 
      users,
    },
    Modal,
    modalAttrs: {
      theme,
    },
  });
  console.log('data', data);
  return data;
}


