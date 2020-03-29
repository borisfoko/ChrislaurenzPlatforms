var db = require('../models/db.config.js');

var sequelize = db.sequelize;

var Blog = db.blog;
var Post = db.post;
var User = db.user;

exports.addBlog = (req, res) => {
    // Save Blog to Database
    return sequelize.transaction(function (t) {
        return Blog.create({
            title: req.body.title,
            body: req.body.body,
            creation_timestamp: req.body.creationTimestamp,
            image: req.body.image,
            creator_id: req.userId
        }, {transaction: t});
    }).then(() => {
        res.send("Blog has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.addPost = (req, res) => {
    // Save Post to Database
    return sequelize.transaction(function (t) {
        return Post.create({
            title: req.body.title,
            body: req.body.body,
            creation_timestamp: req.body.creationTimestamp,
            image: req.body.image,
            blog_id: req.body.blogId,
            creator_id: req.userId
        }, {transaction: t});
    }).then(() => {
        res.send("Post has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.updateBlog = (req, res) => {
    // Update Blog to Database
    return sequelize.transaction(function (t) {
        return Blog.update({
            title: req.body.title,
            body: req.body.body,
            image: req.body.image
        }, {
            where: {
                id: req.params.id
            },
            transaction: t
        });
    }).then(() => {
        res.send("Blog has been successful updated!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.updatePost = (req, res) => {
    // Update Post to Database
    return sequelize.transaction(function (t) {
        return Post.update({
            title: req.body.title,
            body: req.body.body,
            image: req.body.image,
            is_active: req.body.is_active
        }, {
            where: {
                id: req.params.id
            },
            transaction: t
        });
    }).then(() => {
        res.send("Post has been successful updated!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getBlogById = (req, res) => {
    // Get Blog(s) from the Database
    Blog.findAll({
        where: {id: req.params.id},
        attributes: ['id', 'title', 'body', 'creation_timestamp', 'image'],
        include: 
        [
            {
                model: User,
                attributes: ['email', 'first_name', 'last_name']
            },
            {
                model: Post,
                attributes: ['id', 'title', 'body', 'creation_timestamp', 'image', 'is_active'],
                include: [
                    {
                        model: User,
                        attributes: ['email', 'first_name', 'last_name']
                    }
                ]
            }
        ]
    }).then((blogs) => {
        res.status(200).send(blogs);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllBlogs = (req, res) => {
    // Get Blog(s) from the Database
    Blog.findAll({
        attributes: ['id', 'title', 'body', 'creation_timestamp', 'image'],
        include: 
        [
            {
                model: User,
                attributes: ['email', 'first_name', 'last_name']
            },
            {
                model: Post,
                attributes: ['id', 'title', 'body', 'creation_timestamp', 'image', 'is_active'],
                include: [
                    {
                        model: User,
                        attributes: ['email', 'first_name', 'last_name']
                    }
                ]
            }
        ]
    })
    .then((blogs) => {
        res.status(200).send(blogs);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllPosts = (req, res) => {
    // Get Post(s) from the Database
    Post.findAll({
        attributes: ['id', 'title', 'body', 'creation_timestamp', 'image', 'is_active'],
        include: 
        [
            {
                model: User,
                attributes: ['email', 'first_name', 'last_name'],
            }
        ]
    })
    .then((posts) => {
        res.status(200).send(posts);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.deleteBlog = (req, res) => {
    // Delete Blog from the Database
    return sequelize.transaction(function (t) {
        return Blog.destroy({
            where: { id: req.params.id }
        }, {transaction: t});
    }).then(() => {
        res.send("Blog has been successful deleted!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.deletePost = (req, res) => {
    // Delete Post from the Database
    return sequelize.transaction(function (t) {
        return Post.destroy({
            where: { id: req.params.id }
        }, {transaction: t});
    }).then(() => {
        res.send("Post has been successful deleted!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}


