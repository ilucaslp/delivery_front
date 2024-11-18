import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  attendances: AttendanceItem[];
  loading: boolean;
};

type Actions = {
  setAttendances: (attendances: AttendanceItem[]) => void;
  setLoading: (loading: boolean) => void;
  loadAttendances: (office: OfficeItem) => Promise<void>;
  addAttendance: (attendance: {
    code_order: string;
    delivery_id: number;
    payment_method: string;
    tax_order: number;
    office_id: number;
  }) => void;
  updateAttendance: (
    office_id: number,
    id: number,
    status: number
  ) => Promise<{ message: string; status: boolean }>;
};

export const useAttendanceStore = create(
  persist<State & Actions>(
    (set, get) => ({
      loading: true,
      setLoading: (loading) => set({ ...get(), loading }),
      attendances: [],
      setAttendances: (attendances) => {
        set({ ...get(), attendances });
      },
      addAttendance: async (attendance) => {
        set({ ...get(), loading: true });
        const { data }: ResponseAttendancePOSTAPI = await fetch(
          "/api/attendances/" + attendance.office_id,
          {
            method: "POST",
            body: JSON.stringify(attendance),
          }
        ).then((resp) => resp.json());
        set({
          ...get(),
          attendances: [data, ...get().attendances],
          loading: false,
        });
      },
      loadAttendances: async (office) => {
        const attendances = get().attendances;
        if (attendances.length === 0 || office) {
          set({ ...get(), loading: true });
          const { data }: ResponseAttendanceAPI = await fetch(
            "/api/attendances/" + office.id
          ).then((resp) => resp.json());
          set({ ...get(), attendances: data, loading: false });
        }
      },
      updateAttendance: async (
        office_id: number,
        id: number,
        status: number
      ) => {
        set({ ...get(), loading: true });
        const response = await fetch(
          "/api/attendances/" + office_id + "/" + id,
          {
            method: "PUT",
            body: JSON.stringify({
              status,
            }),
          }
        );
        if (response.ok) {
          set({
            ...get(),
            attendances: get().attendances.map((attendance) => {
              if (attendance.id === id) {
                attendance.status = status;
              }
              return attendance;
            }),
            loading: false,
          });
          return { message: "Atualização concluída com sucesso", status: true };
        } else {
          const body = await response.json();
          set({
            ...get(),
            loading: false,
          });
          return { message: body.message, status: false };
        }
      },
    }),
    {
      name: "attendance-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
