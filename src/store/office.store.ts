import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  office?: OfficeItem;
  loading: boolean;
  finished: boolean;
};

type Actions = {
  loadOffice: () => Promise<OfficeItem>;
  setLoading: (loading: boolean) => void;
  openOffice: () => Promise<void>;
  closeOffice: () => Promise<void>;
  setFinished: (finished: boolean) => void;
  updateOffice: (value: number) => Promise<void>;
};

export const useOfficeStore = create(
  persist<State & Actions>(
    (set, get) => ({
      loading: true,
      finished: false,
      setLoading: (loading) => set({ ...get(), loading }),
      setFinished: (finished) => set({ ...get(), finished }),
      loadOffice: async () => {
        const office = get().office;
        if (!office) {
          set({ ...get(), loading: true });
          const { data: officeData } = await fetch("/api/office").then((resp) =>
            resp.json()
          );
          set({ ...get(), office: officeData, loading: false });

          return officeData;
        }
        return office;
      },
      updateOffice: async (value: number) => {
        const office = get().office;
        if (office) {
          set({ ...get(), loading: true });
          const { data: officeData } = await fetch("/api/office", {
            method: "PUT",
            body: JSON.stringify({
              price_tax_default: value,
              office_id: office.id,
            }),
          }).then((resp) => resp.json());
          set({ ...get(), office: officeData, loading: false });
        }
      },
      openOffice: async () => {
        const office = get().office;
        if (office) {
          set({ ...get(), loading: true });
          const { data: officeData } = await fetch("/api/office", {
            method: "PUT",
            body: JSON.stringify({
              opened: 2,
              office_id: office.id,
            }),
          }).then((resp) => resp.json());
          set({ ...get(), office: officeData, loading: false });
        }
      },
      closeOffice: async () => {
        const office = get().office;
        if (office) {
          set({ ...get(), loading: true });
          const { data: officeData } = await fetch("/api/office", {
            method: "PUT",
            body: JSON.stringify({
              opened: 3,
              office_id: office.id,
            }),
          }).then((resp) => resp.json());

          set({ ...get(), office: officeData, finished: true, loading: false });
        }
      },
    }),
    {
      name: "office-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
