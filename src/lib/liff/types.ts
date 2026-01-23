// LINE LIFF Types for Oracle AI Buddy

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface LiffContext {
  type: 'utou' | 'room' | 'group' | 'square_chat' | 'external' | 'none';
  viewType?: 'full' | 'tall' | 'compact' | 'frame' | 'full-flex';
  userId?: string;
  utouId?: string;
  roomId?: string;
  groupId?: string;
  squareChatId?: string;
}

export interface LiffState {
  isLoggedIn: boolean;
  isInClient: boolean;
  isReady: boolean;
  profile: LiffProfile | null;
  context: LiffContext | null;
  error: Error | null;
}

export interface LiffActions {
  login: () => void;
  logout: () => void;
  getProfile: () => Promise<LiffProfile | null>;
  sendMessages: (messages: LiffMessage[]) => Promise<void>;
  shareTargetPicker: (messages: LiffMessage[]) => Promise<void>;
  closeWindow: () => void;
  openWindow: (url: string, external?: boolean) => void;
  scanCode: () => Promise<string | null>;
}

export type LiffMessage =
  | LiffTextMessage
  | LiffImageMessage
  | LiffFlexMessage;

export interface LiffTextMessage {
  type: 'text';
  text: string;
}

export interface LiffImageMessage {
  type: 'image';
  originalContentUrl: string;
  previewImageUrl: string;
}

export interface LiffFlexMessage {
  type: 'flex';
  altText: string;
  contents: FlexContainer;
}

export interface FlexContainer {
  type: 'bubble' | 'carousel';
  [key: string]: unknown;
}
