import { AvailabilityProps, UserProps } from "@/pages/Event/event.types";
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";

type State = {
  user: UserProps | null;
  userTimeSlots: AvailabilityProps[];
  groupTimeSlots: Record<number, UserProps[]>;
  numberOfEventUsers: number;
  users: any;
};

type Action =
  | { type: "SET_USER"; payload: UserProps }
  | {
      type: "ADD_USER_SLOT";
      payload: AvailabilityProps;
    }
  | {
      type: "DELETE_USER_SLOT";
      payload: { id: number; time_slot_id: number; user_id: number };
    }
  | { type: "SET_USER_TIME_SLOTS"; payload: AvailabilityProps[] }
  | { type: "SET_GROUP_TIME_SLOTS"; payload: Record<number, UserProps[]> }
  | { type: "SET_NUM_OF_USERS"; payload: number }
  | { type: "SET_USERS"; payload: UserProps[] };

const AvailabilityReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "ADD_USER_SLOT":
      if (!action.payload.time_slot_id) return { ...state };
      const key = action.payload.time_slot_id;
      const value = state.groupTimeSlots[key] || [];

      return {
        ...state,
        userTimeSlots: [...state.userTimeSlots, action.payload],
        groupTimeSlots: {
          ...state.groupTimeSlots,
          [key]: [...value, action.payload.user],
        },
      };
    case "DELETE_USER_SLOT":
      const deleteKey = action.payload.time_slot_id;
      return {
        ...state,
        userTimeSlots: state.userTimeSlots.filter(
          (item: AvailabilityProps) => item.id !== action.payload.id
        ),
        groupTimeSlots: {
          ...state.groupTimeSlots,
          [deleteKey]: state.groupTimeSlots[deleteKey].filter(
            (user: UserProps) => user.id === action.payload.user_id
          ),
        },
      };
    case "SET_USER_TIME_SLOTS":
      return {
        ...state,
        userTimeSlots: action.payload,
      };
    case "SET_GROUP_TIME_SLOTS":
      return {
        ...state,
        groupTimeSlots: action.payload,
      };
    case "SET_NUM_OF_USERS":
      return {
        ...state,
        numberOfEventUsers: action.payload,
      };
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };
    default:
      return state;
  }
};

const initialState: State = {
  user: null,
  userTimeSlots: [],
  groupTimeSlots: [],
  numberOfEventUsers: 0,
  users: [],
};

const AvailabilityContext = createContext<
  (State & { dispatch: Dispatch<Action> }) | undefined
>(undefined);

export const AvailabilityProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AvailabilityReducer, initialState);
  return (
    <AvailabilityContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AvailabilityContext.Provider>
  );
};

export const useAvailabilityContext = () => {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error(
      "useAvailabilityContext should be used inside AvailabilityProvider"
    );
  }
  return context;
};
