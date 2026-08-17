import { create } from 'zustand'


export const useUserRoomCategories = create((set) => ({
    userRoomCategories: '',
}))


export const useUserRoomCategoriesTotal = create((set) => ({
    userRoomCategoriesTotal: '',
}))


export const useUserRoomCategoriesData = create((set) => ({
    userRoomCategoriesData: '',
}))
