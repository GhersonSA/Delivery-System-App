import {
  BluetoothEscposPrinter,
  BluetoothManager,
  type BluetoothDevice,
} from 'react-native-bluetooth-escpos-printer';
import { EscPosTransport, Tp510ubTargetConfig } from './types';

const DEFAULT_NAME_HINT = 'TP510UB';

function bytesToBase64(bytes: Uint8Array): string {
  const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';

  for (let index = 0; index < bytes.length; index += 3) {
    const b1 = bytes[index] ?? 0;
    const b2 = bytes[index + 1] ?? 0;
    const b3 = bytes[index + 2] ?? 0;

    const triple = (b1 << 16) | (b2 << 8) | b3;

    result += alphabet[(triple >> 18) & 0x3f];
    result += alphabet[(triple >> 12) & 0x3f];
    result += index + 1 < bytes.length ? alphabet[(triple >> 6) & 0x3f] : '=';
    result += index + 2 < bytes.length ? alphabet[triple & 0x3f] : '=';
  }

  return result;
}

function parseBluetoothDevices(raw: unknown): BluetoothDevice[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const devices: BluetoothDevice[] = [];
  raw.forEach((entry) => {
    if (typeof entry === 'string') {
      try {
        const parsed = JSON.parse(entry) as BluetoothDevice;
        devices.push(parsed);
      } catch {
        const [name, address] = entry.split('#');
        devices.push({ name, address });
      }
      return;
    }

    if (typeof entry === 'object' && entry !== null) {
      devices.push(entry as BluetoothDevice);
    }
  });

  return devices;
}

function resolveTargetDevice(
  devices: BluetoothDevice[],
  config: Tp510ubTargetConfig,
): BluetoothDevice | undefined {
  if (config.deviceAddress) {
    const byAddress = devices.find((device) => device.address === config.deviceAddress);
    if (byAddress) {
      return byAddress;
    }
  }

  const hint = (config.deviceNameHint ?? DEFAULT_NAME_HINT).toUpperCase();
  return devices.find((device) => (device.name ?? '').toUpperCase().includes(hint));
}

let connectedAddress: string | undefined;

export class Tp510ubBluetoothTransport implements EscPosTransport {
  constructor(private readonly config: Tp510ubTargetConfig = {}) {}

  private async ensureConnected(): Promise<void> {
    if (connectedAddress) {
      return;
    }

    const available = await BluetoothManager.enableBluetooth();
    const devices = parseBluetoothDevices(available);
    const target = resolveTargetDevice(devices, this.config);

    if (!target?.address) {
      throw new Error(
        'TP510UB not found. Pair the printer first and provide deviceAddress when needed.',
      );
    }

    await BluetoothManager.connect(target.address);
    connectedAddress = target.address;
  }

  async write(data: Uint8Array): Promise<void> {
    await this.ensureConnected();

    const rawFn =
      BluetoothEscposPrinter.printRawData ?? BluetoothEscposPrinter.printerRawData;

    if (!rawFn) {
      throw new Error(
        'Raw ESC/POS print method not available in BluetoothEscposPrinter bridge.',
      );
    }

    await rawFn(bytesToBase64(data));
  }
}
