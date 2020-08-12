const dummy = (blogs) => {
  return 1
}

var _ = require('lodash')

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const mostLikes = blogs
    .map(blog => blog.likes)
    .reduce((acc, cum) => Math.max(acc, cum), -Infinity)

  const mostLiked = blogs.filter( blog => blog.likes === mostLikes)
  const result = { title: mostLiked[0].title, author: mostLiked[0].author, likes: mostLiked[0].likes }

  return result
}

const mostBlogs = (blogs) => {
  var result = _(blogs)
    .countBy('author')
    .map((blogs, author) => ({ author, blogs }))
    .value()

  var list =_.sortBy(result, 'blogs')

  return list[list.length-1]

}

const mostLikes = (blogs) => {
  const authors = _.uniq(blogs.map(blog => blog.author))
  var likes = []
  authors.forEach(author => {
    likes = likes.concat(_.sum(blogs.filter(blog => blog.author === author).map(blog => blog.likes)))
  })
  var i=_.findIndex(likes, like => like===_.max(likes))

  return { author: authors[i], likes: likes[i] }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}

