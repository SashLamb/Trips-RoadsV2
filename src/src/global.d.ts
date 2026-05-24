export interface IElectronAPI {
    openFile: () => Promise<string>;
    ping: () => Promise<string>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}