const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  { _id: '5a422a851b54a676234d17f7', title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7, __v: 0, user: {
    blogs: [
      '5f3511d0649fb02436ddc01c',
      '5f351415649fb02436ddc01d',
      '5f35142b649fb02436ddc01f',
      '5f353457649fb02436ddc021',
      '5f3539eb649fb02436ddc022'
    ],
    username: 'vkinnula',
    name: 'Ville Kinnula',
    id: '5f3505fc649fb02436ddc01b'
  } },
  { _id: '5a422aa71b54a676234d17f8', title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 5, __v: 0, user: {
    blogs: [
      '5f3511d0649fb02436ddc01c',
      '5f351415649fb02436ddc01d',
      '5f35142b649fb02436ddc01f',
      '5f353457649fb02436ddc021',
      '5f3539eb649fb02436ddc022'
    ],
    username: 'vkinnula',
    name: 'Ville Kinnula',
    id: '5f3505fc649fb02436ddc01b'
  } },
  { _id: '5a422b3a1b54a676234d17f9', title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12, __v: 0, user: {
    blogs: [
      '5f3511d0649fb02436ddc01c',
      '5f351415649fb02436ddc01d',
      '5f35142b649fb02436ddc01f',
      '5f353457649fb02436ddc021',
      '5f3539eb649fb02436ddc022'
    ],
    username: 'vkinnula',
    name: 'Ville Kinnula',
    id: '5f3505fc649fb02436ddc01b'
  } },
  { _id: '5a422b891b54a676234d17fa', title: 'First class tests', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', likes: 10, __v: 0, user: {
    blogs: [
      '5f3511d0649fb02436ddc01c',
      '5f351415649fb02436ddc01d',
      '5f35142b649fb02436ddc01f',
      '5f353457649fb02436ddc021',
      '5f3539eb649fb02436ddc022'
    ],
    username: 'vkinnula',
    name: 'Ville Kinnula',
    id: '5f3505fc649fb02436ddc01b'
  } },
  { _id: '5a422ba71b54a676234d17fb', title: 'TDD harms architecture', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', likes: 0, __v: 0, user: {
    blogs: [
      '5f3511d0649fb02436ddc01c',
      '5f351415649fb02436ddc01d',
      '5f35142b649fb02436ddc01f',
      '5f353457649fb02436ddc021',
      '5f3539eb649fb02436ddc022'
    ],
    username: 'vkinnula',
    name: 'Ville Kinnula',
    id: '5f3505fc649fb02436ddc01b'
  } },
  { _id: '5a422bc61b54a676234d17fc', title: 'Type wars', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', likes: 2, __v: 0, user: {
    blogs: [
      '5f3511d0649fb02436ddc01c',
      '5f351415649fb02436ddc01d',
      '5f35142b649fb02436ddc01f',
      '5f353457649fb02436ddc021',
      '5f3539eb649fb02436ddc022'
    ],
    username: 'vkinnula',
    name: 'Ville Kinnula',
    id: '5f3505fc649fb02436ddc01b'
  } }
]

const initialUsers = [
  {
    _id:'5f341917fc0e551c877e91e5',
    blogs: [],
    username:'vkinnula',
    name : 'Ville Kinnula',
    passwordHash : '$2b$10$16WoZo9avh.IdwBJJ4ztd.hWAAnAsUrBN8ZKEowkovHnkLlRli/ea',
    __v:0
  },
  {
    blogs: [],
    username: 'mrfake',
    name: 'Fake Boy',
    id: '5f3408842cc7c30f34e8118e'
  }

]


const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'ville', url: 'fakeurl.com' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb, initialUsers
}