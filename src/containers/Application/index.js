import React from 'react'



const Month = ({ title, events, addEvent }) => (
  <div className="month m1" onClick={addEvent}>
    <div className="title">{title}</div>

    {events.map(event => (
      <div
        key={event.x}
        className="event"
        style={{top: event.y, left: event.x}}
      />
    ))}

  </div>
)

const calculateCost = (month, plan) => {
  return month.events.reduce((acc, event) => (
    acc + event.calculatedCosts.find(obj => obj.planId === plan.id).value
  ), 0)
}

const calculateEventCost = (rawCost, plan) => {
  return plan.totalCost >= plan.ded ? 0 : rawCost
}

const calculateTotal = (months, plan) => {
  return months.reduce((acc, month) => {
    return acc + calculateCost(month, plan)
  }, 0)
}


function getRelativeCoordinates (event, element) {
  const position = {
    x: event.pageX,
    y: event.pageY
  }

  const offset = {
    left: element.offsetLeft,
    top: element.offsetTop
  }

  let reference = element.offsetParent

  while (reference) {
    offset.left += reference.offsetLeft
    offset.top += reference.offsetTop
    reference = reference.offsetParent
  }

  return { x: position.x - offset.left, y: position.y - offset.top }
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      availablePlans: [
        {
          name: 'Aetna Bronze Plan',
          premium: 0,
          ded: 300,
          totalCost: 0,
          id: 1
        },
        {
          name: 'Aetna Silver Plan',
          premium: 150,
          ded: 400,
          totalCost: 0,
          id: 2
        },
        {
          name: 'Aetna Gold Plan',
          premium: 250,
          ded: 800,
          totalCost: 0,
          id: 3
        }
      ],
      planMonths: [
        {
          title: 'Nov',
          events: []
        },
        {
          title: 'Dec',
          events: []
        },
        {
          title: 'Jan',
          events: []
        },
        {
          title: 'Feb',
          events: []
        }
      ]
    }
  }

  componentDidMount() {
    this.setState({
      availablePlans: this.state.availablePlans.map(plan => ({ ...plan, totalCost: calculateTotal(this.state.planMonths, plan) }))
    })
  }

  addEvent(clickEvent, monthTitle) {
    const {x, y} = getRelativeCoordinates(clickEvent, clickEvent.target)
    const monthIndex = this.state.planMonths.findIndex(month => month.title === monthTitle)
    const planMonths = [
      ...this.state.planMonths.slice(0, monthIndex),
      {
        ...this.state.planMonths[monthIndex],
        events: [
          ...this.state.planMonths[monthIndex].events,
          {
            x, y,
            rawCost: 100,
            calculatedCosts: [
              ...this.state.availablePlans.map(plan => (
                { planId: plan.id, value: calculateEventCost(100, plan) }
              ))
            ]
          }
        ]
      },
      ...this.state.planMonths.slice(monthIndex + 1),
    ]

    this.setState({
      availablePlans: [
        ...this.state.availablePlans.map(plan => (
          {
            ...plan,
            totalCost: calculateTotal(planMonths, plan)
          }
        ))
      ],
      planMonths
    })
  }

  render() {
    const { availablePlans, planMonths } = this.state

    return (
      <div>
        <div className="event-section">
          <div className="event-panel">
            <label>{'Estimate event'}</label>
            <select className="m1">
              <option>{'Doctor visit'}</option>
              <option>{'New baby'}</option>
              <option>{'Medical Perscription'}</option>
              <option>{'Emergency Room Visit'}</option>
            </select>
            <label>{'Estimate cost'}</label>
            <input type="number" />
            <p className="help-text">{'Click the months below to simulate events.'}</p>
          </div>
        </div>

        <div className="month-container">
          <h2>{'Enrollment Period'}</h2>

          {planMonths.map(month => (
            <Month
              key={month.title}
              title={month.title}
              events={month.events}
              addEvent={(event) => this.addEvent(event, month.title)}
            />
          ))}

          <div className="total">
            {'Estimated Total'}
          </div>
        </div>
        <div className="plan-container">

          {availablePlans.map(plan => (
            <div key={plan.id} className="plan">
              <div className="plan-column">{plan.name}</div>

              {planMonths.map(month => (
                <div key={month.title} className="plan-column m1">
                  {`$ ${plan.premium + calculateCost(month, plan)}`}
                </div>
              ))}

              <div className="plan-column m1 purple">{`$ ${plan.totalCost + planMonths.reduce((acc, m) => (plan.premium + acc), 0)}`}</div>
            </div>
          ))}
        </div>

      </div>
    )
  }
}

export default App
