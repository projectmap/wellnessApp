import { IChatMessage } from '@newstart-online/sdk';
import { MouseEventHandler } from 'react';

export interface IUserMessageCard {
  selectedGroupChat: boolean | undefined | [string];
  imageSrc: string | string[];
  userOnline: boolean | undefined;
  userName: string;
  userMessage: string | undefined | boolean;
  messageTime: string;
  id: number;
  onClick?: MouseEventHandler;
  userColor?: string;
  groupChatDetails?: any;
}

export interface ChatGroupMessage {
  [key: string]: IChatMessage[];
}

export interface IMessages {
  msg?: IChatMessage;
  isGroupChat?: boolean;
  isLastMsg?: boolean;
  setClickedImageSrc?: (imageSrc: string) => void;
}
