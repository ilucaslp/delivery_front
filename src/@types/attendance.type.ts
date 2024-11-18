interface AttendanceItem extends BaseType {
  status: number; // 1 - Em rota | 2 - Entregue | 3 - Cancelado
  delivery: DeliveryManItem;
  office: OfficeItem;
  code_order: string;
  payment_method: string;
  tax_delivery: number;
}

//@typescript-eslint/no-unused-vars
interface ResponseAttendanceAPI {
  data: AttendanceItem[];
}

//@typescript-eslint/no-unused-vars
interface ResponseAttendancePOSTAPI {
  data: AttendanceItem;
}
