// Global type declarations

declare module "*.jsx" {
  import { ReactElement } from "react";
  const Component: () => ReactElement;
  export default Component;
}

declare module "*.js" {
  const value: unknown;
  export default value;
}
