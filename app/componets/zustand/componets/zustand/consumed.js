 import { create } from 'zustand'


export const useUserConsumed = create((set) => ({
    userConsumed: '',
  }))
  
  
  export const useUserConsumedTotal = create((set) => ({
    userConsumedTotal: '',
  }))
  
  
  export const useUserConsumedData = create((set) => ({
    userConsumedData: '',
  }))
