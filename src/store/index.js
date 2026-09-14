import { create } from 'zustand';
import { createParcelSlice } from './slices/parcelSlice';
import { createAuthSlice } from './slices/authSlice';

export const useAppStore = create((set, get) => ({
  ...createParcelSlice(set, get),
  ...createAuthSlice(set, get),
}));

export default useAppStore;
