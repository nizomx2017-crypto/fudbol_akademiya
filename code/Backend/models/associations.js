const Student = require("./Studentmodels");
const Course = require("./CourseModel");
const AuthUser = require("./AuthUserModel");


Course.hasMany(Student);

Student.belongsTo(Course);


module.exports = {
    Student,
    Course,
    AuthUser
};
