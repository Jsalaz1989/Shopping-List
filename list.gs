function getFirstListRow() { return SpreadsheetApp.getActiveSpreadsheet().getRangeByName('ListHeadingRow').getRow() + 1 }
function getLastListRow() { return getSheet('List').getMaxRows() }

function clearList() {
  
  debugPrint('Clearing list')

  var firstListRow = getFirstListRow()
  var lastListRow = getLastListRow()

  if (firstListRow !== lastListRow) 
    getSheet('List').deleteRows(firstListRow, lastListRow - firstListRow)
}


function addItemToList(sheet, item, coupon, need) {

  debugPrint('item = ' + item)
  
  var lastListRow = getLastListRow(sheet)
  sheet.insertRows(lastListRow)

   
  var range = sheet.getRange(lastListRow, 2, 1, 3)
  
  range.getCell(1,1).setValue(item)
  range.getCell(1,3).insertCheckboxes()

  
  if (need) {
    range.getCell(1,3).check()
    range.setFontColor('#999999')
  }
  
  if (coupon) {
    range.setFontColor('#ea9999')
  }
}

function checkUncheckItem(clickedRange, clickedRow) {
 
  var checked = clickedRange.getValue()
  debugPrint('checked = ' + checked)
  
  var range = getSheet('List').getRange(clickedRow, 2, 1, 3)

  if (checked) {
    range.setFontColor('#999999')
  }
  else if (!checked) {
    range.setFontColor('black')
  }
  
  var item = range.getCell(1,1).getValue() 
  var itemsSheet = getSheet('Items')  
  
  var itemRow = findRow(item, itemsSheet)
  debugPrint('itemRow = ' + itemRow)

  itemsSheet.getRange(itemRow, 5).setValue(checked)
  
}

function updateList() {

  clearList()
  
  var filterRange = getNamedRange('Filter')
  var filterValue = filterRange.getValue()
  
  var sortRange = getNamedRange('Sort')
  var sortValue = sortRange.getValue()
  
  debugPrint('Updating list')
  
  var itemsSheet = getSheet('Items')
  
  var sortColumn = 0
  
  debugPrint('sortValue = ' + sortValue)
  
  if      (sortValue === 'Alphabet')   sortColumn = 1
  else if (sortValue === 'Category')   sortColumn = 3
  else if (sortValue === 'Coupon')     sortColumn = 4
  else if (sortValue === 'Need')       sortColumn = 5
  
  debugPrint('Sorting by column ' + sortColumn)

  itemsSheet.sort(sortColumn)

  
  var listSheet = getSheet('List')
  
  var items = itemsSheet.getDataRange().getValues()
  debugPrint('items = ' + items)
  
  listSheet.insertRows(getFirstListRow())
   
  for (var i = 0; i < items.length; i++) {
    
    var item = items[i]
    debugPrint('item = ' + item)

    var itemStores = item[1]
    debugPrint('itemStores = ' + itemStores)
    
    debugPrint('filterValue = ' + filterValue)

    var foundInStore = itemStores.indexOf(filterValue)
    debugPrint('foundInStore = ' + foundInStore)
    
    if (filterValue === 'All') foundInStore = 0

    debugPrint(Utilities.formatString('"%s" found/not found in itemStores "%s" (length %s) so item[0] = %s is/is not found in %s according to foundInStore = %s', filterValue, itemStores, itemStores.length, item[0], filterValue, foundInStore))
  
    if (foundInStore >= 0) 
      addItemToList(listSheet, item[0], item[3], item[4])
  }
}
