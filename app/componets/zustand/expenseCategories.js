import { create } from 'zustand'


export const useUserExpensesCategories = create((set) => ({
  userExpensesCategories: '',
}))


export const useUserExpensesCategoriesTotal = create((set) => ({
  userExpensesCategoriesTotal: '',
}))


export const useUserExpensesCategoriesData = create((set) => ({
  userExpensesCategoriesData: '',
}))
