import { MessageWithChildren } from "@/types/conversation";

export type State = {
  isSidebarOpen: boolean;
  messageList: MessageWithChildren[];
  conversationId: string;
};

export enum ActionType {
  UPDATE = "UPDATE",
  ADD_MESSAGE = "ADD_MESSAGE",
  UPDATE_MESSAGE = "UPDATE_MESSAGE",
}

type UpdateAction = {
  type: ActionType.UPDATE;
  field: keyof State;
  value: State[keyof State];
};

type MessageAction = {
  type: ActionType.ADD_MESSAGE | ActionType.UPDATE_MESSAGE;
  message: MessageWithChildren;
};

export type Action = UpdateAction | MessageAction;

export const initialState: State = {
  isSidebarOpen: true,
  messageList: [],
  conversationId: "",
};

const actionMap = new Map<ActionType, (state: State, action: any) => State>([
  [
    ActionType.UPDATE,
    (state: State, action: UpdateAction) => {
      return { ...state, [action.field]: action.value };
    },
  ],
  // 添加一个消息
  [
    ActionType.ADD_MESSAGE,
    (state: State, action: MessageAction) => {
      return { ...state, messageList: state.messageList.concat(action.message) };
    },
  ],
  // 更新一个消息的内容
  [
    ActionType.UPDATE_MESSAGE,
    (state: State, action: MessageAction) => {
      const messageList = state.messageList.map((message) => {
        if (message.id === action.message.id) {
          return action.message;
        }
        return message;
      });
      return { ...state, messageList };
    },
  ],
]);

export const appReducer = (state: State, action: Action) => {
  const reducer = actionMap.get(action.type);
  if (!reducer) {
    return state;
  }
  return reducer(state, action);
};
