const DEFAULT_API_URL = 'http://10.0.2.2:3001';

export const getApiBaseUrl = (): string => {
  const runtimeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env;
  const fromEnv = runtimeEnv?.EXPO_PUBLIC_API_URL ?? runtimeEnv?.REACT_NATIVE_API_URL;
  return fromEnv ?? DEFAULT_API_URL;
};
