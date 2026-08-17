import { create } from 'zustand'


export const useUserOrders = create((set) => ({
    userOrders: '',
}))


export const useUserOrdersTotal = create((set) => ({
    userOrdersTotal: '',
}))


export const useUserOrdersData = create((set) => ({
    userOrdersData: '',
}))
