import { readFileSync } from 'fs';
import * as _ from 'lodash'; // lodash has no default export
import { Interface } from 'readline';

// TODO: create a generic type for `converters.colName`
interface Options {
  converters?: {};
}

function loadCSV(filename: string, options?: Options): void {
  const csv: string = readFileSync(filename, { encoding: 'utf-8' });

  /**
   * create a nested array of rows with nested array of columns
   * [
   *  row[column,column],
   *  row[column,column]
   * ]
   */
  let csvArrays: Array<Array<string | number | boolean>> = csv.split('\n').map((row) => {
    return row.split(',');
  });

  // drop any empty columns artificats from spreadsheet exports
  csvArrays = csvArrays.map((row) => _.dropRightWhile(row, (val) => val === ''));

  // removes single and double quotes after columns parsed
  csvArrays = csvArrays.map((row) => row.map((val: any) => _.trim(val, '\'"')));

  /**
   * identify headers row, but don't remove it from csvArrays so that it
   * can be used as a column identifier
   */
  const headers: any[] = _.first(csvArrays);

  /**
   * Parsing Data in each column by row
   */
  csvArrays = csvArrays.map((row: any[], index: number) => {
    // ignore headers column
    if (index === 0) {
      return row;
    }

    /**
     * Parse data for datatypes
     */
    return row.map((column: any, index: number) => {
      /**
       * Process converters passed in the options object
       */
      if (options.converters[headers[index]]) {
        const converted = options.converters[headers[index]](column);
        return _.isNaN(converted) ? column : converted;
      }
      /**
       * If value is numeric, return the number rather than string
       */
      const result = parseFloat(column);
      return _.isNaN(result) ? column : result;
    });
  });

  console.log('headers: ', headers, 'csvArrays: ', csvArrays);
}

loadCSV('./data/data.csv', {
  converters: {
    passed: (val) => (val === 'TRUE' ? 'yes' : 'no'),
  },
});
