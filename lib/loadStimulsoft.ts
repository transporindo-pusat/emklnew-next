export const loadStimulsoftScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Already loaded and ready
    if (typeof window !== 'undefined' && (window as any).Stimulsoft?.Base) {
      resolve();
      return;
    }

    const TIMEOUT_MS = 30000;

    const waitForGlobal = () => {
      const start = Date.now();
      const poll = setInterval(() => {
        if ((window as any).Stimulsoft?.Base) {
          clearInterval(poll);
          resolve();
        } else if (Date.now() - start > TIMEOUT_MS) {
          clearInterval(poll);
          reject(new Error('Stimulsoft failed to initialize within timeout'));
        }
      }, 100);
    };

    const loadScript = (src: string, id: string): Promise<void> => {
      return new Promise((res, rej) => {
        if (document.getElementById(id)) {
          res();
          return;
        }
        const s = document.createElement('script');
        s.id = id;
        s.src = src;
        s.async = false; // preserve load order
        s.onload = () => res();
        s.onerror = () => rej(new Error(`Failed to load: ${src}`));
        document.head.appendChild(s);
      });
    };

    // Load main bundle first, then the blockly editor addon
    loadScript(
      '/stimulsoft/Scripts/stimulsoft.reports.js',
      'stimulsoft-reports'
    )
      .then(() =>
        loadScript(
          '/stimulsoft/Scripts/stimulsoft.viewer.pack.js',
          'stimulsoft-viewer'
        )
      )
      .then(() => waitForGlobal())
      .catch(reject);
  });
};
