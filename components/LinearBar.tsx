import React from "react";
import Svg, {
  Defs,
  LinearGradient,
  NumberProp,
  Rect,
  Stop
} from "react-native-svg";

export interface LinearBarProps {
  height: NumberProp;
  width: NumberProp;
  startColor: string;
  endColor: string;
}

const LinearBar = ({
  endColor,
  startColor,
  height,
  width,
}: LinearBarProps): JSX.Element => {
  return (
    <Svg height={height} width={width}>
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={startColor} stopOpacity={1} />
          <Stop offset="1" stopColor={endColor} stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#grad)" />
    </Svg>
  );
};

export default LinearBar;
