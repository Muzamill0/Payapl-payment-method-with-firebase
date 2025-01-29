const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Token = sequelize.define('tokens', {
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'tokens'
});

Token.associate = function (models) {
    Token.belongsTo(models.User, {
        foreignKey: 'user_id',
    });
};

module.exports = Token;
