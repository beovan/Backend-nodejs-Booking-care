"use strict"
const {
    Model 
}= require('sequelize'); 
module.exports = (sequelize, DataTypes) => {
    class Markdown extends Model {
        static associate(models) {
            // Markdown.belongsTo(models.Doctor, {
            //     foreignKey: "doctorId",
            //     as: "doctorData"
            // });
            // Markdown.belongsTo(models.Specialty, {
            //     foreignKey: "specialtyId",
            //     as: "specialtyData"
            // });
            // Markdown.belongsTo(models.Clinic, {
            //     foreignKey: "clinicId",
            //     as: "clinicData"
            // });
        }
    };
    Markdown.init({
        contentHTML: DataTypes.TEXT('long'),
        contentMarkdown: DataTypes.TEXT('long'),
        description: DataTypes.TEXT('long'),
        doctorId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Markdown',
    });
    return Markdown;
};