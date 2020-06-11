import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, Button } from 'react-native';
import logo from './logo.svg';
import './Screen1.css';

export default class Screen1 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            min: '',
            max: '',
            response: '',
            post: '',
            responseToPost1: '',
            responseToPost2: '',
            isLoading: false,
        };
    }

    acessarApp() {
        this.setState({ isLoading: false });
        this.props.navigation.replace('Screen2');//aqui manda pra screen2
    }

    onChangeHandler(field, value) {
        this.setState({ [field]: value });
    }

    renderButton() {
        if (this.state.isLoading)
            return <ActivityIndicator size="large" style={styles.loading} />;

        return (
            <View style={styles.btn}>
                <Button
                    title='SORTEAR'
                    color='#a08af7'
                    onPress={() => this.acessarApp()}
                />
            </View>
        )
    }

    componentDidMount() {
        this.callApi()
            .then(res => this.setState({ response: res.express }))
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/mensagem');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch('/api/num1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: this.state.min }),
        });
        const body = await response.text();

        this.setState({ responseToPost1: body });
    };

    handleTimbus = async f => {
        f.preventDefault();
        const response = await fetch('/api/num2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: this.state.max }),
        });
        const body = await response.text();

        this.setState({ responseToPost2: body });
    };

    render() {
        return (
            <div className="Screen1">
                <header className="Screen1-header">
                    <img src={logo} className="Screen1-logo" alt="logo" />
                    <h4 className="Screen1-title">Sorteador</h4>
                </header>
                <p className="Screen1-intro">{this.state.response}</p>

                <form onSubmit={this.handleSubmit}>
                    <input
                        placeholder="From: (min number)"
                        type="text"
                        value={this.state.min}
                        onChange={e => this.setState({ min: e.target.value })}
                    />
                    <button type="submit"
                        color='white'
                    >SENTmin
					</button>
                </form>
                <form onSubmit={this.handleTimbus}>
                    <input
                        placeholder="To: (max number)"
                        type="text"
                        value={this.state.max}
                        onChange={f => this.setState({ max: f.target.value })}
                    />
                    <button
                        type="submit"
                        color='white'
                    >SENTmax
					</button>
                </form>
                <p>{this.state.responseToPost1}</p>
                <p>{this.state.responseToPost2}</p>
                {this.renderButton()}
            </div>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'white',
        marginTop: 5,
        marginBottom: 5,
        elevation: 0.5,
    },
    scrv: {
        backgroundColor: '#2C1526',
    },
    input: {
        paddingLeft: 5,
        paddingRight: 5,
    },
    btn: {
        paddingTop: 20,
        fontSize: 11,
    },
    loading: {
        padding: 20,
    }
});