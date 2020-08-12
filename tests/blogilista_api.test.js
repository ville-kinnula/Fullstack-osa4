const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)

})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('blog is identified by id', async () => {
  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd[0].id).toBeDefined()
})

describe('adding or deleting a blog', () => {

  var token = 'kjjds'
  beforeEach(async () => {

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()


    const newLogin = {
      username: 'root',
      password: 'sekret'
    }

    var login = await api
      .post('/api/login')
      .send(newLogin)

    token='bearer ' + login.body.token
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'myBlog',
      author: 'BloggerGuy',
      url: 'allmyblogs.com',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)


    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
      'myBlog'
    )
  })

  test('blog without specified likes has 0 likes', async () => {
    const newBlog = {
      title: 'myBlog',
      author: 'BloggerGuy',
      url: 'allmyblogs.com',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(blog => blog.title==='myBlog')

    expect(addedBlog.likes).toBe(0)
  })

  test('blog without specified url or title is bad request', async () => {
    const newBlogWithoutTitle = {
      author: 'BloggerGuy',
      url: 'allmyblogs.com',
    }

    const newBlogWithoutUrl = {
      title: 'mySecondBlog',
      author: 'AnotherBlogger',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlogWithoutTitle)
      .expect(400)

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlogWithoutUrl)
      .expect(400)
  })

  test('blog not added without authorization token', async () => {
    const newBlog = {
      author: 'BloggerGuy',
      url: 'allmyblogs.com',
      title: 'bestblog'
    }


    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

  })

  test('deletion succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    console.log(blogToDelete)

    const newBlog = {
      title: 'myBlog',
      author: 'BloggerGuy',
      url: 'allmyblogs.com',
      likes: 2
    }

    const sentBlog = await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
    console.log(sentBlog.body)
    await api
      .delete(`/api/blogs/${sentBlog.body.id}`)
      .set('Authorization', token)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length
    )

    const titles = blogsAtEnd.map(r => r.titles)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('updating likes of a blog', () => {
  test('succeeds with status code 200 if id and data are valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const newLikes = {
      likes: 6
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newLikes)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const updatedBlog = blogsAtEnd[0]

    expect(updatedBlog.likes).toBe(6)
  })
})


describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(401)

    expect(result.body.error).toContain('invalid username or password')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'roooty',
      name: 'Superuser',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(401)

    expect(result.body.error).toContain('invalid username or password')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})