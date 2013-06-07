module.exports = function(sequelize, DataTypes) {
    var Metastate = sequelize.define("Metastate", {
        hashkey:     DataTypes.STRING(60) //email+salt -> bcrypt@10
    }, {
        freezeTableName: true
    });

    return Metastate;
};