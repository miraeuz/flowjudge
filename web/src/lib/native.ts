export interface ActivationStatus {
  state: 'ok' | 'none' | 'expired' | 'clock';
  name?: string;
  daysLeft?: number;
}

export interface TelegramStatus {
  configured: boolean;
  chatId: string;
  secureStorageAvailable: boolean;
}

export interface TelegramSolvedPayload {
  profileId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  groupName: string;
  problemId: string;
  problemTitle: string;
}

export interface MiraeNativeBridge {
  activation: {
    status(): Promise<ActivationStatus>;
    request(name: string): Promise<{ ok: boolean; error?: string }>;
    verify(code: string): Promise<{ ok: boolean; error?: string }>;
  };
  telegram: {
    status(): Promise<TelegramStatus>;
    save(token: string, chatId: string): Promise<{ ok: boolean; error?: string }>;
    test(): Promise<{ ok: boolean; error?: string }>;
    clear(): Promise<{ ok: boolean; error?: string }>;
    notifySolved(payload: TelegramSolvedPayload): Promise<{ status: 'sent' | 'queued' | 'already_sent' | 'not_configured' | 'invalid' }>;
  };
}

declare global {
  interface Window {
    miraeNative?: MiraeNativeBridge;
  }
}

export const nativeBridge = () => window.miraeNative;
