import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import { Settings } from '@material-ui/icons';
import getToken from '../services/apiRequest';
import { tokenAction, saveUser } from '../redux/actions';
import './Login.css';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      gravatarEmail: '',
      isPlayBtnDisabled: true,
    };
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value }, this.validation);
  }

  validation = () => {
    const { name, gravatarEmail } = this.state;
    this.setState({
      isPlayBtnDisabled: !(name && gravatarEmail),
    });
  }

  onPlayBtnClick = async () => {
    const { name, gravatarEmail } = this.state;
    const { tokenDispatch, history, userDispatch } = this.props;
    const token = await getToken();
    tokenDispatch(token);
    userDispatch({ name, gravatarEmail });
    history.push('/gameplay');
  }

  onConfigClick = () => {
    const { history } = this.props;
    history.push('/settings');
  }

  render() {
    const { name, gravatarEmail, isPlayBtnDisabled } = this.state;
    return (
      <div className="container-login">
        <fieldset className="login">
          <input
            type="text"
            data-testid="input-player-name"
            placeholder="Digite seu nome"
            name="name"
            value={ name }
            onChange={ this.handleChange }
            className="form-control"
          />
          <input
            type="text"
            data-testid="input-gravatar-email"
            placeholder="Digite seu email"
            name="gravatarEmail"
            value={ gravatarEmail }
            onChange={ this.handleChange }
            className="form-control"
          />
          <div className="container-buttons">
            <button
              type="button"
              data-testid="btn-play"
              disabled={ isPlayBtnDisabled }
              onClick={ this.onPlayBtnClick }
              className={ !isPlayBtnDisabled ? 'bounce' : 'no-bounce' }
            >
              PLAY
            </button>
          </div>
          <button
            type="button"
            data-testid="btn-settings"
            onClick={ this.onConfigClick }
            className="config-button"
          >
            <Settings fontSize="large" className="setting-btn" />
          </button>
        </fieldset>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  tokenDispatch: (token) => (dispatch(tokenAction(token))),
  userDispatch: (userInfo) => (dispatch(saveUser(userInfo))),
});
export default connect(null, mapDispatchToProps)(Login);

Login.propTypes = {
  history: Proptypes.shape({
    push: Proptypes.func.isRequired,
  }).isRequired,
  tokenDispatch: Proptypes.func.isRequired,
  userDispatch: Proptypes.func.isRequired,
};
