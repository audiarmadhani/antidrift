import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EmergencyStep = 1 | 2 | 3 | 4 | 5;

interface EmergencyState {
  step: EmergencyStep;
  emotions: string[];
  otherEmotion: string;
  urgency: number;
  predictedFeeling: string;
  estimatedCost: number;
  movedTowardsIdentity: boolean | null;
  frictionStartedAt: number | null;
  reset: () => void;
  setStep: (step: EmergencyStep) => void;
  setEmotions: (emotions: string[]) => void;
  setOtherEmotion: (v: string) => void;
  setUrgency: (v: number) => void;
  setPredictedFeeling: (v: string) => void;
  setEstimatedCost: (v: number) => void;
  setMovedTowardsIdentity: (v: boolean) => void;
  setFrictionStartedAt: (v: number | null) => void;
}

const initialState = {
  step: 1 as EmergencyStep,
  emotions: [] as string[],
  otherEmotion: "",
  urgency: 5,
  predictedFeeling: "",
  estimatedCost: 0,
  movedTowardsIdentity: null as boolean | null,
  frictionStartedAt: null as number | null,
};

export const useEmergencyStore = create<EmergencyState>()(
  persist(
    (set) => ({
      ...initialState,
      reset: () => set(initialState),
      setStep: (step) => set({ step }),
      setEmotions: (emotions) => set({ emotions }),
      setOtherEmotion: (otherEmotion) => set({ otherEmotion }),
      setUrgency: (urgency) => set({ urgency }),
      setPredictedFeeling: (predictedFeeling) => set({ predictedFeeling }),
      setEstimatedCost: (estimatedCost) => set({ estimatedCost }),
      setMovedTowardsIdentity: (movedTowardsIdentity) =>
        set({ movedTowardsIdentity }),
      setFrictionStartedAt: (frictionStartedAt) => set({ frictionStartedAt }),
    }),
    { name: "antidrift-emergency" }
  )
);

interface SyncState {
  isOnline: boolean;
  lastSynced: string | null;
  setOnline: (v: boolean) => void;
  setLastSynced: (v: string) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isOnline: true,
  lastSynced: null,
  setOnline: (isOnline) => set({ isOnline }),
  setLastSynced: (lastSynced) => set({ lastSynced }),
}));
