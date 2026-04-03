import * as migration_20260205_060627 from './20260205_060627';
import * as migration_20260210_024142 from './20260210_024142';
import * as migration_20260212_084929 from './20260212_084929';
import * as migration_20260321_170629 from './20260321_170629';
import * as migration_20260403_073038 from './20260403_073038';

export const migrations = [
  {
    up: migration_20260205_060627.up,
    down: migration_20260205_060627.down,
    name: '20260205_060627',
  },
  {
    up: migration_20260210_024142.up,
    down: migration_20260210_024142.down,
    name: '20260210_024142',
  },
  {
    up: migration_20260212_084929.up,
    down: migration_20260212_084929.down,
    name: '20260212_084929',
  },
  {
    up: migration_20260321_170629.up,
    down: migration_20260321_170629.down,
    name: '20260321_170629',
  },
  {
    up: migration_20260403_073038.up,
    down: migration_20260403_073038.down,
    name: '20260403_073038'
  },
];
