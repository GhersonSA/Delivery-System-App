export interface EscPosTransport {
  write(data: Uint8Array): Promise<void>;
}

export interface Tp510ubTargetConfig {
  deviceAddress?: string;
  deviceNameHint?: string;
}
