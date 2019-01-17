import React from 'react'
import axios from 'axios'


class Application extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      deckId: null,
      cards: [],
      outOfCards: false
    }

    this.drawCard = this.drawCard.bind(this)
  }

  componentDidMount() {
    axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(response => {
        this.setState({ deckId: response.data.deck_id })
      })
  }

  drawCard() {
    const { deckId } = this.state

    axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
      .then(response => {
        if (response.data.remaining < 1) {
          this.setState({ outOfCards: true })
        } else {
          this.setState({
            cards: [
              ...this.state.cards,
              {
                imageLink: response.data.cards[0].image,
                id: response.data.cards[0] + response.data.remaining
              }
            ]
          })
        }
      })
  }

  render() {
    return (
      <div>
        <h3>Deck of Cards</h3>
        <button
          type="button"
          onClick={this.drawCard}
          disabled={this.state.outOfCards}
        >
          Draw a card
        </button>
        <div className="card-pile">
          {this.state.cards.map(cardObj => (
            <img key={cardObj.id} src={cardObj.imageLink} className="card" />
          ))}
        </div>
      </div>
    )
  }
}

export default Application
