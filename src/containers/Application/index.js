import React from 'react'
import ReactTooltip from 'react-tooltip'


var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  // the default value for minimumFractionDigits depends on the currency
  // and is usually already 2
});

const Month = ({ title, events, addEvent }) => (
  <div className="month m1" onClick={addEvent}>
    <div className="title">{title}</div>

    {events.map(event => (
      <div key={event.x}>
        <div
          data-tip
          data-for={`happyFace${event.x}`}
          className="event"
          style={{top: event.y, left: event.x}}
        />
        <ReactTooltip id={`happyFace${event.x}`}>
          <p>{event.name}</p>
        </ReactTooltip>
      </div>
    ))}

  </div>
)

const calculateCost = (month, plan) => {
  return month.events.reduce((acc, event) => (
    acc + event.calculatedCosts.find(obj => obj.planId === plan.id).value
  ), 0)
}

const calculateEventCost = (rawCost, plan) => {
  if (rawCost + plan.totalCost >= plan.ded) { console.log('yo'); return plan.ded - plan.totalCost }
  if (plan.totalCost >= plan.ded) return 0
  return rawCost
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

const events = [
  { name: 'Doctor visit', cost: 50 },
  { name: 'New baby', cost: 6000 },
  { name: 'Emergency room visit', cost: 3000 },
  { name: 'Perscription Medicine', cost: 500 },
]

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cost: 50,
      eventName: 'Doctor visit',
      availablePlans: [
        {
          name: 'Aetna Bronze Plan',
          color: "c1",
          premium: 0,
          ded: 5000,
          max: 6000,
          totalCost: 0,
          id: 1
        },
        {
          name: 'Aetna Silver Plan',
          premium: 150,
          color: "c2",
          ded: 3500,
          max: 4500,
          totalCost: 0,
          id: 2
        },
        {
          name: 'Aetna Gold Plan',
          color: "c3",
          premium: 250,
          ded: 1000,
          max: 2000,
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
        },
        {
          title: 'Mar',
          events: []
        },
        {
          title: 'Apr',
          events: []
        },
        {
          title: 'May',
          events: []
        },
        {
          title: 'Jun',
          events: []
        },
        {
          title: 'Jul',
          events: []
        },
        {
          title: 'Aug',
          events: []
        },
        {
          title: 'Sept',
          events: []
        },
        {
          title: 'Oct',
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
            name: this.state.eventName,
            x, y,
            rawCost: this.state.cost,
            calculatedCosts: [
              ...this.state.availablePlans.map(plan => (
                { planId: plan.id, value: calculateEventCost(this.state.cost, plan) }
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
        <div className="top-section">
          <div className="panel">
            <div className="event-panel">
              <label>{'Estimate event'}</label>
              <select className="m1" onChange={(e) => this.setState({ eventName: events.find(ev => ev.name === e.target.value).name, cost: events.find(ev => ev.name === e.target.value).cost, selectedEvent: e.target.value })}>

                {events.map(medicalEvent => (
                  <option key={medicalEvent.name}>{medicalEvent.name}</option>
                ))}

              </select>
              <label>{'Estimate cost'}</label>
              <input type="number" value={this.state.cost} onChange={(e) => this.setState({ cost: parseInt(e.target.value) })} />
              <p className="help-text">{'Click the months below to simulate events.'}</p>
            </div>
          </div>
          <div className="panel">
            <div className="total-panel">
              <div className="total purple">
                {'Available Plans & Totals'}
              </div>

              {availablePlans.map(plan => (
                <div key={plan.id} className="totals-container plan-summary">

                  <div className="plan-column"><span className={`swatch ${plan.color}`} />{plan.name}</div>
                  <div className="plan-column m1 purple">{formatter.format(plan.totalCost + planMonths.reduce((acc, m) => (plan.premium + acc), 0))}</div>
                </div>
              ))}

            </div>
          </div>
        </div>

        <div className="month-container">
          <h2>{'Coverage Period'}</h2>

          {planMonths.map(month => (
            <div key={month.title} className="mc">
              <Month
                key={month.title}
                title={month.title}
                events={month.events}
                addEvent={(event) => this.addEvent(event, month.title)}
              />

              {availablePlans.map(plan => (
                <div key={plan.id} className={`plan ${plan.color}`}>
                  {formatter.format(plan.premium + calculateCost(month, plan))}
                </div>
              ))}

            </div>

          ))}

        </div>
      </div>
    )
  }
}

export default App
