const User = require('./User');
const Photo = require('./Photo');

Photo.belongsTo(User, {
    foreignKey: 'user_id',
})

User.hasMany(Photo, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

module.exports = { User, Photo };
