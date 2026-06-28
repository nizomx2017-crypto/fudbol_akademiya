const Student = require("./Studentmodels");
const Course = require("./CourseModel");
const AuthUser = require("./AuthUserModel");
const Role = require("./RoleModel");
const Access = require("./AccessModel");
const UserAccess = require("./UserAccessModel");


Course.hasMany(Student);

Student.belongsTo(Course);

AuthUser.hasMany(UserAccess, {
    foreignKey: "userId",
    as: "userAccesses",
    onDelete: "CASCADE"
});

UserAccess.belongsTo(AuthUser, {
    foreignKey: "userId",
    as: "user"
});

Access.hasMany(UserAccess, {
    foreignKey: "accessId",
    as: "userAccesses",
    onDelete: "CASCADE"
});

UserAccess.belongsTo(Access, {
    foreignKey: "accessId",
    as: "access"
});


module.exports = {
    Student,
    Course,
    AuthUser,
    Role,
    Access,
    UserAccess
};
