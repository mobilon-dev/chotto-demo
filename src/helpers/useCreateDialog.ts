import { useModal, ModalNoFooter } from '@mobilon-dev/chotto';

export const useModalCreateDialog = async (
  title: string, 
  name: string, 
  contacts: unknown, 
  channels: unknown, 
  filter: (data: unknown) => void, 
  theme?: string
) => {
  const data = await useModal({
    component: () => import('@mobilon-dev/chotto'),
    attrs: {
      title, 
      name,
      contacts,
      channels,
      filter,
    },
    Modal: ModalNoFooter,
    modalAttrs: {
      theme,
    },
  });
  return data;
}


