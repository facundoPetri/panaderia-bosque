import { toast } from "react-toastify";

// Tipo para las reglas de validación de texto
type TextValidationRule = {
  required?: boolean;
  maxLength?: number;
  minLength?: number;
};

// Validación de texto
const validateText = (
  value: string,
  rules: TextValidationRule,
  fieldName: string,
  customMessage?: string
): boolean => {
  if (rules.required && !value.trim()) {
    toast.error(customMessage || `${fieldName} es obligatorio.`);
    return false;
  }

  if (rules.minLength && value.trim().length < rules.minLength) {
    toast.error(
      customMessage ||
        `${fieldName} debe tener al menos ${rules.minLength} caracteres.`
    );
    return false;
  }

  if (rules.maxLength && value.trim().length > rules.maxLength) {
    toast.error(
      customMessage ||
        `${fieldName} no puede superar los ${rules.maxLength} caracteres.`
    );
    return false;
  }

  return true;
};

// Tipo para las reglas generales de validación numérica
type GeneralNumberValidationRule = {
  required?: boolean;
  isNegative?: boolean;
};

// Validación general de números
const validateGeneralNumber = (
  value: number,
  rules: GeneralNumberValidationRule,
  fieldName: string,
  customMessage?: string
): boolean => {
  if (
    rules.required &&
    (value === null || value === undefined || isNaN(value))
  ) {
    toast.error(customMessage || `${fieldName} es obligatorio.`);
    return false;
  }

  if (rules.isNegative && value >= 0) {
    toast.error(customMessage || `${fieldName} debe ser un número negativo.`);
    return false;
  }

  return true;
};

// Tipo para las reglas específicas de validación numérica
type SpecificNumberValidationRule = {
  min?: number;
  max?: number;
  compareTo?: { value: number; message?: string };
};

// Validación específica de números
const validateSpecificNumber = (
  value: number,
  rules: SpecificNumberValidationRule,
  fieldName: string,
  customMessage?: string
): boolean => {
  if (rules.min !== undefined && value < rules.min) {
    toast.error(customMessage || `${fieldName} no puede ser menor que ${rules.min}.`);
    return false;
  }

  if (rules.max !== undefined && value > rules.max) {
    toast.error(customMessage || `${fieldName} no puede ser mayor que el stock maximo ${rules.max}.`);
    return false;
  }

  if (rules.compareTo && value > rules.compareTo.value) {
    toast.error(
      customMessage ||
        rules.compareTo.message ||
        `${fieldName} no puede ser mayor que ${rules.compareTo.value}.`
    );
    return false;
  }

  return true;
};

const isDateRangeValid = (dateInit: Date | null, dateEnd: Date | null): boolean => {
  if (!dateInit || !dateEnd) {
    toast.error("Debe seleccionar ambas fechas.");
    return false;
  }

  if (dateInit > dateEnd) {
    toast.error("La fecha de inicio no puede ser mayor a la fecha de fin.");
    return false;
  }

  return true;
};

// Exportación de funciones
export { validateText, validateGeneralNumber, validateSpecificNumber, isDateRangeValid as validateDate };
