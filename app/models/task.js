module.exports = function(sequelize, DataTypes) {
    var Task = sequelize.define("Task", {
        //id:     DataTypes.STRING
    }, {
        freezeTableName: true
    });

    return Task;
};