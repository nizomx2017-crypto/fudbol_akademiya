const Student = require("./studentmodel");
const Course = require("./coursemodel");
const AuthUser = require("./authusermodel");
const Role = require("./rolemodel");
const Access = require("./accessmodel");
const UserAccess = require("./useraccessmodel");


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
