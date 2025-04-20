declare module 'react-katex' {
    import { FC } from 'react';
  
    interface MathProps {
      children?: string;
      math?: string;
      block?: boolean;
      errorColor?: string;
      renderError?: (error: Error) => JSX.Element;
    }
  
    export const InlineMath: FC<MathProps>;
    export const BlockMath: FC<MathProps>;
  } 