import { toast as showToast } from '../components/ui/use-toast';

export function useToast() {
  return {
    toast: showToast,
  };
}
