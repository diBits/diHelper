export class ModuleManager {
  constructor() {
    this.modules = new Map();
  }

  register(name, moduleInstance) {
    if (!name) {
      throw new Error("ModuleManager: nome do módulo é obrigatório");
    }

    if (!moduleInstance) {
      throw new Error(`ModuleManager: instância inválida para o módulo "${name}"`);
    }

    this.modules.set(name, moduleInstance);
    return moduleInstance;
  }

  get(name) {
    return this.modules.get(name) ?? null;
  }

  has(name) {
    return this.modules.has(name);
  }

  stopAll() {
    for (const moduleInstance of this.modules.values()) {
      try {
        moduleInstance?.stop?.();
      } catch (e) {
        console.error("[DIHELPER] ModuleManager: erro ao parar módulo:", e);
      }
    }
  }
}