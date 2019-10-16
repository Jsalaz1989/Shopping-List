function addStore()       { add('Store')       }
function addCategory()    { add('Category')    }
function deleteStore()    { remove('Store')    }
function deleteCategory() { remove('Category') }
function deleteItem()     { remove('Item'); debugPrint('fucckk I thought it was working 2')     }
function editStore()      { edit('Store')      }
function editCategory()   { edit('Category')   }

function add(target) {
     
  var targetSheet
  
  if      (target === 'Store')     targetSheet = getSheet('Stores')
  else if (target === 'Category')  targetSheet = getSheet('Categories')

  var newName = validateInput('Add ' + target, 'New ' + target + ' name', targetSheet, false)
  
  targetSheet.appendRow([newName])

  var msg = 'Added "' + newName + '" to ' + targetSheet.getName()
  
  debugPrint(msg)
  Browser.msgBox('Success', msg, Browser.Buttons.OK)
  
  updateList()
  
  return newName
}

function addItem() {

  var newName = validateInput('Add Item', 'New Item Name', getSheet('Items'), false)
  var store = validateInput('Add Store', 'Store name', getSheet('Stores'), true)
  var category = validateInput('Add Category', 'Category name', getSheet('Categories'), true)
   
  var coupon = promptForCoupon()
  
  var itemsSheet = getSheet('Items')
  
  itemsSheet.appendRow([newName, store, category, coupon, true])

  var msg = 'Added "' + newName + '" to ' + itemsSheet.getName()
  
  debugPrint(msg)
  Browser.msgBox('Success', msg, Browser.Buttons.OK)
  
  updateList()

  return newName
}



function remove(target) {
  
  var targetSheet
  
  if      (target === 'Store')     targetSheet = getSheet('Stores')
  else if (target === 'Category')  targetSheet = getSheet('Categories')  
  else if (target === 'Item')      targetSheet = getSheet('Items')


  var name = validateInput('Delete ' + target, target + ' name', targetSheet, true)
  
  var rowInTargetSheet = findRow(name, targetSheet)

  var existingValues = targetSheet.getDataRange().getValues()
  debugPrint('existingValues = ' + existingValues)
 
  if (existingValues.length === 1) targetSheet.insertRowAfter(rowInTargetSheet)
  
  targetSheet.deleteRow(rowInTargetSheet)
  debugPrint(Utilities.formatString('Deleted row "%s" in sheet "%s"', rowInTargetSheet, targetSheet.getName()))
  
  var itemsSheet = getSheet('Items')
  
  if (target == 'Store')      
    findAndEraseStoreInItems(name)
  else if (target === 'Category')  {    
    findAndReplace(','+name,'', itemsSheet)
    findAndReplace(name+',','', itemsSheet)
    findAndReplace(name,'', itemsSheet)
  }
  
  var msg = 'Deleted "' + name + '" from ' + targetSheet.getName()
  
  debugPrint(msg)
  Browser.msgBox('Success', msg, Browser.Buttons.OK)
  
  updateList()
  
  return name
}

function edit(target) {
   
  var targetSheet
  
  if      (target === 'Store')     targetSheet = getSheet('Stores')
  else if (target === 'Category')  targetSheet = getSheet('Categories')
  
  var name = validateInput('Edit ' + target, target + ' name', targetSheet, true)  
  var newName = validateInput('Edit ' + target, 'New ' + target + ' name', targetSheet, false)

  findAndReplace(name, newName, targetSheet)

  var itemsSheet = getSheet('Items')
  
  findAndReplaceStoreInItems(name, newName, itemsSheet)
    
  var msg = 'Edited "' + name + '" to "' + newName + '" in sheets "' + targetSheet.getName() + '" and "' + itemsSheet.getName() + '"' 
  
  debugPrint(msg)
  Browser.msgBox('Success', msg, Browser.Buttons.OK)
  
  updateList()

  return newName
}


function editItemName() {
   
  var promptTitle = 'Edit Item'
  var itemsSheet = getSheet('Items')
  
  var name = validateInput(promptTitle, 'Item Name', itemsSheet, true)
  var newName = validateInput(promptTitle, 'New Item Name', itemsSheet, false)
         
  findAndReplace(name, newName, itemsSheet)

  var msg = 'Edited "' + name + '" to "' + newName + '" in sheet "' + itemsSheet.getName() + '"' 
  
  debugPrint(msg)
  Browser.msgBox('Success', msg, Browser.Buttons.OK)
  
  updateList()

  return newName
}

function editItemAddStore() {
   
  var promptTitle = 'Add Store to Item'
  var itemsSheet = getSheet('Items')
  
  var name = validateInput(promptTitle, 'Item Name', itemsSheet, true)
  
  var rowInItems = findRow(name, itemsSheet)
 
  var currentStores = itemsSheet.getRange(rowInItems,2).getValue()
  debugPrint('currentStores = ' + currentStores)
  
  currentStores = currentStores.split(',')
    
  var newStores = []
  var validStore = false
  
  var promptMsg = 'New Store name'
  
  var msg = ''
   
  while (true) {
    
    var store = validateInput(promptTitle, promptMsg, getSheet('Stores'), true)
    
    if (currentStores.includes(store)) {
      msg = 'Item "' + name + '" already found in Store "' + store + '"'
      debugPrint(msg)
        
      promptMsg = msg + '. ' + promptMsg
      continue
    }
    else
      break
  }
  
  if (currentStores.includes('None'))   newStores = [].concat([store])
  else                                  newStores = currentStores.concat([store])
   
  newStores = convertArrayToString(newStores)
  
  itemsSheet.getRange(rowInItems,2).setValue(newStores)

  msg = 'Added Store "' + store + '" to "' +  name + '" in sheet "' + itemsSheet.getName() + '"' 
  
  debugPrint(msg)
  Browser.msgBox('Success', msg, Browser.Buttons.OK)
  
  updateList()

  return store
}


function editItemDeleteStore() {
   
  var promptTitle = 'Delete Store from Item'
  var itemsSheet = getSheet('Items')
  
  var name = validateInput(promptTitle, 'Item Name', itemsSheet, true)
  
  var rowInItems = findRow(name, itemsSheet)
 
  var currentStores = itemsSheet.getRange(rowInItems,2).getValue()
  debugPrint(Utilities.formatString('currentStores = %s is of length %s', currentStores, currentStores.length))
  
  currentStores = currentStores.split(',')
  debugPrint(Utilities.formatString('currentStores = %s is of length %s', currentStores, currentStores.length))
  
  var promptMsg = 'Store name'
  
  var msg = ''

  while (true) {
    
    var store = validateInput(promptTitle, promptMsg, getSheet('Stores'), true)
        
    if (!currentStores.includes(store)) {
      
      msg = 'Item "' + name + '" not found in Store "' + store + '"'
      debugPrint(msg)
      
      promptMsg = msg + '. ' + promptMsg
      continue
    }
    else
      break
  }
   
  
  var newStores = []
  
  for (var i = 0; i < currentStores.length; i++) {
    if (currentStores[i] !== store)     
      newStores.push(currentStores[i])
  }
  
  newStores = convertArrayToString(newStores)
  
  itemsSheet.getRange(rowInItems,2).setValue(newStores)

  var msg = 'Deleted Store "' + store + '" from "' +  name + '" in sheet "' + itemsSheet.getName() + '"' 
  
  debugPrint(msg)
  Browser.msgBox('Success', msg, Browser.Buttons.OK)
  
  replaceEmptyStoresWithNone()
  
  updateList()
  
  return store
}

function editItemCategory() {

  var promptTitle = 'Edit Item Category'
  var itemsSheet = getSheet('Items')
  
  var name = validateInput(promptTitle, 'Item Name', itemsSheet, true)
  var category = validateInput(promptTitle, 'New Item Category', getSheet('Categories'), true)
        
  var rowInItems = findRow(name, itemsSheet)

  itemsSheet.getRange(rowInItems, 3).setValue([category])
  
  var msg = 'Edited category "' + category + '" from "' + name + '" in sheet "' + itemsSheet.getName() + '"' 
  
  debugPrint(msg)
  Browser.msgBox('Success', msg, Browser.Buttons.OK)
  
  updateList()
    
  return category
}

function editItemCoupon() {

  var itemsSheet = getSheet('Items')
  
  var name = validateInput('Edit Item Coupon', 'Item Name', itemsSheet, true)
  var coupon = promptForCoupon()
        
  var rowInItems = findRow(name, itemsSheet)

  itemsSheet.getRange(rowInItems, 4).setValue(coupon)
  
  var msg = 'Edited coupon "' + coupon + '" of "' + name + '" in sheet "' + itemsSheet.getName() + '"' 
  
  debugPrint(msg)
  Browser.msgBox('Success', msg, Browser.Buttons.OK)
  
  updateList()  
  
  return coupon
}

function promptForCoupon() {

  var ui = SpreadsheetApp.getUi()
  
  var response = ui.prompt('Add Coupon', 'If you have a coupon, enter YYMMDD. Otherwise, click NO', ui.ButtonSet.YES_NO)  
  if (response === ui.Button.CLOSE) {
    
    var msg = 'User aborted the operation'
    
    debugPrint(msg)
    throw msg
  }  
  
  var coupon = response.getResponseText()
  debugPrint('Received coupon = ' + coupon)

  if      (response.getSelectedButton() == ui.Button.YES)  
    coupon = new Date('20'+coupon[0]+coupon[1]+'-'+coupon[2]+coupon[3]+'-'+coupon[4]+coupon[5])
  else if (response.getSelectedButton() == ui.Button.NO)   
    coupon = false
  
  debugPrint('Returning coupon = ' + coupon)
  return coupon
}

function validateInput(promptTitle, promptMsg, targetSheet, shouldExist) {
  
  debugPrint('validating input')
  
  while (true) {

    debugPrint(Utilities.formatString('promptTitle = %s, promptMsg = %s, targetSheet = %s', promptTitle, promptMsg, targetSheet))

    var ui = SpreadsheetApp.getUi()

    var response = ui.prompt(promptTitle, promptMsg, ui.ButtonSet.OK_CANCEL)

    if (response.getSelectedButton() !== ui.Button.OK) {
      
      var msg = 'User aborted the operation'
      
      debugPrint(msg)
      throw msg
    }
    
    var responseText = response.getResponseText()
    debugPrint('Attempting to submit responseText = ' + responseText)
  
    var msg = ''
    
    if (responseText === '') {
      
      msg = 'No value was given, cannot ' + promptTitle
      
      debugPrint(msg)
      Browser.msgBox('Empty input', 'No value was given', Browser.Buttons.OK)
      
      continue
    }    
    else if (!shouldExist && alreadyExists(responseText, targetSheet)) {
      
      msg = 'Value "' + responseText + '" already exists in sheet "' + targetSheet.getName() + '", cannot add'
      
      debugPrint(msg)
      Browser.msgBox('Duplicate value', msg, Browser.Buttons.OK)
      
      continue
    }
    else if (shouldExist && !alreadyExists(responseText, targetSheet)) {
      
      msg = 'Value "' + responseText + '" does not exist in sheet "' + targetSheet.getName() + '", cannot delete or edit'
      
      debugPrint(msg)
      Browser.msgBox('Unknown value', msg, Browser.Buttons.OK)
      
      continue
    }
    else
      break
  }
  
  msg = 'Valid input = ' + responseText
  debugPrint(msg)
  
  return responseText
}

function viewStores()     { view('Stores') }
function viewCategories() { view('Categories') }

function view(target) {
  
  var list = getSheet(target).getRange('A:A').getValues()
  debugPrint(Utilities.formatString('list = %s is of length %s', list, list.length))
  
  if (target === 'Stores') {
    list = list.slice(2,list.length)
    debugPrint(Utilities.formatString('list = %s is of length %s', list, list.length))
  }
  
  list = list.sort()
  debugPrint(Utilities.formatString('list = %s is of length %s', list, list.length))
  
  var htmlStr = '<ul style="list-style-type: none; font-family: Arial; font-size: 1em; padding: 0; margin: 0;">'
  for (var i = 0; i < list.length; i++) { htmlStr = htmlStr + '<li style="padding-top: 0.3em;">' + list[i][0] + '</li>' }
  htmlStr = htmlStr + '</ul>' 

  debugPrint('htmlStr = ' + htmlStr)
  
  popupList(target, htmlStr, 150)
}

function viewItems() {
  var list = getSheet('Items').getRange('A:D').getValues()
  debugPrint(Utilities.formatString('list = %s is of length %s', list, list.length))
  
  var htmlStr = '<table style="list-style-type: none; font-family: Arial; font-size: 1em; padding: 0; margin: 0;"> \
    <tr><th>Name</th><th>Store</th><th>Category</th><th>Coupon</th></tr>'

  for (var i = 0; i < list.length; i++) {
    
    debugPrint('list[i] = ' + list[i] + ' is of length ' + list[i].length + ' and of type ' + typeof(list[i]))
    
    var coupon = list[i][3]
    debugPrint('coupon = ' + coupon + ' is of length ' + coupon.length + ' and of type ' + typeof(coupon))
    
    if (coupon) {
    
      var year = coupon.getFullYear()
      var month = coupon.getMonth() + 1
      var day = coupon.getDate()
      
      debugPrint('year = ' + year + ', month = ' + month + ', day = ' + day)
      
      year = (year - 2000)
      if (month < 10) month = '0'+month
      if (day < 10) day = '0'+day
      
      debugPrint('year = ' + year + ', month = ' + month + ', day = ' + day)
      
      coupon = year + '.' + month + '.' + day
    }
    else
      coupon = ''
      
      htmlStr = htmlStr + 
        '<tr style="padding-top: 0.3em;">' +
          '<td>'+list[i][0]+'</td>'        + 
          '<td>'+list[i][1]+'</td>'        +
          '<td>'+list[i][2]+'</td>'        +
          '<td>'+coupon+'</td>'            +
        '</tr>' 
    }
  
  htmlStr = htmlStr + '</table>'
  
  popupList('Items', htmlStr, 450)
}

function popupList(target, html, width) {
  
  var htmlOutput = HtmlService
    .createHtmlOutput(html)
    .setWidth(width)
    .setHeight(300);
  
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, target)
}
