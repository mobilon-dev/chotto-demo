import {sortByTimestamp, insertDaySeparators} from '../helpers';
import { formatTimestamp } from '@mobilon-dev/chotto';

export const transformToFeed = (objects: any[], index: number) => {
  // а. сортировка по timestamp
  const messages1 = sortByTimestamp(objects);

  // б. переформатирование
  const messages2 = messages1.map((m: any) => {
    let position
    if (m.senderId != undefined){
      if (m.senderId == index + 1){
        position = 'right'
      }
      else position = 'left'
    }
    else position = null
    return {
      ...m,
      position: position,//m.direction === 'outgoing' ? 'right' : 'left',
      time: formatTimestamp(m.timestamp),
    };
  });

  // в. вставка временных отсечек
  const messages3 = insertDaySeparators(messages2);
  return messages3;
}
