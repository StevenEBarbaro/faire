module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        //id:     DataTypes.STRING
    }, {
        freezeTableName: true
    });

    return User;
};