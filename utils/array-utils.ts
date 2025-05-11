export function arrayChanged<T>(a: T[], b: T[]): boolean {
    return (
      a.length !== b.length || !a.every((val) => b.includes(val))
    );
  }