export interface CallModalWindowI {
  isVisible: boolean;
  onClose: () => void;
  initialValue: string;
  onSave: (newValue: string, newDescription: string) => void;
}
