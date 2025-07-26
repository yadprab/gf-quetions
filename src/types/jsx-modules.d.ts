// types/jsx-modules.d.ts
declare module "*.jsx" {
  import type {ComponentType} from "react";
  const component: ComponentType<any>;
  export default component;
  export const [key: string]: ComponentType<any>;
}

declare module "*.js" {
  import type {ComponentType} from "react";
  const component: ComponentType<any>;
  export default component;
  export const [key: string]: ComponentType<any>;
}