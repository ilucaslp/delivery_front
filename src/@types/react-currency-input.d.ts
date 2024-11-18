import CurrencyInput from "react-currency-input";

declare module "react-currency-input" {
  interface CurrencyInputProps {
    value: string | number;
    onChange: (value: string) => void;
    prefix?: string;
    suffix?: string;
    decimalSeparator?: string;
    groupSeparator?: string;
    className?: string;
    // Add other props that are part of the component's API
  }

  const CurrencyInput: React.FC<CurrencyInputProps>;
  export default CurrencyInput;
}
