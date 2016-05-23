var mysql = require('mysql')
var db = require('./db.js')



//创建连接池
POOL = mysql.createPool(db)
/**
 * 创建连接池，返回连接池对象
 * @param para
 */

/**
 * 确定使用的表的构造函数
 * @param pool   连接池对象
 * @param tableName   表的名字
 * @param callback
 * @constructor
 */
function TableUse(tableName) {
    var pool = POOL ||mysql.createPool(db)
    if (tableName) {
        this.pool = pool;
        this.tableName = tableName;
    }
}

TableUse.prototype = {
    insertData: insertData,
    updateData: updateData,
    delData: delData,
    delDataByID: delDataByID,
    getData: getData,
    getDataByID: getDataByID
}

function insertData(model, callback) {
    var modelProp = getOwnProperty(model)
    //模型属性名,数组
    var propName = modelProp[0]
    //模型属性的数量
    var propLen = modelProp[0].length;
    //模型属性值，数组
    var propVal = modelProp[1]
    var sqlSent = 'INSERT INTO ' + this.tableName + ' (' + propName.join(", ") + ') VALUES ('
    for (var i = 0; i < propLen; i++) {
        sqlSent += "?, "
    }
    sqlSent = sqlSent.substring(0, sqlSent.length - 2) + ')'
    console.log(sqlSent)
    sqlQuery(this.pool, sqlSent, propVal, callback)
}


function updateData(model, condition, callback) {
    var modelProp = getOwnProperty(model)
    //模型属性名,数组
    var propName = modelProp[0]
    //模型属性的数量
    var propLen = modelProp[0].length;
    //模型属性值，数组
    var propVal = modelProp[1]
    var sqlSent = 'UPDATE ' + this.tableName + ' SET ';
    for (var i = 0; i < propLen; i++) {
        sqlSent += propName[i]
        sqlSent += " =?, "
    }
    sqlSent = sqlSent.substring(0, sqlSent.length - 2) + ' WHERE ' + condition
    console.log(sqlSent)
    sqlQuery(this.pool, sqlSent, propVal, callback)
}

/**
 * 删除数据
 * @param condition
 * @param value
 * @param callback
 */
function delData(condition, value, callback) {
    var sqlSent = 'DELETE FROM ' + this.tableName + ' WHERE ';
    for (var i = 0, l = condition.length; i < l; i++) {
        sqlSent += condition[i] + "=? "
    }
    console.log(sqlSent)
    sqlQuery(this.pool, sqlSent, value, callback)
}

function delDataByID(ID, callback) {
    delData.call(this, {condition: ['id'], value: ID}, callback)
}

/**
 * 获取数据
 * @param para
 * @param callback
 */
function getData(para, callback) {
    var col = para.col ? para.col.join(',') : '*'
    var sqlSent = 'SELECT ' + col + " FROM " + this.tableName

    if(para.connect) {
        sqlSent+=','+para.connect
    }
    if(para.leftJoin) {
        sqlSent+=para.leftJoin
    }
    if (para.condition) {
        sqlSent += ' WHERE ' + para.condition + '= ?'
    }
    if(para.condition&&para.noValue) {
       sqlSent =  sqlSent.substr(0,sqlSent.length-3)
    }
    if (para.order) {
        sqlSent += ' ORDER BY ' + para.order
    }
    if (para.limit) {
        sqlSent += ' LIMIT ' + para.limit[0] + "," + para.limit[1]
    }
    if (para.group) {
        sqlSent += ' GROUP BY ' + para.group
    }
    console.log(sqlSent)
    sqlQuery(this.pool, sqlSent, para.value, callback)
}

function getDataByID(ID, callback) {
    getData.call(this, {condition: ['id'], value: ID}, callback)
}

function sqlQuery(pool, sqlSent, value, callback) {
    pool.getConnection(
        function (err, connection) {
            if (err) {
                console.log(err)
                callback(err)
            } else {
                connection.query(sqlSent, value, function (err, results) {
                    if (callback && callback instanceof Function) {
                        if (err) {
                            console.log(err)
                            callback(err,null)
                        } else {
                            callback(null, results);
                        }
                    }
                    connection.release()
                })
            }
        });
}

module.exports = TableUse

function getOwnProperty(obj) {
    var propName = [];
    var propValue = []
    for (var i  in obj) {
        if (obj.hasOwnProperty(i)&&i!=='id') {
            propName.push(i)
            propValue.push(obj[i])
        }
    }
    return [propName,propValue]
}

