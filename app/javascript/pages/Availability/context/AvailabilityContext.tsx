import {
  AvailabilityProps,
  ScheduledSlotProps,
  UserProps,
} from "@/pages/Event/event.types";
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
  scheduledTimeSlots: number[];
};

type Action =
  | { type: "SET_USER"; payload: UserProps }
  | {
      type: "ADD_USER_SLOT";
      payload: AvailabilityProps;
    }
  | {
      type: "DELETE_USER_SLOT";
      payload: AvailabilityProps;
    }
  | { type: "SET_USER_TIME_SLOTS"; payload: AvailabilityProps[] }
  | { type: "SET_GROUP_TIME_SLOTS"; payload: Record<number, UserProps[]> }
  | { type: "SET_NUM_OF_USERS"; payload: number }
  | { type: "SET_USERS"; payload: UserProps[] }
  | { type: "ADD_USER"; payload: UserProps }
  | { type: "SET_SCHEDULED_SLOTS"; payload: number[] }
  | { type: "ADD_SCHEDULED_SLOT"; payload: number }
  | { type: "DELETE_SCHEDULED_SLOT"; payload: number };

const AvailabilityReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "ADD_USER":
      return { ...state, users: [...state.users, action.payload] };
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
      console.log(action.payload);
      const deleteKey = action.payload.time_slot_id;
      return {
        ...state,
        userTimeSlots: state.userTimeSlots.filter(
          (item: AvailabilityProps) => item.id !== action.payload.id
        ),
        groupTimeSlots: {
          ...state.groupTimeSlots,
          [deleteKey]: state.groupTimeSlots[deleteKey].filter(
            (user: UserProps) => user.id !== action.payload.user.id
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
    case "SET_SCHEDULED_SLOTS":
      return {
        ...state,
        scheduledTimeSlots: action.payload,
      };
    case "ADD_SCHEDULED_SLOT":
      return {
        ...state,
        scheduledTimeSlots: [...state.scheduledTimeSlots, action.payload],
      };
    case "DELETE_SCHEDULED_SLOT":
      return {
        ...state,
        scheduledTimeSlots: state.scheduledTimeSlots.filter(
          (item: number) => item !== action.payload
        ),
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
  scheduledTimeSlots: [],
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
