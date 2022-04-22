import React, { createContext, useContext, useReducer } from "react";

export type NotificationType = "STANDARD" | "ERROR" | "SUCCESS";
export type NotificationPosition = "TOP" | "BOTTOM" | "CENTER";

export type NotificationDispatch =
  | {
      type: "ADD";
      item: NotificationItemOptions;
    }
  | { type: "CLEAR" };

export interface NotificationItemProps {
  dismiss: () => void;
}

export interface NotificationItemOptions {
  item: (props: NotificationItemProps) => JSX.Element;
  type?: NotificationType;
  position?: NotificationPosition;
  cover?: boolean;
}

const NotificationStateContext = createContext<
  NotificationItemOptions | undefined
>(undefined);
const NotificationDispatchContext = createContext<
  React.Dispatch<NotificationDispatch>
>(() => {});

const notificationReducer = (
  state: NotificationItemOptions | undefined,
  action: NotificationDispatch
): NotificationItemOptions | undefined => {
  switch (action.type) {
    case "ADD":
      return action.item;
    case "CLEAR":
      return undefined;
  }

  return state;
};

const NotificationProvider: React.FC = ({ children }): JSX.Element => {
  const [state, dispatch] = useReducer<
    React.Reducer<NotificationItemOptions | undefined, NotificationDispatch>
  >(notificationReducer, undefined);

  return (
    <NotificationStateContext.Provider value={state}>
      <NotificationDispatchContext.Provider value={dispatch}>
        {children}
      </NotificationDispatchContext.Provider>
    </NotificationStateContext.Provider>
  );
};

const useNotificationState = () => {
  return useContext(NotificationStateContext);
};

const useNotificationDispatch = () => {
  return useContext(NotificationDispatchContext);
};

export { NotificationProvider, useNotificationDispatch, useNotificationState };

