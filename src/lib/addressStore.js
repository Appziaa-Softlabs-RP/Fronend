import { create } from 'zustand'


const useAddressStore = create((set) => ({
    selectedAddress: null,
    setSelectedAddress: (address) => set({ selectedAddress: address }),
}));

export default useAddressStore; 