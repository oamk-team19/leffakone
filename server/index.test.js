import { expect } from 'chai';
import { initializeTestDb, insertTestUser, getToken } from './helpers/test.js';

describe('Testing database functionality', () => {
  before(async () => {
    await initializeTestDb();
  });

  it('should scroll reviews', async () => {
    const idMovie = 1;
    const response = await fetch(
      `http://localhost:3001/review?idMovie=${idMovie}`
    );
    const data = await response.json();
    //console.log("Received review data:", data)
    expect(response.status).to.equal(200);
    expect(data).to.be.an('array').that.is.not.empty;
    expect(data[0]).to.include.all.keys([
      'idReview',
      'idMovie',
      'idUser',
      'email',
      'description',
      'rating',
      'datetime',
    ]);
  });

  it('try scroll reviews but gets empty array', async () => {
    const idMovie = 2;
    const response = await fetch(
      `http://localhost:3001/review?idMovie=${idMovie}`
    );
    const data = await response.json();
    //console.log("Received review data:", data)

    expect(response.status).to.equal(200);
    expect(data).to.be.an('array').that.is.empty;
  });
});

describe('Testing user management', () => {
  let token = null;
  const userTest = {
    username: 'testuser1',
    password: 'password1',
    email: 'user1@example.com',
  };
  const userTest2 = {
    username: 'testuser2',
    password: 'password2',
    email: 'user2@example.com',
  }; //An user to added the db

  before(async () => {
    await insertTestUser(userTest2);
    token = getToken(userTest2.email);
  });

  it('should register', async () => {
    const newUser = {
      email: 'register@example.com',
      username: 'registertest',
      password: 'Password01',
    };

    const response = await fetch('http://localhost:3001/auth/signup', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();

    expect(response.status).to.equal(201);
    expect(data).to.have.property('email');
  });

  it('should not register, email already in use', async () => {
    const newUser = {
      email: 'register2@example.com',
      username: 'registertest2',
      password: 'Password01',
    };

    const newUser2 = {
      email: 'register2@example.com',
      username: 'foo',
      password: 'Password01',
    };

    // create test user in db
    await fetch('http://localhost:3001/auth/signup', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    const response = await fetch('http://localhost:3001/auth/signup', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser2),
    });

    const data = await response.json();
    expect(response.status).to.equal(409);
    expect(data).to.have.property('error');
    expect(data.error).to.include('Email is already in use');
  });

  it('should login with correct email and password', async () => {
    const newUser = { email: 'user2@example.com', password: 'password2' };

    const response = await fetch('http://localhost:3001/auth/signin', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();
    //console.log(data)

    expect(response.status).to.equal(200);
    expect(data).to.include.all.keys(['iduser', 'email']);
    expect(data).to.be.an('object');
    expect(data).to.deep.equal({ iduser: 1, email: 'user2@example.com' });
    expect(data).to.include({ iduser: 1, email: 'user2@example.com' });
    expect(Object.keys(data)).to.have.lengthOf(2);
    expect(data).to.have.property('email');
  });

  it('try to login with wrong password', async () => {
    const newUser = { email: 'user2@example.com', password: 'password22' };

    const response = await fetch('http://localhost:3001/auth/signin', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();

    expect(response.status).to.equal(401);
    expect(data).to.be.an('object').that.has.all.keys('error');
    expect(data).to.deep.equal({ error: 'Invalid credentials' });
    expect(data).to.include({ error: 'Invalid credentials' });
    expect(Object.keys(data)).to.have.lengthOf(1);
    expect(data).to.have.property('error');
  });

  it('should log out', async () => {
    const newUser = { email: 'user2@example.com', password: 'password2' };

    const response = await fetch('http://localhost:3001/auth/signout', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();
    //console.log(data)

    expect(response.status).to.equal(200);
    expect(data).to.include.all.keys(['message']);
    expect(data).to.be.an('object');
    expect(data).to.deep.equal({ message: 'Logged out' });
    expect(data).to.include({ message: 'Logged out' });
    expect(Object.keys(data)).to.have.lengthOf(1);
    expect(data).to.have.property('message');
  });

  it('should delete registration', async () => {
    const newUser = { email: 'user2@example.com' };

    const response = await fetch('http://localhost:3001/user/deleteuser', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify(newUser),
    });

    const data = await response.json();
    //console.log(data)
    //console.log(response)

    expect(response.status).to.equal(200);
    expect(data).to.include.all.keys(['message']);
    expect(data).to.deep.equal({ message: 'User deletion completed' });
    expect(data).to.include({ message: 'User deletion completed' });
    expect(Object.keys(data)).to.have.lengthOf(1);
    expect(data).to.have.property('message');
  });

  it('try to delete registration with not existing user', async () => {
    const newUser = { email: 'user22@example.com' };

    const response = await fetch('http://localhost:3001/user/deleteuser', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();

    expect(response.status).to.equal(409);
    expect(data).to.include.all.keys(['error']);
    expect(data).to.deep.equal({ error: 'Not find user by email from users' });
    expect(data).to.include({ error: 'Not find user by email from users' });
    expect(Object.keys(data)).to.have.lengthOf(1);
    expect(data).to.have.property('error');
  });

  it('try to delete registration with empty email', async () => {
    const newUser = { email: '' };
    const response = await fetch('http://localhost:3001/user/deleteuser', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();
    //console.log(data)
    //console.log(response)

    expect(response.status).to.equal(409);
    expect(data).to.include.all.keys(['error']);
    expect(data).to.deep.equal({ error: 'No email given.' });
    expect(data).to.include({ error: 'No email given.' });
    expect(Object.keys(data)).to.have.lengthOf(1);
    expect(data).to.have.property('error');
  });
});
