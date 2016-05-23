var TableUse = require('./baseDAO.js')
var demoTable= new TableUse('demoTable')
var inheritBaseObj = require('./baseObj.js')

/**
 * 模型的构造函数
 * @param company
 * @param title
 * @param content
 * @constructor
 */
function DemoClass(id,teacher,student) {
    if(id) {
        this.id=id
    }
    if(teacher&&student) {
        this.teacher=teacher
        this.student=student
    }
}



inheritBaseObj(DemoClass,demoTable)



function editClass(value, callback) {
    var demoClass= new DemoClass(value.id,value.teacher,value.student)
    patent.change(callback)
}




/**
 * 
 * @param patentID
 * @param callback
 */


function findClass(classID, callback) {
   var demoClass= new DemoClass(classID)
  demoClass.load(callback)
}



/**
 * 创建
 * @param value
 * @param callback
 */

function createClass(value, callback) {
   var demoClass= new DemoClass(null,value.teacher, value.student)
    demoClass.save(callback)
}
//function createPatent(value, callback) {
//    var patent = new Patent(null,value.patentCompany, value.patentTitle, value.patentContent)
//    patentData.insertData(patent, callback)
//}

/**
 * 删除专利
 * @param patentID
 * @param callback
 */
//function delPatent(patentID, callback) {
//    patentData.delDataByID(patentID, callback)
//}

function delClass(classID, callback) {
    new DemoClass(classID).cancel(callback)
}




