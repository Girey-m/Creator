export interface CallModalWindowI {
  isVisible: boolean;
  onClose: () => void;
  initialValue: { title: string; description: string };
  onSave: (newValue: string, newDescription: string) => void;
}
