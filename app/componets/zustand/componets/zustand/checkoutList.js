 import { create } from 'zustand'


export const useUserCheckoutList = create((set) => ({
    userCheckoutList: '',
  }))
  
  
  export const useUserCheckoutListTotal = create((set) => ({
    userCheckoutListTotal: '',
  }))
  
  
  export const useUserCheckoutListData = create((set) => ({
    userCheckoutListData: '',
  }))
