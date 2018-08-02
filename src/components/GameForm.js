import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { saveGame,fetchGame,updateGame} from '../actions';
import { Redirect } from 'react-router-dom';


class GameForm extends Component{
    constructor(props){
        super(props)
        this.state={
            _id: this.props.game ? this.props.game._id : null,
            title: this.props.game ? this.props.game.title : '',
            cover: this.props.game ? this.props.game.cover : '',
            error:{},
            loading: false,
            done:false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        const { match } = this.props;
        if (match.params._id) {
          this.props.fetchGame(match.params._id);
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
          _id: nextProps.game._id,
          title: nextProps.game.title,
          cover: nextProps.game.cover
        })
      }
    handleChange(e){
        if (!!this.state.error[e.target.name]) {
            let error = Object.assign({}, this.state.error);
            delete error[e.target.name];
            this.setState({
              [e.target.name]: e.target.value,
              error
            });
          } else {
            this.setState({
              [e.target.name]: e.target.value,
            });
          }
    }
    handleSubmit(e){
        e.preventDefault()
        let error={};
        if(this.state.title===''){
            error.title="cann't be empty"
        }
        if(this.state.cover===''){
            error.cover="cann't be empty"
        }
        this.setState({error});
        const isValid = Object.keys(error).length === 0

        if (isValid) {
            const { _id, title, cover } = this.state;
            this.setState({ loading: true });
            if (_id) {
              this.props.updateGame({ _id, title, cover }).then(
                () => { this.setState({ done: true }) },
                (err) => err.response.json().then(({ error }) => { this.setState({ error, loading: false }) })
              )
            } else {
              this.props.saveGame({ title, cover }).then(
                () => { this.setState({ done: true }) },
                (err) => err.response.json().then(({ error }) => { this.setState({ error, loading: false }) })
              )
            }
          }
    }
    render(){
        const form =(
            <form className={ classnames('ui', 'form', { loading: this.state.loading }) } onSubmit={this.handleSubmit}>
                <h1>Add new game</h1>
                { !!this.state.error.global && <div className="ui negative message">{ this.state.error.global }</div> }
                <div className={classnames('field',{error:!!this.state.error.title})}>
                    <label htmlFor="title">Title</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={this.state.title}
                        onChange={this.handleChange}/>
                    <span>{this.state.error.title}</span>
                </div>
                <div className={classnames('field',{error:!!this.state.error.cover})}>
                    <label htmlFor="cover">cover url</label>
                    <input 
                        type="text" 
                        name="cover" 
                        value={this.state.cover}
                        onChange={this.handleChange}/>
                     <span>{this.state.error.cover}</span>
                </div>
                <div className="field">
                    {this.state.cover !==''&&<img src={this.state.cover} alt="cover" className="ui small bordered image"/>}
                </div>
                <div className="field">
                    <button className="ui primary button">add</button>
                </div>
            </form>
        )
        return(
            <div>
                { this.state.done ? <Redirect to="/games" /> : form }
            </div>
        )
    }
}
GameForm.propTypes={
    title:PropTypes.string,
    cover:PropTypes.func
}
const mapStateToProps = (state, props) => {
    const { match } = props;
    if (match.params._id) {
      return {
        game: state.games.find(item => item._id === match.params._id)
      };
    }
  
    return { game: null };
  };
export default connect(mapStateToProps,{saveGame,fetchGame,updateGame})(GameForm);