import Delta from 'quill-delta';
import Quill from '../../../core/quill';
import TableLite from '../../../modules/table/lite';
import capitalize from '../../../utils/capitalize';
import {
  CELL_STYLE_TESTS_PRESET,
  TABLE_STYLE_TESTS_PRESET,
} from '../../helpers/table_format_presets';

describe('Table Module', function() {
  beforeAll(function() {
    Quill.register({ 'modules/table': TableLite }, true);
  });

  describe('clipboard integration', function() {
    it('formatted table', function() {
      const quill = this.initialize(Quill, '<p><br></p>', this.container, {
        modules: {
          table: true,
        },
      });
      const markup = `
      <table style="border: 2px dashed green; background-color: azure;" width="800px" height="600px">
        <tbody>
          <tr><td style="border: 2px solid red; text-align: center; vertical-align: bottom; background-color: aliceblue; padding-top: 10px;">a1</td><td width="100px" height="100px" style="padding: 20px;">a2</td><td>a3</td></tr>
        </tbody>
      </table>
      `;
      const delta = quill.clipboard.convert({ html: markup });
      const tableAttrs = {
        table: 1,
        tableBackgroundColor: 'azure',
        tableBorder: '2px dashed green',
        tableHeight: '600px',
        tableWidth: '800px',
      };
      expect(delta).toEqual(
        new Delta()
          .insert('a1\n', {
            cellBackgroundColor: 'aliceblue',
            cellBorder: '2px solid red',
            cellPaddingTop: '10px',
            cellTextAlign: 'center',
            cellVerticalAlign: 'bottom',
            ...tableAttrs,
          })
          .insert('a2\n', {
            cellHeight: '100px',
            cellPadding: '20px',
            cellWidth: '100px',
            ...tableAttrs,
          })
          .insert('a3\n', tableAttrs),
      );
    });
  });

  describe('insert table', function() {
    it('empty', function() {
      const quill = this.initialize(Quill, '<p><br></p>', this.container, {
        modules: {
          table: true,
        },
      });
      const table = quill.getModule('table');
      quill.setSelection(0);
      table.insertTable(2, 3);
      expect(quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td><br></td><td><br></td><td><br></td></tr>
            <tr><td><br></td><td><br></td><td><br></td></tr>
          </tbody>
        </table>
        <p><br></p>
      `);
    });

    it('initial markup with formatting', function() {
      const markup = `
      <table style="background-color: azure;">
        <tbody>
          <tr>
            <td style="background-color: aliceblue;">a1</td>
            <td style="padding: 20px;">a2</td>
            <td>a3</td></tr>
        </tbody>
      </table>
      `;
      const quill = this.initialize(Quill, markup, this.container, {
        modules: {
          table: true,
        },
      });
      expect(quill.root).toEqualHTML(markup);
    });

    it('head', function() {
      const quill = this.initialize(
        Quill,
        `
        <table>
          <thead>
            <tr>
              <th data-tablelite-header-row="1">H1</th>
              <th data-tablelite-header-row="1">H2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-tablelite-row="a">A1</td>
              <td data-tablelite-row="a">A2</td>
            </tr>
          </tbody>
        </table>`,
        this.container,
        {
          modules: {
            table: true,
          },
        },
      );

      expect(quill.root).toEqualHTML(`
      <table>
        <thead>
          <tr>
            <th data-tablelite-header-row="1">H1</th>
            <th data-tablelite-header-row="1">H2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-tablelite-row="a">A1</td>
            <td data-tablelite-row="a">A2</td>
          </tr>
        </tbody>
      </table>`);
    });

    it('initial markup with thead and formatting', function() {
      const markup = `
      <table style="background-color: azure;">
        <thead>
          <tr>
            <th>h1</th>
            <th>h2</th>
            <th>h3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="background-color: aliceblue;">a1</td>
            <td style="padding: 20px;">a2</td>
            <td>a3</td>
          </tr>
        </tbody>
      </table>
      `;
      const quill = this.initialize(Quill, markup, this.container, {
        modules: {
          table: true,
        },
      });
      expect(quill.root).toEqualHTML(markup);
    });

    it('split', function() {
      const quill = this.initialize(Quill, '<p>0123</p>', this.container, {
        modules: {
          table: true,
        },
      });
      const table = quill.getModule('table');
      quill.setSelection(2);
      table.insertTable(2, 3);
      expect(quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td>01</td><td><br></td><td><br></td></tr>
            <tr><td><br></td><td><br></td><td><br></td></tr>
          </tbody>
        </table>
        <p>23</p>
      `);
    });

    it('initial balancing', function() {
      const quill = this.initialize(
        Quill,
        `
        <table>
          <thead>
            <tr><th>h1</th></tr>
          </thead>
          <tbody>
            <tr><td>b1</td><td>b2</td></tr>
          </tbody>
        </table>
      `,
        this.container,
        {
          modules: {
            table: true,
          },
        },
      );

      expect(quill.root).toEqualHTML(`
        <table>
          <thead>
            <tr><th>h1</th><th><br></th></tr>
          </thead>
          <tbody>
            <tr><td>b1</td><td>b2</td></tr>
          </tbody>
        </table>
      `);
    });

    it('old table module markup', function() {
      const quill = this.initialize(
        Quill,
        `<table>
          <tr>
            <td data-row="1">1</td>
            <td data-row="2">2</td>
          </tr>
        </table>`,
        this.container,
        {
          modules: {
            table: true,
          },
        },
      );

      expect(quill.root).toEqualHTML(
        `
          <table>
          <tbody>
            <tr>
              <td>1</td>
              <td>2</td>
            </tr>
          </tbody>
        </table>
      `,
        true,
      );
    });
  });

  describe('modify table', function() {
    beforeEach(function() {
      const tableHTML = `
        <table>
          <tbody>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `;
      this.quill = this.initialize(Quill, tableHTML, this.container, {
        modules: {
          table: true,
        },
      });
      this.table = this.quill.getModule('table');
    });

    it('insertHeaderRow', function() {
      this.quill.setSelection(0);
      this.table.insertHeaderRow();

      expect(this.quill.root).toEqualHTML(`
        <table>
          <thead>
            <tr><th><br></th><th><br></th><th><br></th></tr>
          </thead>
          <tbody>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('insertRowAbove', function() {
      this.quill.setSelection(0);
      this.table.insertRowAbove();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td><br></td><td><br></td><td><br></td></tr>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('insertRowAbove, selection at header', function() {
      this.quill.setSelection(0);
      this.table.insertHeaderRow();
      this.quill.setSelection(0);
      this.table.insertRowAbove();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <thead>
            <tr><th><br></th><th><br></th><th><br></th></tr>
          </thead>
          <tbody>
            <tr><td><br></td><td><br></td><td><br></td></tr>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('insertRowBelow', function() {
      this.quill.setSelection(0);
      this.table.insertRowBelow();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td><br></td><td><br></td><td><br></td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('insertRowBelow, selection at header', function() {
      this.quill.setSelection(0);
      this.table.insertHeaderRow();
      this.quill.setSelection(0);
      this.table.insertRowBelow();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <thead>
            <tr><th><br></th><th><br></th><th><br></th></tr>
          </thead>
          <tbody>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td><br></td><td><br></td><td><br></td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('insertColumnLeft', function() {
      this.quill.setSelection(0);
      this.table.insertColumnLeft();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td><br></td><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td><br></td><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('insertColumnLeft, selection at header', function() {
      this.quill.setSelection(0);
      this.table.insertHeaderRow();
      this.quill.setSelection(0);
      this.table.insertColumnLeft();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <thead>
            <tr><th><br></th><th><br></th><th><br></th><th><br></th></tr>
          </thead>
          <tbody>
            <tr><td><br></td><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td><br></td><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('insertColumnRight', function() {
      this.quill.setSelection(0);
      this.table.insertColumnRight();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td>a1</td><td><br></td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td><br></td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('insertColumnRight, selection at header', function() {
      this.quill.setSelection(0);
      this.table.insertHeaderRow();
      this.quill.setSelection(0);
      this.table.insertColumnRight();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <thead>
            <tr><th><br></th><th><br></th><th><br></th><th><br></th></tr>
          </thead>
          <tbody>
            <tr><td>a1</td><td><br></td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td><br></td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('deleteRow', function() {
      this.quill.setSelection(0);
      this.table.deleteRow();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('delete header row', function() {
      this.quill.setSelection(0);
      this.table.insertHeaderRow();
      this.quill.setSelection(0);
      this.table.deleteRow();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('deleteColumn', function() {
      this.quill.setSelection(0);
      this.table.deleteColumn();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td>a2</td><td>a3</td></tr>
            <tr><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('deleteColumn with header', function() {
      this.quill.setSelection(0);
      this.table.insertHeaderRow();
      this.quill.setSelection(0);
      this.table.deleteColumn();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <thead>
            <tr><th><br></th><th><br></th></tr>
          </thead>
          <tbody>
            <tr><td>a2</td><td>a3</td></tr>
            <tr><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('insertText before', function() {
      this.quill.updateContents(new Delta().insert('\n'));
      expect(this.quill.root).toEqualHTML(`
        <p><br></p>
        <table>
          <tbody>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('insertText after', function() {
      this.quill.updateContents(new Delta().retain(18).insert('\n'));
      expect(this.quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
        <p><br></p>
      `);
    });
  });

  describe('customize table', function() {
    beforeEach(function() {
      const tableHTML = `
        <table>
          <tbody>
            <tr><td>a1</td><td>a2</td></tr>
          </tbody>
        </table>
      `;
      this.quill = this.initialize(Quill, tableHTML, this.container, {
        modules: {
          table: true,
        },
      });
    });

    TABLE_STYLE_TESTS_PRESET.forEach(({ formatName, styleName, value }) => {
      it(`${formatName} table style`, function() {
        this.quill.setSelection(1, 0);
        this.quill.format(`table${capitalize(formatName)}`, value);
        expect(this.quill.root).toEqualHTML(
          `
            <table style="${styleName}: ${value};">
              <tbody>
                <tr>
                  <td>a1</td>
                  <td>a2</td>
                </tr>
              </tbody>
            </table>
          `,
          true,
        );
      });
    });

    CELL_STYLE_TESTS_PRESET.forEach(({ formatName, styleName, value }) => {
      it(`${formatName} cell style`, function() {
        this.quill.setSelection(1, 0);
        this.quill.format(`cell${capitalize(formatName)}`, value);
        expect(this.quill.root).toEqualHTML(
          `
            <table>
              <tbody>
                <tr>
                  <td style="${styleName}: ${value};">a1</td>
                  <td>a2</td>
                </tr>
              </tbody>
            </table>
          `,
          true,
        );
      });
    });

    it(`get table formats after formatting`, function() {
      this.quill.setSelection(4, 0);
      const formats = this.quill.getFormat();

      this.quill.format('tableBorderColor', 'red');
      formats.tableBorderColor = 'red';

      expect(this.quill.getFormat()).toEqual(formats);
    });
  });

  describe('customize table with headers', function() {
    beforeEach(function() {
      const tableHTML = `
        <table>
          <thead>
            <tr><th>h1</th><th>h2</th></tr>
          </thead>
          <tbody>
            <tr><td>a1</td><td>a2</td></tr>
          </tbody>
        </table>
      `;
      this.quill = this.initialize(Quill, tableHTML, this.container, {
        modules: {
          table: true,
        },
      });
    });

    TABLE_STYLE_TESTS_PRESET.forEach(({ formatName, styleName, value }) => {
      it(`${formatName} table style`, function() {
        this.quill.setSelection(1, 0);
        this.quill.format(`table${capitalize(formatName)}`, value);
        expect(this.quill.root).toEqualHTML(
          `
            <table style="${styleName}: ${value};">
              <thead>
                <tr><th>h1</th><th>h2</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>a1</td>
                  <td>a2</td>
                </tr>
              </tbody>
            </table>
          `,
          true,
        );
      });
    });

    CELL_STYLE_TESTS_PRESET.forEach(({ formatName, styleName, value }) => {
      it(`${formatName} cell style`, function() {
        this.quill.setSelection(1, 0);
        this.quill.format(`cell${capitalize(formatName)}`, value);
        expect(this.quill.root).toEqualHTML(
          `
            <table>
              <thead>
                <tr>
                  <th style="${styleName}: ${value};">h1</th>
                  <th>h2</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>a1</td><td>a2</td></tr>
              </tbody>
            </table>
          `,
          true,
        );
      });
    });
  });
});
