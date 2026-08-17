  import { create } from 'zustand'
 
 
 export const useUserExpenses = create((set) => ({
     userExpenses: '',
   }))
   
   
   export const useUserExpensesTotal = create((set) => ({
     userExpensesTotal: '',
   }))
   
   
   export const useUserExpensesData = create((set) => ({
     userExpensesData: '',
   }))
 