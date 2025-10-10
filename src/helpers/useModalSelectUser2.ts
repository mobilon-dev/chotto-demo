import { useModal } from '@mobilon-dev/chotto';
import { Modal } from '@mobilon-dev/chotto';

export const useModalSelectUser2 = async (title: string, users: unknown[], theme: string) => {
  const data = await useModal({
    component: () => import('@mobilon-dev/chotto'),
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


