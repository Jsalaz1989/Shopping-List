function getNamedRange(n) {  
  return SpreadsheetApp.getActiveSpreadsheet().getRangeByName(n)
}

function getSheet(sheetName) {
    var ss = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = ss.getSheetByName(sheetName)    
    return sheet
}

function findRow(value, sheet) {
  debugPrint(Utilities.formatString('Searching sheet "%s" for row containing value = %s', sheet.getName(), value))
  var range = sheet.createTextFinder(value).matchCase(true).matchEntireCell(true).findNext()
  
  return range.getRow()
}

function findAndReplace(name, newName, sheet) { 
  debugPrint(Utilities.formatString('Replacing all instances of "%s" with "%s" in sheet "%s"', name, newName, sheet.getName()))
  sheet.createTextFinder(name).matchCase(true).replaceAllWith(newName)
}

function findAndEraseStoreInItems(name, sheet) {   
  debugPrint(Utilities.formatString('Erasing all instances of "%s"', name))
  sheet.createTextFinder('(\,'+name+')').useRegularExpression(true).replaceAllWith('')
  sheet.createTextFinder('('+name+'\,)').useRegularExpression(true).replaceAllWith('')
  sheet.createTextFinder('(\,'+name+'\,)').useRegularExpression(true).replaceAllWith('')
  sheet.createTextFinder('^('+name+')$').useRegularExpression(true).replaceAllWith('')
  
  replaceEmptyStoresWithNone()
}

function replaceEmptyStoresWithNone() {
  
  var itemsRange = getSheet('Items').getDataRange()
  
  var lastItemsRow = itemsRange.getLastRow()
    
  for (var i = 1; i <= lastItemsRow; i++) {
    
    var cell = itemsRange.getCell(i, 2)
    
    if (cell.getValue() == '') cell.setValue('None')
  }
}

function findAndReplaceStoreInItems(name, newName, sheet) {   
  debugPrint(Utilities.formatString('Replacing all instances of "%s" with "%s" in sheet "%s"', name, newName, sheet.getName()))
  sheet.createTextFinder('(\,'+name+')').useRegularExpression(true).replaceAllWith(','+newName)
  sheet.createTextFinder('('+name+'\,)').useRegularExpression(true).replaceAllWith(newName+',')
  sheet.createTextFinder('(\,'+name+'\,)').useRegularExpression(true).replaceAllWith(','+newName+',')
  sheet.createTextFinder('^('+name+')$').useRegularExpression(true).replaceAllWith(newName)
}


function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // note parts[1]-1
  return new Date(parts[2], parts[1]-1, parts[0]);
}

function alreadyExists(value, sheet) {
  
  debugPrint(Utilities.formatString('Searching for "%s" in sheet "%s"', value, sheet.getName()))
//  sheet.createTextFinder(value).matchCase(true).textFinder.findAll()

  var existingValues = sheet.createTextFinder(value).matchCase(true).matchEntireCell(true).findAll()
  debugPrint(Utilities.formatString('Found existingValues = %s in sheet "%s"', existingValues, sheet.getName()))

  if (existingValues.length > 0) {
    debugPrint(Utilities.formatString('Value = %s already exists in sheet "%s"', value, sheet.getName()))
    return true
  }
  else {
    debugPrint(Utilities.formatString('Value = %s does not already exist in sheet "%s"', value, sheet.getName()))
    return false
  }
}

function convertArrayToString(array) {
  
  var arrayString = ''
  
  for (var i = 0; i < array.length; i++)  
    
    if (i === 0)
      arrayString = array[i]
    else
      arrayString = arrayString + ',' + array[i]
  
  return arrayString
}

function debugPrint(string) 
{
  
  var errorStack
  
  try { throw new Error('Error message') } 
  catch(err) { errorStack = err.stack }
  
//  Logger.log('errorStack = %s', errorStack)
    
  var parts = errorStack.split('\n')
//  Logger.log('parts = %s is of length = %s', parts, parts.length)
  
  var stack = []

  for (var i = 1; i < parts.length-1; i++) {
    
    var part = parts[i]
//    Logger.log('part = %s', part)

    var partParts = part.split(' ')
//    Logger.log('partParts = %s', partParts)
            
    var func = partParts[2].replace('(','').replace(')','')
//    Logger.log('func = %s', func)
    
    stack.push(func)
  }
  
  var page = parts[0].split(' ')[1] 
  page = page.split(':')[0]
//  Logger.log('page = %s', page)
  
  stack.push(page)
//  Logger.log('stack = %s', stack)
  
  var trace = ''
  for (var i = stack.length-1; i >= 0; i--) {
    
    if (i === stack.length - 1)
      trace = stack[i]
    else
      trace = trace + ' > ' + stack[i]
  }
  
  trace = trace + ' : ' + string
  
  Logger.log(trace)
}

function debugFPrint() 
{    
  
//  Logger.log('arguments = ' + arguments + ' is of length = ' + arguments.length)
//  
//  var subs = []
//  for (var i = 1; i < arguments.length; i++) {
//    subs.push(arguments[i].toString())
//  }
//  
//  Logger.log('subs = ' + subs + ' is of length = ' + subs.length)
//
//  
//  var fString = Utilities.formatString(arguments[0], subs)
//  Logger.log('fString = ' + fString)
  
//  var args = arguments[0], arguments[1], arguments[2]
  
  var fString = Utilities.formatString(arguments[0], arguments[1], arguments[2])
  Logger.log('fString = ' + fString)

}
