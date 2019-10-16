function onOpen() {
  var ui = SpreadsheetApp.getUi()
  
  ui.createMenu('View / Modify')
      .addItem('View Stores', 'viewStores')
      .addItem('Add Store', 'addStore')
      .addItem('Delete Store', 'deleteStore')
      .addItem('Edit Store', 'editStore')
      .addSeparator()
      .addItem('View Categories', 'viewCategories')
      .addItem('Add Category', 'addCategory')
      .addItem('Delete Category', 'deleteCategory')
      .addItem('Edit Category', 'editCategory')
      .addSeparator()
      .addItem('View Items', 'viewItems')
      .addItem('Add Item', 'addItem')
      .addItem('Delete Item', 'deleteItem')
      .addSubMenu(ui.createMenu('Edit Item')
          .addItem('Edit Item Name', 'editItemName')
          .addItem('Add Store to Item', 'editItemAddStore')
          .addItem('Delete Store from Item', 'editItemDeleteStore')
          .addItem('Edit Item Category', 'editItemCategory')
          .addItem('Edit Item Coupon', 'editItemCoupon'))
      .addToUi()
}

function myOnEdit(evt) {
 
  var clickedRange = evt.range 
  var clickedRow = clickedRange.getRow()
  var clickedCol = clickedRange.getColumn()
    
  var filterRange = getNamedRange('Filter')
  var filterRow = filterRange.getRow()
  var filterCol = filterRange.getColumn()
  var filterValue = filterRange.getValue()
    
  var sortRange = getNamedRange('Sort')
  var sortRow = sortRange.getRow()
  var sortCol = sortRange.getColumn()
  var sortValue = sortRange.getValue()
  
  var chosenFunc = clickedRange.getValue()
  
  var action
  if      (filterRow === clickedRow && filterCol === clickedCol)   action = 'filter'
  else if (sortRow === clickedRow && sortCol === clickedCol)       action = 'sort'
  else                                                             action = 'viewModify'
  
  
  if (clickedCol === 3) {

    if (action === 'filter' || action === 'sort')                
      updateList()
      
    else if (action === 'viewModify') {
      
      var resetRange = getSheet('List').getRange(clickedRow, clickedCol)
      resetChoice(action, chosenFunc, resetRange)
      
      if      (chosenFunc === 'View Stores' || chosenFunc === 'View Stores' || chosenFunc === 'View Categories') {
        if      (chosenFunc === 'View Stores')                          viewStores()
        else if (chosenFunc === 'View Categories')                      viewCategories()
        else if (chosenFunc === 'View Items')                           viewItems()
      }
      else {
        if      (chosenFunc === 'Add Store')                            addStore()
        else if (chosenFunc === 'Delete Store')                         deleteStore()
        else if (chosenFunc === 'Edit Store')                           editStore()
        else if (chosenFunc === 'Add Category')                         addCategory()
        else if (chosenFunc === 'Delete Category')                      deleteCategory()
        else if (chosenFunc === 'Edit Category')                        editCategory()
        else if (chosenFunc === 'Add Item')                             addItem()
        else if (chosenFunc === 'Delete Item')                          { deleteItem(); debugPrint('fucckk I thought it was working 3') }
        else if (chosenFunc === 'Edit Item Name')                       editItemName()
        else if (chosenFunc === 'Add Item Store')                       editItemAddStore()
        else if (chosenFunc === 'Delete Item Store')                    editItemDeleteStore()
        else if (chosenFunc === 'Edit Item Category')                   editItemCategory()
        else if (chosenFunc === 'Edit Item Coupon')                     editItemCoupon()    
        
        debugPrint('Modified DB')
        
        updateList()
      }
    }
  }
  else if (clickedCol === 4) {
    checkUncheckItem(clickedRange, clickedRow)
  }
}



function resetChoice(action, chosenFunc, range) {
  
  debugPrint('Resetting choice')
  
  var resetDropdown = ''

  if      (action === 'filter' || action === 'sort')  
    resetDropdown = chosenFunc
    
  else if (action === 'viewModify') {
    
    if      (chosenFunc === 'Store'               ||
             chosenFunc === 'View Stores'         ||
             chosenFunc === 'Add Store'           ||
             chosenFunc === 'Delete Store'        ||
             chosenFunc === 'Edit Store')
      resetDropdown = 'Store'
    else if (chosenFunc === 'Category'            ||
             chosenFunc === 'View Categories'     || 
             chosenFunc === 'Add Category'        || 
             chosenFunc === 'Delete Category'     || 
             chosenFunc === 'Edit Category')
      resetDropdown = 'Category'
    else if (chosenFunc === 'Item'                || 
             chosenFunc === 'View Items'          || 
             chosenFunc === 'Add Item'            || 
             chosenFunc === 'Delete Item'         || 
             chosenFunc === 'Edit Item Name'      ||
             chosenFunc === 'Add Item Store'      ||
             chosenFunc === 'Delete Item Store'   ||
             chosenFunc === 'Edit Item Category'  ||
             chosenFunc === 'Edit Item Coupon')     
      resetDropdown = 'Item'
  }
       
  range.setValue(resetDropdown)
}
