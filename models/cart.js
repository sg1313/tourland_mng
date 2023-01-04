const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cart', {
    cno: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "번호"
    },
    userno: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "유저번호",
      references: {
        model: 'user',
        key: 'id'
      }
    },
    pno: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "상품번호",
      references: {
        model: 'product',
        key: 'id'
      }
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "개수"
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "가격"
    }
  }, {
    sequelize,
    tableName: 'cart',
    timestamps: false,
    indexes: [
      {
        name: "FK_user_TO_cart",
        using: "BTREE",
        fields: [
          { name: "userno" },
        ]
      },
      {
        name: "FK_product_TO_cart",
        using: "BTREE",
        fields: [
          { name: "pno" },
        ]
      },
    ]
  });
};
