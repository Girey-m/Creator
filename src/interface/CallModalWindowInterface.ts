export interface CallModalWindowInterface {
  isVisible: boolean;
  onClose: () => void;
  initialValue: string;
  onSave: (newValue: string) => void;
}
