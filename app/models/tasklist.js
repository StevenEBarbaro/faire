module.exports = function(sequelize, DataTypes) {
    var Tasklist = sequelize.define("Tasklist", {
        //id:     DataTypes.STRING
    }, {
        freezeTableName: true
    });

    return Tasklist;
};