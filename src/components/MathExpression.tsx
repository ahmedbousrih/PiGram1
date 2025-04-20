import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import styled from 'styled-components';

interface MathExpressionProps {
  inline?: boolean;
  expression: string;
}

const MathExpression: React.FC<MathExpressionProps> = ({ inline = true, expression }) => {
  return inline ? (
    <InlineMath math={expression} />
  ) : (
    <BlockMath math={expression} />
  );
};

export default MathExpression;
