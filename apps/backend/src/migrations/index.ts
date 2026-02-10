import * as migration_20260205_060627 from './20260205_060627';
import * as migration_20260210_024142 from './20260210_024142';

export const migrations = [
  {
    up: migration_20260205_060627.up,
    down: migration_20260205_060627.down,
    name: '20260205_060627',
  },
  {
    up: migration_20260210_024142.up,
    down: migration_20260210_024142.down,
    name: '20260210_024142'
  },
];
