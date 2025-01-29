const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('tbl_users', {
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    user_password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_mobile: {
        type: DataTypes.STRING,
    },
    user_address: {
        type: DataTypes.STRING,
    },
    user_ip: {
        type: DataTypes.STRING,
    },
    user_type: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    user_status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
},{
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'tbl_users'
});

User.associate = function (models) {
    User.hasOne(models.Token, {
        foreignKey: 'user_id',
    });
};

module.exports = User;
