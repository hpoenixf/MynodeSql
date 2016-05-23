/**
 * Created by ALanqiu on 2016/2/23.
 */

function BaseObj() {

}

//基本类
BaseObj.prototype = {
    save: function (callback) {
        this.table.insertData(this, callback)
    },
    load: function (callback) {
        this.table.getDataByID(this.id, callback)
    },
    get: function (para,callback) {
        this.table.getData(para,callback)
    },
    change: function (callback) {
        var condition = 'id = ' + this.id
        this.table.updateData(this, condition, callback)
    },
    changeBy: function (condition,callback) {
        this.table.updateData(this, condition, callback)
    },
    cancel: function (callback) {
        this.table.delDataByID(this.id, callback)
    }
}

//使得子类可以继承基本类的方法，把表格属性加入到原型中，避免被遍历出来
function  inheritBaseObj(obj,table) {
    obj.prototype = Object.create(BaseObj.prototype)
    obj.prototype.constructor = obj
    obj.prototype.table = table
}


module.exports = inheritBaseObj