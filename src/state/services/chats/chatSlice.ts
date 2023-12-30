import { IFriendsResponse, MESSAGE_GROUP } from '@newstart-online/sdk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUser } from '@newstart-online/sdk';

// all the necessary states for user onboarding flow in frontend
interface ChatStates {
  newChatModal: boolean; //opens new chat modal
  newGroupModal: boolean; //opens new group modal
  newGroupName: boolean; //opens groupname and change groupname modal
  addGroupMember: boolean; // adds members to the created group
  groupChatInfo: {
    associatedUser: [IUser] | undefined;
    groupName: string;

    type: MESSAGE_GROUP;
  };
  isGroupCreated: boolean; // test if group has already been created for varoius reasons
  onlineUsers: any[]; // array of online users from web socket
  showChatInfoOnRightSide: boolean;
  isImageSending: boolean;
  searchGroupOrFriend: string;
}

const initialState: ChatStates = {
  newChatModal: false,
  newGroupModal: false,
  newGroupName: false,
  addGroupMember: false,
  groupChatInfo: {
    associatedUser: undefined,
    groupName: '',
    type: MESSAGE_GROUP.GROUP,
  },
  isGroupCreated: false,
  onlineUsers: [],
  showChatInfoOnRightSide: false,
  isImageSending: false,
  searchGroupOrFriend: '',
};

const ChatSectionSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setNewChatModal(state, action: PayloadAction<any>) {
      state.newChatModal = action.payload;
    },
    setNewGroupModal(state, action: PayloadAction<any>) {
      state.newGroupModal = action.payload;
    },
    setNewGroupName(state, action: PayloadAction<any>) {
      state.newGroupName = action.payload;
    },
    setGroupChat(state, action: PayloadAction<any>) {
      state.groupChatInfo = action.payload;
    },
    setIsGroupCreated(state, action: PayloadAction<any>) {
      state.isGroupCreated = action.payload;
    },
    setAddGroupMember(state, action: PayloadAction<any>) {
      state.addGroupMember = action.payload;
    },
    setOnlineUsers(state, action: PayloadAction<any>) {
      state.onlineUsers = action.payload;
    },
    setShowChatInfoOnRightSide(state, action: PayloadAction<any>) {
      state.showChatInfoOnRightSide = action.payload;
    },
    setIsImageLoading(state, action: PayloadAction<any>) {
      state.isImageSending = action.payload;
    },
    setSearchGroupOrFriend(state, action: PayloadAction<any>) {
      state.searchGroupOrFriend = action.payload;
    },
  },
});

export const {
  setNewChatModal,
  setNewGroupModal,
  setNewGroupName,
  setGroupChat,
  setIsGroupCreated,
  setAddGroupMember,
  setOnlineUsers,
  setShowChatInfoOnRightSide,
  setSearchGroupOrFriend,
  setIsImageLoading,
} = ChatSectionSlice.actions;

export default ChatSectionSlice.reducer;
