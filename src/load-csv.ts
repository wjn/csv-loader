import { readFileSync } from 'fs';
import * as _ from 'lodash';

function loadCSV(filename: string, options: Object = {}) {
  const data = readFileSync(filename, { encoding: 'utf-8' });
  console.log(data);
}

loadCSV('./data/data.csv');
