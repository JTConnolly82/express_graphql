import React from "react";

class Auth extends React.Component {

  state = {
    isLoggedIn: true,
  }


  constructor(props) {
    super(props);
    this.emailElement = React.createRef();
    this.passwordElement = React.createRef();
  }
  
  
  handleButtonSwitch = () => {
    this.setState(prev => {
      return {
        isLoggedIn: !prev.isLoggedIn
      }
    })
  }
  

  handleSubmit = (e) => {
    e.preventDefault();
    const email = this.emailElement.current.value;
    const password = this.passwordElement.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!this.state.isLoggedIn) {
      requestBody = {
        "query": `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      };
    }

    fetch('http://localhost:3030/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
    <>
      <h1>Auth</h1>
      <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="email">email</label>
            <input type='email' id='email' ref={this.emailElement} />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input name='password' id='password' ref={this.passwordElement} />
          </div>
          <div>
          <button type='button' onClick={this.handleButtonSwitch} >Switch to {this.state.isLoggedIn ? 'signup' : 'login'}</button>
          <button type='submit'>submit</button>
          </div>
      </form>
    </>
    )
  }
}

export default Auth;
