/**
 * Custom hook for confirmation dialogs
 * Returns a function that shows a confirmation dialog
 */
export function useConfirm() {
  const confirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const result = window.confirm(message);
      resolve(result);
    });
  };

  return { confirm };
}

