const Student = require("./Studentmodels");
const Course = require("./CourseModel");


Course.hasMany(Student);

Student.belongsTo(Course);


module.exports = {
    Student,
    Course
};