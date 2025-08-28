module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define(
        "Order",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            product_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "orders",
            timestamps: false,
            indexes: [
                { fields: ["user_id"] },
                { fields: ["created_at"] },
            ],
        }
    );

    Order.associate = (models) => {
        Order.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    };

    return Order;
};
