// Module augmentation to patch react-map-gl v5 types for React 18.
// React 18 no longer includes `children` implicitly in component props,
// and @types/react-map-gl@5 was written before that change.
//
// We use `import type` to keep this file as a module (so `declare module`
// performs augmentation, not redeclaration) without taking a runtime side
// effect on react-map-gl.

import type { ReactNode } from "react";

declare module "react-map-gl" {
  interface InteractiveMapProps {
    children?: ReactNode;
  }

  interface MarkerProps {
    children?: ReactNode;
  }

  interface PopupProps {
    children?: ReactNode;
  }

  interface NavigationControlProps {
    children?: ReactNode;
  }
}
