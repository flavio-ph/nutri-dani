// lib/db.ts
import Dexie, { Table } from 'dexie';
import { Food } from '../types/food';

export class NutritionDatabase extends Dexie {
    customFoods!: Table<Food>;

    constructor() {
        super('NutritionDatabase');
        // Indexamos apenas as colunas que usaremos para busca
        this.version(1).stores({
            customFoods: 'id, name, source'
        });
    }
}

export const db = new NutritionDatabase();