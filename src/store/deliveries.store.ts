import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  deliveries: DeliveryManItem[];
  loading: boolean;
};

type Actions = {
  getDeliveryManSelect: () => Promise<{ label: string; value: number }[]>;
  loadDeliveries: () => Promise<DeliveryManItem[]>;
  setLoading: (loading: boolean) => void;
  addDelivery: (delivery: {
    name: string;
    phone: string;
    diary_value: number;
  }) => void;
  editDelivery: (delivery: {
    id: number;
    name: string;
    phone: string;
    diary_value: number;
  }) => void;
  removeDelivery: (id: number) => Promise<void>;
};

export const useDeliveryStore = create(
  persist<State & Actions>(
    (set, get) => ({
      deliveries: [],
      loading: true,
      setLoading: (loading) => set({ ...get(), loading }),
      addDelivery: async (delivery) => {
        set({ ...get(), loading: true });
        const { data } = await fetch(
          "/api/deliveries",
          {
            method: "POST",
            body: JSON.stringify(delivery),
          }
        ).then((resp) => resp.json());

        set({
          ...get(),
          deliveries: [data, ...get().deliveries],
          loading: false,
        });
      },
      editDelivery: async (delivery) => {
        set({ ...get(), loading: true });
        const id = delivery.id
        // @ts-expect-error removido porque não é necessário
        delete delivery.id
        const { data } = await fetch(
          `/api/deliveries/${id}`,
          {
            method: "PUT",
            body: JSON.stringify(delivery),
          }
        ).then((resp) => resp.json());

        set({
          ...get(),
          deliveries: get().deliveries.map((deliveryItem) =>{
            if(deliveryItem.id === id){
              return {
                ...deliveryItem,
                ...delivery
              }
            }
            return deliveryItem
          }),
          loading: false,
        });
      },
      removeDelivery: async (id) => {
        set({ ...get(), loading: true });
        await fetch(
          `/api/deliveries/${id}`,
          {
            method: "DELETE",
          }
        ).then((resp) => resp.json());

        set({
          ...get(),
          deliveries: get().deliveries.filter((delivery) => delivery.id !== id),
          loading: false,
        });
      },
      getDeliveryManSelect: async () => {
        let deliveries = get().deliveries;
        if (!Array.isArray(deliveries) || deliveries.length === 0) {
            deliveries = await get().loadDeliveries();
        }
        return deliveries.map((deliveryMan) => ({
            label: deliveryMan.name,
            value: deliveryMan.id,
        }));
    },    
      loadDeliveries: async () => {
        const deliveries = get().deliveries;
        if (deliveries.length === 0) {
          set({ ...get(), loading: true });
          const { data: deliveryData } = await fetch(
            "/api/deliveries"
          ).then((resp) => resp.json());
          set({ ...get(), deliveries: deliveryData, loading: false });

          return deliveryData;
        }
        return deliveries;
      },
    }),
    {
      name: "delivery-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
