declare module 'react-native-bluetooth-escpos-printer' {
  export interface BluetoothDevice {
    name?: string;
    address?: string;
  }

  export const BluetoothManager: {
    enableBluetooth: () => Promise<unknown>;
    connect: (address: string) => Promise<unknown>;
    disconnect?: (address: string) => Promise<unknown>;
  };

  export const BluetoothEscposPrinter: {
    printRawData?: (data: string) => Promise<unknown>;
    printerRawData?: (data: string) => Promise<unknown>;
  };
}
