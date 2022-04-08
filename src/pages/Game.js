import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { getTrivia } from '../services/apiRequest';
import './Game.css';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      answers: [],
      foiRespondido: false,
      time: 30,
      answerBtnDisable: false,
    };
  }

  async componentDidMount() {
    const { token } = this.props;
    const questions = await getTrivia(token);
    const fiveSeconds = 5000;
    this.setState({
      questions,
    });
    this.answerShuffle();
    setTimeout(() => this.timer(), fiveSeconds);
  }

  // componentDidUpdate() {
  //   this.disableBtn();
  // }

  // disableBtn = () => {
  //   const { time } = this.state;
  //   if (time === 0) {
  //     this.setState({ answerBtnDisable: true });
  //   }
  // }

  answerShuffle = async () => {
    const { questions: { results } } = this.state;
    const answersArray = [];
    const bliu = {
      answer: results[0].correct_answer,
      type: 'correct-answer' };
    answersArray.push(bliu);

    results[0].incorrect_answers.forEach((wrongAnswer) => {
      answersArray.push({
        answer: wrongAnswer,
        type: 'wrong-answer',
      });
      const magicNumber = 0.5;
      answersArray.sort(() => Math.random() - magicNumber);
    });
    // https://flaviocopes.com/how-to-shuffle-array-javascript/
    this.setState({ answers: answersArray });
  }

  triggerColor = () => {
    this.setState({ foiRespondido: true });
  }

  timer = () => {
    const oneSecond = 1000;
    const one = 1;
    setInterval(() => {
      const { time } = this.state;
      if (time === 0) {
        this.setState({ answerBtnDisable: true });
        // clearInterval
      }
      this.setState((prevState) => ({ time: prevState.time - one }));
    }, oneSecond);
  }

  render() {
    const { placar, name, email } = this.props;
    const {
      questions: { results },
      answers,
      foiRespondido,
      time, answerBtnDisable } = this.state;
    return (
      <div>
        <Header placar={ placar } name={ name } email={ email } />
        <div>
          <h1 data-testid="question-category">{ (results) && results[0].category}</h1>
          <p data-testid="question-text">{ (results) && results[0].question }</p>
        </div>
        <div data-testid="answer-options">
          { answers.map((ans, index) => (
            <button
              key={ index }
              type="button"
              data-testid={ ans.type }
              value={ ans.type }
              className={ foiRespondido ? ans.type : null }
              onClick={ this.triggerColor }
              disable={ answerBtnDisable }
            >
              {ans.answer}
            </button>
          ))}
        </div>
        <span>
          Timer:
          {'  '}
          { time }
        </span>
        <button type="button" style={ { display: 'none' } }>Próxima</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.player.name,
  placar: state.player.score,
  email: state.player.gravatarEmail,
  token: state.token,
});

export default connect(mapStateToProps, null)(Game);

Game.propTypes = {
  email: PropTypes.string,
  name: PropTypes.string,
  placar: PropTypes.number,
}.isRequired;
