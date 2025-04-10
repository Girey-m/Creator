export interface CallModalWindowI {
  isVisible: boolean;
  onClose: () => void;
  initialValue: { title: string; description: string; priority: string };
  onSave: (newValue: string, newDescription: string, priority: string) => void;
}
