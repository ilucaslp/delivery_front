interface OfficeItem extends BaseType {
  /**
   * opened - 1 - Em espera | 2 - Aberto | 3 - Fechado
   */
  opened: number;

  opened_at: string;

  closed_at: string;
  
  price_tax_default: number;

  attendances?: AttendanceItem[]
}
