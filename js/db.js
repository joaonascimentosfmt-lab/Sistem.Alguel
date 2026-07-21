class DB {
  constructor() {
    this.dbName = 'ImobAdminDB';
    this.version = 1;
    this.db = null;
    this.stores = ['properties', 'tenants', 'contracts', 'receipts', 'expenses', 'leads', 'events'];
  }

  async open() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.version);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        this.stores.forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            const os = db.createObjectStore(store, { keyPath: 'id', autoIncrement: true });
            os.createIndex('createdAt', 'createdAt', { unique: false });
          }
        });
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }
      };
      req.onsuccess = (e) => { this.db = e.target.result; resolve(); };
      req.onerror = (e) => { reject(e.target.error); };
    });
  }

  async getAll(store) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readonly');
      const os = tx.objectStore(store);
      const req = os.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getById(store, id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readonly');
      const os = tx.objectStore(store);
      const req = os.get(Number(id));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async add(store, data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readwrite');
      const os = tx.objectStore(store);
      data.createdAt = new Date().toISOString();
      data.updatedAt = data.createdAt;
      const req = os.add(data);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async put(store, data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readwrite');
      const os = tx.objectStore(store);
      data.updatedAt = new Date().toISOString();
      const req = os.put(data);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async delete(store, id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readwrite');
      const os = tx.objectStore(store);
      const req = os.delete(Number(id));
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async query(store, fn) {
    const all = await this.getAll(store);
    return all.filter(fn);
  }

  async getMeta(key) {
    try {
      const tx = this.db.transaction('meta', 'readonly');
      const os = tx.objectStore('meta');
      return new Promise((resolve) => {
        const req = os.get(key);
        req.onsuccess = () => resolve(req.result ? req.result.value : null);
        req.onerror = () => resolve(null);
      });
    } catch { return null; }
  }

  async setMeta(key, value) {
    const tx = this.db.transaction('meta', 'readwrite');
    const os = tx.objectStore('meta');
    return new Promise((resolve, reject) => {
      const req = os.put({ key, value });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async search(term) {
    term = term.toLowerCase();
    const results = [];
    const stores = [
      { name: 'properties', fields: ['name', 'code', 'neighborhood', 'city', 'type'] },
      { name: 'tenants', fields: ['name', 'cpf', 'phone', 'email'] },
      { name: 'contracts', fields: [] },
      { name: 'leads', fields: ['name', 'phone', 'email'] },
    ];
    for (const { name, fields } of stores) {
      const items = await this.getAll(name);
      items.forEach(item => {
        for (const field of fields) {
          if (item[field] && String(item[field]).toLowerCase().includes(term)) {
            results.push({ type: name, item, match: field });
            return;
          }
        }
      });
    }
    return results;
  }
}

window.db = new DB();
