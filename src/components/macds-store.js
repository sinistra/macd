import { writable } from 'svelte/store';

const macds = writable([]);

const customMacdsStore = {
  subscribe: macds.subscribe,
  setMacds: (macdArray) => {
    macds.set(macdArray);
  },
  addMacd: macdData => {
    const newMacd = {
      ...macdData
    };
    macds.update(items => {
      return [newMacd, ...items];
    });
  },
  updateMacd: (id, macdData) => {
    macds.update(items => {
      const macdIndex = items.findIndex(i => i.id === id);
      const updatedMacd = { ...items[macdIndex], ...macdData };
      const updatedMacds = [...items];
      updatedMacds[macdIndex] = updatedMacd;
      return updatedMacds;
    });
  },
  removeMacd: id => {
    macds.update(items => {
      return items.filter(i => i.id !== id);
    });
  }
};

export default customMacdsStore;
