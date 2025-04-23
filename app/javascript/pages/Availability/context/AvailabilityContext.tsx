import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";

type State = {
  userId: number | null;
  userTimeSlots: number[];
  groupTimeSlots: Record<number, number[]>;
  numberOfEventUsers: number;
  users: any;
};

type Action =
  | { type: "SET_USER"; payload: number }
  | {
      type: "ADD_USER_SLOT";
      payload: { userId: number | null; time_slot_id: number };
    }
  | {
      type: "DELETE_USER_SLOT";
      payload: { userId: number; time_slot_id: number };
    }
  | { type: "SET_USER_TIME_SLOTS"; payload: number[] }
  | { type: "SET_GROUP_TIME_SLOTS"; payload: Record<number, number[]> }
  | { type: "SET_NUM_OF_USERS"; payload: number }
  | { type: "SET_USERS"; payload: number };

const AvailabilityReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, userId: action.payload };
    case "ADD_USER_SLOT":
      if (!action.payload.userId) return { ...state };
      const key = action.payload.time_slot_id;
      const value = state.groupTimeSlots[key] || [];

      return {
        ...state,
        userTimeSlots: [...state.userTimeSlots, action.payload.time_slot_id],
        groupTimeSlots: {
          ...state.groupTimeSlots,
          [key]: [...value, action.payload.userId],
        },
      };
    case "DELETE_USER_SLOT":
      return {
        ...state,
        userTimeSlots: state.userTimeSlots.filter(
          (item: number) => item !== action.payload.time_slot_id
        ),
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
  userId: null,
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
