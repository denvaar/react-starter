import React from 'react'

const Input = (props) => (
  <div className="input-container">
    <label>{props.label}
      <input
        type={props.inputType || "text"}
        className="input"
        onChange={(event) => props.handleChange(event.target.value)}
      />
    </label>
  </div>
)


class Application extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: "",
      lastName: ""
    }
  }

  render() {
    const fullName = `${this.state.firstName} ${this.state.lastName}`

    return(
      <div>
        {(() => {
          if (fullName.length > 1) {
            return <p>Your name is {fullName}</p>
          } else {
            return <p>Please enter your name</p>
          }
        })()}
        <Input label="First Name" handleChange={(value) => this.setState({ firstName: value })} />
        <Input label="Last Name" handleChange={(value) => this.setState({ lastName: value })} />
      </div>
    )
  }
}

export default Application
