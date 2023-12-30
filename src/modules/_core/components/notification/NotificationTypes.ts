/* eslint-disable no-unused-vars */
import { INotificationResponse } from '@newstart-online/sdk';

import { SvgIconName } from '~/utils/enums';
import { FunctionWithNoParam } from '~/utils/helpers';
import { NavLinkProps } from '~/modules/_core/components/links/NavigationLink';

export enum NotificationTypes {
  COMMENT = 'comment',
  MESSAGE = 'message',
  FRIEND = 'friend',
  ADMIN = 'admin',
  LIKE = 'like',
}

export interface NotificationPopOverProps extends NavLinkProps {
  title: string;
  isActive: boolean;
  handleClose?: FunctionWithNoParam;
}

export type NotificationResponse = INotificationResponse['notifications'] & {
  createdAt: Date;
};
export type NotificationProps = {
  user: string;
  isPage?: boolean;
  text?: string;
  message: string;
  avatarSrc?: string;
  seen: boolean;
  notificationId: string;
  metaData: INotificationResponse['notifications']['metaData'];
  createdDate: Date;
  color?: string;
};

export interface NotificationPopOverContentProps {
  to: NotificationPopOverProps['to'];
}

export interface UseInfiniteListNotificationProps {
  apiItemCount: number;
}

export interface getNotificationLinkProps {
  icon: SvgIconName;
  metaData: INotificationResponse['notifications']['metaData'];
}
