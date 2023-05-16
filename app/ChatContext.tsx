import { createContext } from 'react';

export type Connection = {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string;
  at: string;
};

export type Typing = {
  id: string; // room Id. (each connection)
  typing: boolean;
};
/*

 CREATE TABLE Users (
    userId uuid PRIMARY KEY default uuid_generate_v4(),
    name TEXT not null,
    userName TEXT unique not null,
    password text not null,
    avatarUrl TEXT,
    avatarId TEXT,
    email TEXT unique not null,
    createdAt TIMESTAMP default now,
    updatedAt TIMESTAMP,
    lastSeen TIMESTAMP,
    bio TEXT
);
*/

export type User = {
  userId?: string;
  name: string;
  userName: string;
  password: string;
  avatarUrl?: string;
  avatarId?: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  lastSeen?: string;
  bio?: string;
};

// export type Message = {
//   id: string;
//   text: string;
//   senderId: string;
//   receiverId: string;
//   attachment?: string;
//   emoji?: string;
//   link?: string;
//   createdAt: string;
//   updatedAt?: string;
//   deletedAt?: string;
//   initiatedBy: Connection;
//   reply?: {
//     id: string;
//     text: string;
//     senderId: string;
//     receiverId: string;
//     attachment: string;
//     emoji: string;
//     link: string;
//     createdAt: string;
//     updatedAt: string;
//     deletedAt: string;
//   };
// };
export type AllChats = {
  id: string; // a single room id (each connnection)
  createdAt: string;
  sender: Connection;
  receiver: Connection;
  messages: Message[];
};

// export type User = {
//   email: string;
//   password: string;
// };

export type Chats = {
  sender: string;
  receiver: string;
  message: string;
  at: string;
};

export type Error = {
  signIn: string;
  signUp: string;
};

export type Alert = {
  show: boolean;
  message: string;
  title: string;
  type: string;
};

export type SearchResult = {
  id: string;
  email: string;
  at: string;
  name: string;
  username: string;
  avatar?: string; // avatar url.if not set, use default.( use color code. see util.fns.tsx)
};
export type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
};
export type LastSeen = {
  [id: string]: {
    online: boolean;
    at: string;
  };
};

type NullableString = string | null;
type NullableNumber = number | null;
// link
export type Link = {
  messageId: string;
  siteName: NullableString;
  url: NullableString;
  title: NullableString;
  description: NullableString;
  type: NullableString;
  date: NullableString;
  imageWidth: NullableNumber;
  imageHeight: NullableNumber;
  imageUrl: NullableString;
};

// attachment

export type Attachment = {
  messageId: string;
  type: string | null;
  url: string;
  width: number | null;
  height: number | null;
  size: string | null;
};

export type Message = {
  messageId: string;
  roomId: string;
  senderId: string;
  text: string;
  createdAt: string;
  updatedAt: string | null;
  message: Message | []; // message inside message acts as reply. generated by supabase database.
  replyId: string | null;
  emoji: string;
  link: Link | null;
  attachment: Attachment | null;
};

export type Room = {
  roomId: string;
  createdAt: string;
  userOneId: string;
  userTwoId: string;
  friend: User;
  messages: Message[];
};

export type UserProfile = { url: string };

export type Tab = 'chat' | 'profile' | 'setting' | 'notification';
export type Theme = 'light' | 'dark' | 'system';
export const ChatContext = createContext({
  onUserSignIn: (user: any) => {},
  onUserSignUp: (user: User) => {},
  setError: (error: Error) => {},
  setCurrentOpenChatId: (id: string) => {},
  setChatFriends: (friends: SearchResult[]) => {},
  setChats: (chats: Chats[]) => {},
  setAllChats: (allChats: AllChats[]) => {},
  setTyping: (typing: Typing[]) => {},
  setIsAllChatsLoading: (isLoading: boolean) => {},
  setBarCurrentTab: (tab: Tab) => {},
  setWallpaper: (wallpaper: string) => {},
  setGallery: (gallery: string[]) => {},
  setTheme: (theme: Theme) => {},
  setFriendRequests: (friendRequests: User[]) => {},
  setIsUserNotAbleToSendFriendRequest: (isUserNotAbleToSendFriendRequest: boolean) => {},
  setLastSeen: (lastSeen: LastSeen) => {},
  setUserProfile: (userProfile: UserProfile) => {},
  setUser: (user: User) => {},
  setAlert: (alert: Alert) => {},
  setRooms: (rooms: Map<string, Room>) => {},
  rooms: new Map<string, Room>(),
  alert: {} as Alert,
  user: {} as User,
  userProfile: {} as UserProfile,
  lastSeen: {} as LastSeen,
  isUserNotAbleToSendFriendRequest: false,
  friendRequests: [] as User[],
  theme: 'light' as Theme,
  gallery: [] as string[],
  wallpaper: '',
  barCurrentTab: 'chat' as Tab,
  isAllChatsLoading: false,
  typing: [] as Typing[],
  allChats: [] as AllChats[],
  chats: [] as Chats[],
  chatFriends: [] as SearchResult[],
  currentOpenChatId: '',
  error: {
    signIn: '',
    signUp: '',
  },
});

/*

 --  CREATE TABLE Users (
--     userId uuid PRIMARY KEY default uuid_generate_v4(),
--     name TEXT not null,
--     userName TEXT unique not null,
--     password text not null,
--     avatarUrl TEXT,
--     avatarId TEXT,
--     email TEXT unique not null,
--     createdAt TIMESTAMP default now,
--     updatedAt TIMESTAMP,
--     lastSeen TIMESTAMP,
--     bio TEXT
-- );

-- CREATE TABLE PrivateRooms (
--     roomId TEXT PRIMARY KEY,
--     userOneId uuid not null,
--     userTwoId uuid not null,
--     createdAt TIMESTAMP,
--     accepted BOOLEAN,
--     inactive boolean
-- );



[]
-- CREATE TABLE MessageLinks (
--     messageId UUID REFERENCES Messages(messageId),
--     siteName TEXT,
--     url TEXT,
--     title TEXT,
--     description TEXT,
--     type TEXT,
--     date TIMESTAMP,
--     imageWidth INTEGER,
--     imageHeight INTEGER,
--     imageUrl TEXT,
--     PRIMARY KEY (messageId, url)
-- );




-- CREATE TABLE MessageAttachments (
--     messageId UUID REFERENCES Messages(messageId),
--     type TEXT,
--     url TEXT,
--     width INTEGER,
--     height INTEGER,
--     size TEXT,
--     PRIMARY KEY (messageId, url)
-- );


[]
export type Attachment={
    messageId: string;
    type: string;
    url: string;
    width: number;
    height: number;
    size: string;
}

export type Message = {
  messageId: string;
  roomId: string;
  senderId:string;
  text: string;
  createdAt: string;
  updatedAt?: string;
  reply: Message;
  emoji: string;
  link: Link;
  attachment: Attachment;
}


*/
