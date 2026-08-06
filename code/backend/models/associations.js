const Student = require("./StudentModel");
const Course = require("./CourseModel");
const AuthUser = require("./AuthUserModel");
const Role = require("./RoleModel");
const Access = require("./AccessModel");
const UserAccess = require("./UserAccessModel");
require("../modules/payment/model");
require("../modules/billing/model");
require("../modules/storage/model");
require("../modules/chat/model");
require("../modules/tgbot/model");
require("../modules/notification/model");
require("../modules/ops/model");


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
