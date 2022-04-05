import {
  BarCodeScanner as Scanner,
  BarCodeScannerProps,
} from "expo-barcode-scanner";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text } from "./Themed";

const BarCodeScanner: React.FC<BarCodeScannerProps> = ({
  style,
  ...otherProps
}) => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestPerms();
  }, []);

  const requestPerms = useCallback(async () => {
    const { status } = await Scanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  }, []);

  if (!hasPermission) {
    return (
      <View>
        <Button onPress={requestPerms}>
          <Text style={{ textAlign: "center" }}>Request permissions</Text>
        </Button>
      </View>
    );
  }

  return (
    <Scanner
      style={[
        style,
        {
          flex: 1,
        },
      ]}
      {...otherProps}
    />
  );
};

export default BarCodeScanner;
