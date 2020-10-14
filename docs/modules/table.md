The Table module provides an API for working with tables. 

## Configuration

```javascript
var quill = new DevExpress.Quill('#editor', {
  modules: {
    table: true
  }
});
```

## API

#### insertTable

Adds a table into a current selection range

**Methods**

```js
insertTable(rows: number, columns: number)
```

**Examples**

```js
quill.setSelection(5);
quill.table.insertTable(2, 2);
```

#### insertRow

Adds a row from above or below the current position. The position of the added row depends on the `offset` parameter value.

**Methods**

```js
insertRow(offset: number)
```

**Examples**

```js
quill.table.insertRow(1); // insert row below
quill.table.insertRow(0); // insert row above
quill.table.insertRow(-3); // insert a row three rows above the current position
quill.table.insertRow(3); // insert a row three rows below the current position
```


#### insertRowAbove

Adds a row from above the current position.

**Methods**

```js
insertRowAbove()
```

**Examples**

```js
quill.table.insertRowAbove();
```


#### insertRowBelow

Adds a row from below the current position.

**Methods**

```js
insertRowBelow()
```

**Examples**

```js
quill.table.insertRowBelow();
```

#### insertColumn

Adds a column to the left or right of the current position. The position of the added column depends on the `offset` parameter value.

**Methods**

```js
quill.table.insertColumn(1); // insert row to the right
quill.table.insertColumn(0); // insert row to the left
quill.table.insertColumn(-3); // insert a column by 3 columns to the left
quill.table.insertColumn(3); // insert a column by 3 columns to the right
```

**Examples**

```js
quill.table.insertColumn();
```


#### insertColumnLeft

Adds a column to the left of the current position.

**Methods**

```js
insertColumnLeft(offset: number)
```

**Examples**

```js
quill.table.insertColumnLeft();
```


#### insertColumnRight

Adds a column to the right of the current position.

**Methods**

```js
insertColumnRight(offset: number)
```

**Examples**

```js
quill.table.insertColumnRight();
```


#### getTable

Get the table at the specified range.

**Methods**

```js
getTable(range = this.quill.getSelection()): [table, row, cell, offset]
```

**Examples**

```js
const currentTable = quill.getTable();
const tableBySpecificRange = quill.table.getTable({ index: 3, length: 0 });
```


#### deleteRow

Delete the row at the current selection range.

**Methods**

```js
deleteRow()
```

**Examples**

```js
quill.setSelection(4);
quill.table.deleteRow();
```


#### deleteColumn

Delete the column at the current selection range.

**Methods**

```js
deleteColumn()
```

**Examples**

```js
quill.setSelection(4);
quill.table.deleteColumn();
```


#### deleteTable

Delete the table at the current selection range.

**Methods**

```js
deleteTable()
```

**Examples**

```js
quill.setSelection(4);
quill.table.deleteTable();
```