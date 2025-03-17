import { create } from 'zustand'

// Define the store interface
interface TourStore {
  isOn: boolean
  startTour: () => void
  stopTour: () => void
  toggleTour: () => void
}

// Create the Zustand store
export const useTourStore = create<TourStore>((set) => ({
  // Initial state
  isOn: false,

  // Action to start the tour
  startTour: () => set({ isOn: true }),

  // Action to stop the tour
  stopTour: () => set({ isOn: false }),

  // Action to toggle the tour state
  toggleTour: () => set((state) => ({ isOn: !state.isOn }))
}))