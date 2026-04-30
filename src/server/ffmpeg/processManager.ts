export interface ManagedProcess {
  pid: number;
  kill(signal: NodeJS.Signals): void;
}

export interface ProcessManagerDependencies {
  spawnProcess(command: string, args: string[]): Promise<ManagedProcess>;
}

export interface ProcessManager {
  start(name: string, command: string, args: string[]): Promise<ManagedProcess>;
  stop(name: string): Promise<void>;
  stopAll(): Promise<void>;
  get(name: string): ManagedProcess | undefined;
}

export function createProcessManager(
  dependencies: ProcessManagerDependencies,
): ProcessManager {
  const processes = new Map<string, ManagedProcess>();

  return {
    async start(name, command, args) {
      if (processes.has(name)) {
        throw new Error(`Process already running: ${name}`);
      }

      const processInfo = await dependencies.spawnProcess(command, args);
      processes.set(name, processInfo);
      return processInfo;
    },

    async stop(name) {
      const processInfo = processes.get(name);

      if (!processInfo) {
        return;
      }

      processInfo.kill("SIGTERM");
      processes.delete(name);
    },

    async stopAll() {
      const names = [...processes.keys()];

      for (const name of names) {
        await this.stop(name);
      }
    },

    get(name) {
      return processes.get(name);
    },
  };
}
