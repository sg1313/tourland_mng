const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('custboard', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "번호"
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "제목"
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "내용"
    },
    writer: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "작성자"
    },
    regdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "작성일자"
    },
    passwd: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "비밀번호"
    },
    image: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "이미지"
    }
  }, {
    sequelize,
    tableName: 'custboard',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
